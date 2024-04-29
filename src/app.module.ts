import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from './catalog/catalog.module';
import { AuthModule } from './authorization/auth.module';
import { AdminModule } from './admin/admin.module';
import { TokenModule } from './authorization/token/token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CatalogModule, AuthModule, AdminModule, TokenModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
