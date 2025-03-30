import { NestFactory } from '@nestjs/core';
import { ConsoleModule } from './console.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsoleModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
