import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import  helmet from 'helmet'
import  compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(helmet());
  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle('Interconomy Blockchain Microservice')
    .setDescription(
      'The platform where all blockchain transactions are processed and custom tokens are created.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Interconomy Blockchain MS Docs',
  });

  await app.listen(process.env.PORT);
}
bootstrap();
