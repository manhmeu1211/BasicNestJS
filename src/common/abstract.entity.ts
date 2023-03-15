import { Column, DataType, Model } from 'sequelize-typescript';

import { CustomError } from '../exceptions/custom-error.exception';
import type { Constructor } from '../types';
import type { AbstractDto } from './dto/abstract.dto';
import type { PageMetaDto } from './dto/page-meta.dto';
import type { PageOptionsDto } from './dto/page-options.dto';

export abstract class AbstractEntity<DTO extends AbstractDto = AbstractDto, O = never> extends Model {
  static paginate: (
    options: PageOptionsDto,
    condition?: any,
    relation?: any,
    orderBy?: string[],
  ) => Promise<[AbstractEntity[], PageMetaDto]>;

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  private dtoClass: Constructor<DTO, [AbstractEntity, O?]>;

  toDto(options?: O): DTO {
    const dtoClass = this.dtoClass;

    if (!dtoClass) {
      throw new CustomError('error.need_use_dto');
    }

    return new this.dtoClass(this, options);
  }
}
