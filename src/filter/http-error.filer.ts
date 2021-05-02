import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";


@Catch()
export class ErrorFilter implements ExceptionFilter {
    now = new Date().getTime();

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const errorContent: IErrorContent = {
            
            request: {
                url: `${request.protocol}://${request.hostname}${request.originalUrl}`,
                method: request.method,
                body: request.body
            },

            message: exception.message,
            status: exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
            response_time: (new Date().getTime() - this.now),
            is_sucess: false,
            data: null,
            timestamp: new Date().toLocaleTimeString()
        };

        response.status(errorContent.status).json({ errorContent })

    }

}