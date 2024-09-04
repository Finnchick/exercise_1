import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { SignMiddleware } from './sign/sign.middleware';
import { AppService } from './app.service';
import { PageModule } from './page/page.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    PageModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        KEY: Joi.string().required(),
        PORT: Joi.number().port().default(3000),
      }),
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SignMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
