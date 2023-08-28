import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { JwtToken } from '@src/modules/auth/enums/jwt-token.enum';
import { ExceptionResponse } from '../exceptions/response.exception';

export const GetUserByAccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request['user'];

    if (!user)
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Invalid token');

    if (user.typeToken !== JwtToken.ACCESS_TOKEN)
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'This is not an access token',
      );

    return user;
  },
);
