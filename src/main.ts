import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as config from 'config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'));

  const options = new DocumentBuilder()
    .setTitle('tasks example')
    .setDescription('The tasks API description')
    .setVersion('1.0')
    .addTag('tasks')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Handle CSRF vulnerability
  //app.use(csurf());

  // Implement rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // Add helmet middleware for security
  app.use(helmet());

  // Enable gzip compression
  app.use(compression());

  // Enable Cors
  app.enableCors();

  //Add global route prefix
  //app.setGlobalPrefix('v1');

  await app.listen(process.env.PORT || serverConfig.port);
  logger.log(`Application listening on port 3000`);
}
bootstrap();
