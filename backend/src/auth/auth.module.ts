import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';

@Module({
  exports: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const handler = toNodeHandler(auth);

    consumer
      .apply((req: any, res: any, next: () => void) => {
        handler(req, res);
      })
      .forRoutes({ path: 'api/auth/*', method: RequestMethod.ALL });
  }
}

