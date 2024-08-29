import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {AuthMiddleware} from "./auth/auth.middleware";
import {SignMiddleware} from "./sign/sign.middleware";
import {json} from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json());
  app.use(new AuthMiddleware().use, new SignMiddleware().use);
  await app.listen(3000);
}
bootstrap();
