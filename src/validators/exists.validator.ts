import { Inject, Injectable } from '@nestjs/common';
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import type { Model } from 'sequelize-typescript';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
@ValidatorConstraint({ name: 'exists', async: true })
export class ExistsValidator implements ValidatorConstraintInterface {
  constructor(@Inject(Sequelize.name) private readonly sequelize: Sequelize) {}
  public async validate<E>(value: string, args: IExistsValidationArguments<E>): Promise<boolean> {
    const [entityClass, findCondition = args.property] = args.constraints;
    return (
      (await this.sequelize.getRepository(entityClass).count({
        where:
          typeof findCondition === 'function'
            ? findCondition(args)
            : {
                [findCondition || args.property]: value,
              },
      })) > 0
    );
  }

  defaultMessage(args: ValidationArguments): string {
    const [entityClass] = args.constraints;
    const entity = entityClass.name || 'Entity';

    return `The selected ${args.property}  does not exist in ${entity} entity`;
  }
}

type ExistsValidationConstraints<E> = [new () => Model, ((validationArguments: ValidationArguments) => any) | keyof E];

interface IExistsValidationArguments<E> extends ValidationArguments {
  constraints: ExistsValidationConstraints<E>;
}

export function Exists<E>(
  constraints: Partial<ExistsValidationConstraints<E>>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints,
      validator: ExistsValidator,
    });
  };
}
