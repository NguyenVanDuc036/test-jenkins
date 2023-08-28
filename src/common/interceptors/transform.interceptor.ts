import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseOption<T> {
  status?: number;
  message?: string;
  data?: any;
  success?: boolean;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseOption<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseOption<T>> {
    const ctx = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((res) => {
        if (res)
          return res.hasOwnProperty('paginationOptions')
            ? {
                statusCode: ctx.statusCode || 200,
                data: res.data || null,
                message: res.message,
                success: true,
              }
            : res.hasOwnProperty('message')
            ? {
                statusCode: ctx.statusCode || 200,
                data: res.data || null,
                message: res.message,
                success: true,
              }
            : {
                statusCode: ctx.statusCode || 200,
                data: res || null,
                success: true,
              };
      }),
    );
  }
}
