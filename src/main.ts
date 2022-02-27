import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import * as _ from 'lodash';

dotenv.config();
const PORT: number = parseInt(process.env.PORT as string, 10);

//Config basic nest js app
async function serverListener() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cors());
  await app.listen(PORT);
}

serverListener();
