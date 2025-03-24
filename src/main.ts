import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config(); // Read base environment (.env) from root

async function bootstrap() {
  const logger = new Logger();
  console.log('process.env.environment', process.env.environment);

  try {
    const environment = process.env.environment ?? '';
    logger.debug(`./environments/${environment}.env`);
    dotenv.config({ path: `./environments/${environment}.env` });
  } catch (error) {
    logger.error(`Init source met error with environment: ${error.message}`);
  }

  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  // Use this pipe for handle validation input error at DTO - If not have custom pipe
  app.enableCors({});


  await app.listen(PORT, () =>
    logger.debug(`Service is listening on Port: ${PORT}`),
  );
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
