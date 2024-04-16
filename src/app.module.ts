import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from './catalog/catalog.module';
import { AuthModule } from './authorization/auth.module';

@Module({
  imports: [CatalogModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
