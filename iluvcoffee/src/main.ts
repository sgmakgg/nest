import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "./common/filters/http-exception/http-exception.filter";
import {ApiKeyGuard} from "./common/guards/api-key/api-key.guard";
import {WrapResponseInterceptor} from "./common/interceptors/wrap-response/wrap-response.interceptor";
import {TimeoutInterceptor} from "./common/interceptors/timeout/timeout.interceptor";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
        forbidNonWhitelisted: true,
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
      }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
      new WrapResponseInterceptor(),
      new TimeoutInterceptor());

  const options = new DocumentBuilder()
      .setTitle('Iluvcoffee')
      .setDescription('Coffee app')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
