import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isNotAuth = this.reflector.get<boolean, string>(
      'isNotAuth',
      context.getHandler(),
    );

    if (isNotAuth) {
      return true; // If the @IsNotAuth decorator is present, deny access
    }

    return super.canActivate(context); // Otherwise, proceed with JWT authentication
  }
}
