import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//Config basic nest js app
async function serverListener() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const PORT: number = parseInt(process.env.PORT as string, 10);
  await app.listen(PORT);
  console.log(`Server listen on PORT: ${PORT}`)
}

serverListener();
