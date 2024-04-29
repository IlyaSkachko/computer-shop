import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Strategy, ExtractJwt } from 'passport-jwt';


@Module({
  imports: [JwtModule],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
