import { Inject, Injectable } from '@nestjs/common';
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import type { Model } from 'sequelize-typescript';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
@ValidatorConstraint({ name: 'unique', async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(@Inject(Sequelize.name) private readonly sequelize: Sequelize) {}

  public async validate<E>(value: string, args: IUniqueValidationArguments<E>): Promise<boolean> {
    const [entityClass, findCondition = args.property] = args.constraints;
    return (
      (await this.sequelize.getRepository(entityClass).count({
        where:
          typeof findCondition === 'function'
            ? findCondition(args)
            : {
                [findCondition || args.property]: value,
              },
      })) <= 0
    );
  }

  defaultMessage(args: ValidationArguments): string {
    const [entityClass] = args.constraints;
    const entity = entityClass.name || 'Entity';

    return `${entity} with the same ${args.property} already exists`;
  }
}

type UniqueValidationConstraints<E> = [new () => Model, ((validationArguments: ValidationArguments) => any) | keyof E];
interface IUniqueValidationArguments<E> extends ValidationArguments {
  constraints: UniqueValidationConstraints<E>;
}

export function Unique<E>(
  constraints: Partial<UniqueValidationConstraints<E>>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints,
      validator: UniqueValidator,
    });
  };
}
