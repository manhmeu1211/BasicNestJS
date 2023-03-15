import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, UnprocessableEntityException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ValidationError } from 'class-validator';
import type { Request, Response } from 'express';
import _ from 'lodash';

import { ContextProvider } from '../providers/context.provider';
import { TranslationService } from '../shared/services/translation.service';

@Catch(UnprocessableEntityException)
export class HttpExceptionFilter implements ExceptionFilter<UnprocessableEntityException> {
  constructor(public reflector: Reflector, public translation: TranslationService) {}

  async catch(exception: UnprocessableEntityException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const r = exception.getResponse() as { message: ValidationError[] };

    const validationErrors = r.message;
    await this.validationFilter(validationErrors, request);
    response.status(statusCode).json(r);
  }

  private async validationFilter(validationErrors: ValidationError[], req: Request): Promise<void> {
    for (const validationError of validationErrors) {
      const children = validationError.children;

      if (children && !_.isEmpty(children)) {
        await this.validationFilter(children, req);
        return;
      }

      delete validationError.children;
      delete validationError.target;
      delete validationError.value;

      const constraints = validationError.constraints;

      if (!constraints) {
        return;
      }

      for (const [constraintKey, constraint] of Object.entries(constraints)) {
        if (!constraint) {
          constraints[constraintKey] = await this.translation.translate(`error.fields.${_.snakeCase(constraintKey)}`, {
            lang: ContextProvider.getLanguage(),
          });
        }
      }
    }
  }
}
