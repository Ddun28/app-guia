import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpException } from '@nestjs/common';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
  error?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const request = httpContext.getRequest();

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data?.result) && data.result.length === 0) {
          response.status(404);
          return {
            statusCode: 404,
            message: data.message || 'No se encontraron resultados',
            data: [],
            path: request.url,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          statusCode: response.statusCode,
          message: data.message || '',
          data: data.result || data,
          path: request.url,
          timestamp: new Date().toISOString(),
        };
      }),
      catchError((error) => {
        if (error instanceof HttpException) {
          const status = error.getStatus();
          response.status(status);
          
          return throwError(() => ({
            statusCode: status,
            message: error.message,
            error: error.name,
            path: request.url,
            timestamp: new Date().toISOString(),
          }));
        }

        response.status(500);
        return throwError(() => ({
          statusCode: 500,
          message: 'Error interno del servidor',
          error: 'Internal Server Error',
          path: request.url,
          timestamp: new Date().toISOString(),
        }));
      })
    );
  }
}