import { ArgumentsHost, Catch, ConsoleLogger, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { CustomLogger } from "src/modules/customLogger/logger.service";
import { UserRequest } from '../../modules/auth/auth.guard';

@Catch()
export class ExceptionFilterGlobal implements ExceptionFilter {
  constructor(
    private adapterHost: HttpAdapterHost
  ) {}

  private readonly logger = new CustomLogger(ExceptionFilterGlobal.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.adapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request | UserRequest>();

    const endpoint = httpAdapter.getRequestUrl(request);
    const method = httpAdapter.getRequestMethod(request);
    
    if ('user' in request) {
      this.logger.log(`Endpoint: ${endpoint} | Action: ${method} | acessado pelo usuário ${request.user.sub}`)
    }

    const { status, body} = exception instanceof HttpException
      ? {
        status: exception.getStatus(),
        body: exception.getResponse()
      }
      : {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          method: method,
          url: endpoint
        }
      }
    
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception, ExceptionFilterGlobal.name)
    }

    httpAdapter.reply(response, body, status)
  }
}