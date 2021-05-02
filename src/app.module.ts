import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';

import config from '../orm.config';


@Module({
  imports: [TypeOrmModule.forRoot(config), UsersModule, AuthenticationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
