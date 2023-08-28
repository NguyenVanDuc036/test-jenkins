import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpStatus } from '@nestjs/common';
import { JWT_CONFIG } from '@src/common/configs/env';
import { UsersService } from '@src/modules/users/users.service';
import { ExceptionResponse } from '@src/common/exceptions/response.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.secret,
    });
  }

  async validate(payload: any) {
    const isUser = await this.userService.findUserById(payload.id);

    if (!isUser)
      throw new ExceptionResponse(HttpStatus.UNAUTHORIZED, 'Invalid Token');

    return payload;
  }
}
