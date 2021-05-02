import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = new Date().getTime()

    return next.handle()
      .pipe(

        map(data => {

          const ctx = context.switchToHttp();

          const request = ctx.getRequest();
          const response = ctx.getResponse();
          const status = response.statusCode;
          const path = `${request.protocol}://${request.hostname}${request.originalUrl}`;

          const dataObject: IErrorContent = {

            message: "",
            data,
            status,

            request: {
              url: `${request.protocol}://${request.hostname}${request.originalUrl}`,
              method: request.method,
              body: request.body
            },


            is_sucess: true,
            response_time: (new Date().getTime() - now),
            timestamp: new Date().toLocaleTimeString()

          }


          console.log("the dataObject is", dataObject);
          response.status(dataObject.status).json({ dataObject })


        })



      )
  }
}
