import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.use(morgan('dev'))
  
  // Agregamos un middleware de validacion a todo el pipe de las requests
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(3000, (): void => {
    console.log(process.env.STAGE)
    console.log("Application listening at port 3000")
  })
}
bootstrap();
