import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: string, _args: ValidationArguments) {
          return /^[\d!#$%&*@A-Z^a-z]*$/.test(value);
        },
      },
    });
  };
}
