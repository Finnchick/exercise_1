import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private readonly logger = new Logger(SignMiddleware.name),
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const hash = createHash('sha256');
    const xSign = req.headers['x-sign'];

    if (!xSign) {
      res.status(400).send('x-sign header is required');
    }

    hash.update(req.url + this.configService.get('KEY'));

    if (hash.digest('hex') !== xSign) {
      this.logger.error(
        'x-sign header is invalid',
        xSign,
        req.url + this.configService.get('KEY'),
      );
      res.status(401).send('x-sign header is invalid');
    } else {
      next();
    }
  }
}
