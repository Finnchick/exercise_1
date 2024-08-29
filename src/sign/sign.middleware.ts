import { Injectable, NestMiddleware } from '@nestjs/common';
import {NextFunction, Request, Response} from "express";
import {createHash} from "crypto";

@Injectable()
export class SignMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const hash = createHash('sha256');
    const xSign = req.headers['x-sign']

    if (!xSign) {
      res.status(400).send('x-sign header is required')
    }

    switch (req.method) {
        case 'GET': case 'DELETE': // Za takoe dolzhni ubivat'?
            hash.update(req.url)
            break;
        case 'POST': case 'PUT':
            hash.update(req.url)
            const bodyString = JSON.stringify(req.body)
            hash.update(bodyString)
            break;
    }

    if (hash.digest('hex') !== xSign) {
      res.status(400).send('x-sign header is invalid')
    } else {
      next();
    }

  }
}
