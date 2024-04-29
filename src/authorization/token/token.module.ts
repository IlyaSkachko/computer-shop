import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Strategy, ExtractJwt } from 'passport-jwt';


@Module({
  providers: [TokenService, JwtService],
  exports: [TokenService]
})
export class TokenModule {}
