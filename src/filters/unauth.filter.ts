import { ExceptionFilter, Catch, ArgumentsHost, HttpException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { ApiConfigService } from '../shared/services/api-config.service';

@Catch(UnauthorizedException)
export class ViewAuthFilter implements ExceptionFilter {
  constructor(private apiConfigService: ApiConfigService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    response.status(status).redirect(this.apiConfigService.getString('SAML_Redirect_NonAuth'));
  }
}
