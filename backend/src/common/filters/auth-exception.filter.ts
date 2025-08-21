import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let message = 'Credenciales inválidas';

    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'object' && exceptionResponse['message']) {
      message = exceptionResponse['message'];
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: 'Unauthorized'
    });
  }
}