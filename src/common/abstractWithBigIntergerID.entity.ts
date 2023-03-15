import { Column, DataType, Model } from 'sequelize-typescript';
import { CustomError } from '../exceptions/custom-error.exception';
import { Constructor } from '../types';
import { AbstractDto } from './dto/abstract.dto';
import { PageMetaDto } from './dto/page-meta.dto';
import { PageOptionsDto } from './dto/page-options.dto';

export abstract class AbstractWithBigIntIDEntity<DTO extends AbstractDto = AbstractDto, O = never> extends Model {
  private dtoClass: Constructor<DTO, [AbstractWithBigIntIDEntity, O?]>;
  static paginate: (
    options: PageOptionsDto,
    condition?: any,
    relation?: any,
    orderBy?: string[],
  ) => Promise<[AbstractWithBigIntIDEntity[], PageMetaDto]>;

  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  toDto(options?: O): DTO {
    const dtoClass = this.dtoClass;

    if (!dtoClass) {
      throw new CustomError('error.need_use_dto');
    }

    return new this.dtoClass(this, options);
  }
}
