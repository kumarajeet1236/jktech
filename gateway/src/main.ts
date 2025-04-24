import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json } from "body-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json());
  app.use(helmet());

  const configService = app.get(ConfigService);
  const routePrefix = configService.get("server.routePrefix") || "api/v1";
  app.setGlobalPrefix(routePrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // API docs
  const config = new DocumentBuilder()
    .setTitle("Jk Teach POC API")
    .addBearerAuth()
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(routePrefix + "/swagger", app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port, "0.0.0.0");
}

bootstrap();
