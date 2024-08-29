import { Injectable, NestMiddleware } from '@nestjs/common';
import {NextFunction, Request, Response} from "express";
import {randomUUID} from 'crypto'

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  private readonly key: string

  constructor() {
    this.key = randomUUID()
    console.log('key', this.key)
    this.use = this.use.bind(this)
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['x-key'] !== this.key) {
        res.status(401).json({error: 'Unauthorized'})
    } else {
      next();
    }
  }
}
