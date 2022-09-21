// Un interceptor es una clase que puede hacer cosas durante una request
// Muy parecido a un middleware de express, se llama con app.use en el main
// cosas como, editar datos, transformarlos, etc
// Se puede poner a distintos niveles

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        return next.handle().pipe(map(data => instanceToPlain(data)))
    }
}