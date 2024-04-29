import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TokenService } from 'src/authorization/token/token.service';
import { JwtService } from '@nestjs/jwt';
// import { UserMiddleware } from './user.middleware';
import { TokenModule } from 'src/authorization/token/token.module';
import { JwtMiddleware } from 'src/authorization/auth.middleware';

@Module({
  imports: [TokenModule],
  controllers: [UserController],
  providers: [UserService, TokenService, JwtService],
  exports: [TokenService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(UserController);
  }
}
