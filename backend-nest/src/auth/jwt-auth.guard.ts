import {
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      // eslint-disable-next-line no-console
      console.error("JWT auth error:", err || info);
      throw err || new UnauthorizedException("Unauthorized");
    }
    return user;
  }
}
