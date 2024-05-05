import { BadRequestException, CanActivate, ExecutionContext, Injectable, Request } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";
import { ROLE } from "./role.enum";
import { DBToken } from "src/database/Users/DBToken";
import { TokenService } from "./token/token.service";

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly db: DBToken

    constructor(private reflector: Reflector, private readonly tokenService: TokenService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRoles) {
            return true;
        }


        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const token = request.cookies["refreshToken"];

        const verifyToken = await this.tokenService.verifyJwtToken(token);

        if (verifyToken) {
            return requiredRoles.some((role) => { return verifyToken.user.role === role });
        } else if (!verifyToken) {
            response.sendStatus(401);
        } else {
            response.statusCode = 400;
            response.send(`<h1>Bad Request</h1>`);
        }
    }
}