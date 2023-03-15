import type { AbstractEntity } from '../common/abstract.entity';
import type { AbstractWithBigIntIDEntity } from '../common/abstractWithBigIntergerID.entity';
import type { AbstractDto } from '../common/dto/abstract.dto';
import type { Constructor } from '../types';

export function UseDto(
  dtoClass: Constructor<
    AbstractDto | AbstractWithBigIntIDEntity,
    [AbstractEntity | AbstractWithBigIntIDEntity, unknown]
  >,
): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
