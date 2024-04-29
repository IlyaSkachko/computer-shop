import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TokenService } from 'src/authorization/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { UserMiddleware } from './user.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService, TokenService, JwtService],
  exports: [TokenService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes('user/profile');
  }
}
