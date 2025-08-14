import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { AuthModule } from './user/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule, 
    UserModule,
    AuthModule,
    EmailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}