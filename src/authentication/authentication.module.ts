import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/entity/token.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';


@Module({
  imports: [TypeOrmModule.forFeature([Token]),
  JwtModule.register({
    secret:"secret",
    signOptions:{
      expiresIn:'60'
    }
  })
  


],
  providers: [AuthenticationService],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}
