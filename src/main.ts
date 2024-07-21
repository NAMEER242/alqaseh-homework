// noinspection JSIgnoredPromiseFromCall

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { corsOptions, swaggerOptions } from '@qaseh/config';
import { AppModule } from '@qaseh/bootstrap';
import { HttpExceptionFilter } from '@qaseh/filters';
import { AppConfigService } from '@qaseh/modules/config';
import { ErrorResponseFormatter } from '@qaseh/modules/formatter';

async function bootstrap() {
  // Create an instance of the NestApplication using AppModule
  const app = await NestFactory.create(AppModule);

  // Set global HTTP exception filter
  app.useGlobalFilters(
    new HttpExceptionFilter(app.get(ErrorResponseFormatter)),
  );

  // Set the logger level to display TypeORM logs
  // Note: This line is intended for development mode only
  app.useLogger(new Logger('NestApplication'));

  // Set up Swagger documentation
  SwaggerModule.setup(
    'api', // Swagger route path
    app, // NestApplication instance
    SwaggerModule.createDocument(app, swaggerOptions), // Swagger config
  );

  // Enable Cross-Origin Resource Sharing (CORS)
  // This allows your application to accept requests from different origins.
  // Make sure to configure CORS according to your security needs.
  app.enableCors(corsOptions);

  // Read the application's port from AppConfigService
  const appConfigService = app.get(AppConfigService);
  const port = appConfigService.port;

  // Start the application and listen on the specified port and IP
  // 0.0.0.0 allows the app to listen on all available network interfaces.
  await app.listen(port, '0.0.0.0');
}

bootstrap();
