import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import * as exphbs from 'express-handlebars';
import * as cookieParser from "cookie-parser";
import * as jwt from "jsonwebtoken";
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as passport from "passport";
// import { UserMiddleware } from './user/user.middleware';
import { DBRegistration } from './database/Users/DBRegistration';
import * as session from 'express-session';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());

  app.use(session({
    secret: 'MyComputerShop',
    resave: false,
    saveUninitialized: false,
  }));


  app.use(bodyParser.json());
  app.use(cookieParser());

  
  
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'public', 'images'));
  app.useStaticAssets(join(__dirname, '..', 'public', 'css'));
  app.useStaticAssets(join(__dirname, '..', 'public', 'js'));
  app.useStaticAssets(join(__dirname, '..', 'public', 'site-images'));
  app.useStaticAssets(join(__dirname, '..', 'public', 'fonts'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  const hbs = exphbs.create({ extname: 'hbs' });
  app.engine('hbs', hbs.engine);
  app.set('view engine', 'hbs');


  await app.listen(3000);
}
bootstrap();