/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { isString } from 'lodash';

import { ContextProvider } from '../providers/context.provider';
import { TranslationService } from '../shared/services/translation.service';

@Catch(HttpException)
export class HttpExceptionFilterAll implements ExceptionFilter<HttpException> {
  constructor(public reflector: Reflector, public translation: TranslationService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const r = exception.getResponse() as { message: string; error: string | undefined };
    if (isString(r.message)) {
      r.message = await this.translation.translate(r.message, {
        lang: ContextProvider.getLanguage(),
        args: {
          arg: r.error,
        },
      });
    }
    response.status(statusCode).json(r);
  }
}
