import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({whitelist:true}));

  const config= new DocumentBuilder()
      .setTitle("Rate limiter as a service")
      .setDescription("Distributed rate limiting API with multiple strategies")
      .setVersion('1.0')
      .addApiKey({type:'apiKey', in:'header', name:'X-API-KEY'},'api-key')
      .build();

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app,config));
  await app.listen(process.env.PORT ?? 3000);
  console.log(`App running on http://localhost:${process.env.PORT ?? 3000}/docs`);

}
bootstrap();
