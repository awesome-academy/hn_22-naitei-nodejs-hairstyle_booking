import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(bodyParser.json({ limit: "5mb" })); // NOTE: tăng limit JSON body lên 5MB
  app.use(bodyParser.urlencoded({ limit: "5mb", extended: true })); // NOTE: tăng limit form-data lên 5MB

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
