import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UsersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    //Handle validate, some logic before send request to controller (maybe check token ...)
    console.log('Request...');
    // Go next function
    next();
  }
}
