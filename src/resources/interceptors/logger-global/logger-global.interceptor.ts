import { CallHandler, ConsoleLogger, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { UserRequest } from 'src/modules/auth/auth.guard';

@Injectable()
export class LoggerGlobalInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();

    const request = ctx.getRequest<Request | UserRequest>();
    const response = ctx.getResponse<Response>();

    const { path, method } = request;
    const { statusCode } = response;
    const preRenderTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const executionTime = Date.now() - preRenderTime; 
        if ('user' in request) {
          this.logger.log(
            `Endpoint acessado pelo usuário ${request.user.sub}
             Path: ${path}
             Method: ${method}
             StatusCode: ${statusCode}
             Time: ${executionTime} ms
            `
          )
        }
      })
    );
  }
}
