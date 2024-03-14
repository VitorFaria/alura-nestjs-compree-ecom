import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class ExceptionFilterGlobal implements ExceptionFilter {
  constructor(private adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {

    const { httpAdapter } = this.adapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

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
          url: httpAdapter.getRequestUrl(request)
        }
      }

    httpAdapter.reply(response, body, status)
  }
}