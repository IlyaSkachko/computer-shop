import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/authorization/token/token.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) { }

  use(req: any, res: any, next: () => void) {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      res.redirect("/auth");
    } else {
      this.tokenService.verifyJwtToken(accessToken);
      next();
    }
  }
}