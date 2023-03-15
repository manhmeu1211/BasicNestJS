/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiBody } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ApiMultipleFile =
  (fileName = 'files'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    })(target, propertyKey, descriptor);
  };
