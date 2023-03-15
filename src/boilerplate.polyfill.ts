/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any */
import 'source-map-support/register';

import { compact, map } from 'lodash';

import { AbstractEntity } from './common/abstract.entity';
import { AbstractWithBigIntIDEntity } from './common/abstractWithBigIntergerID.entity';
import { Order } from './common/constants/order';
import type { AbstractDto } from './common/dto/abstract.dto';
import { PageDto } from './common/dto/page.dto';
import { PageMetaDto } from './common/dto/page-meta.dto';
import type { PageOptionsDto } from './common/dto/page-options.dto';

// type GetConstructorArgs<T> = T extends new (...args: infer U) => any
//   ? U
//   : never;

declare global {
  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[], options?: any): Dto[];

    toPageDto<Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
      // FIXME make option type visible from entity
      options?: any,
    ): PageDto<Dto>;
  }
}

Array.prototype.toDtos = function <Entity extends AbstractEntity<Dto>, Dto extends AbstractDto>(options?: any): Dto[] {
  return compact(map<Entity, Dto>(this, (item) => item.toDto(options as never)));
};

Array.prototype.toPageDto = function (pageMetaDto: PageMetaDto, options?: any) {
  return new PageDto(this.toDtos(options), pageMetaDto);
};

function reverse(orderBy: Order): Order {
  if (orderBy === Order.ASC) {
    return Order.DESC;
  }
  return Order.ASC;
}

function getOrderBy(field: string, orderBy: Order): [any, Order] {
  if (field === 'updatedAt' || field === 'createdAt') {
    return [field, reverse(orderBy)];
  }
  return [field, orderBy];
}

AbstractWithBigIntIDEntity.paginate = async function (
  options: PageOptionsDto,
  condition?: any,
  relation?: any,
  orderBy?: string[],
): Promise<[AbstractWithBigIntIDEntity[], PageMetaDto]> {
  const offset = options.page ? options.take * (options.page - 1) : 0;
  const orders = orderBy?.map((order) => getOrderBy(order, options.order)) || [['id', options.order]];
  const data = await this.findAndCountAll({
    where: condition || {},
    include: relation || [],
    limit: options.take,
    offset,
    order: orders,
    subQuery: false,
  });
  const { count, rows } = data;
  const pageMetaDto = new PageMetaDto({
    itemCount: count,
    pageOptionsDto: options,
  });
  return [rows, pageMetaDto];
};

AbstractEntity.paginate = async function (
  options: PageOptionsDto,
  condition?: any,
  relation?: any,
  orderBy?: string[],
): Promise<[AbstractEntity[], PageMetaDto]> {
  const offset = options.page ? options.take * (options.page - 1) : 0;
  const orders = orderBy?.map((order) => getOrderBy(order, options.order)) || [['id', options.order]];
  const data = await this.findAndCountAll({
    where: condition || {},
    include: relation || [],
    limit: options.take,
    offset,
    order: orders,
    subQuery: false,
    distinct: true,
  });
  const { count, rows } = data;
  const pageMetaDto = new PageMetaDto({
    itemCount: count,
    pageOptionsDto: options,
  });
  return [rows, pageMetaDto];
};
