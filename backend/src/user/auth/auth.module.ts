import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user.module'; 
import { AuthService } from './auth.service'; 
import { LocalStrategy } from './strategies/local.strategy'; 
import { JwtStrategy } from './strategies/jwt.strategy'; 
import { AuthController } from './auth.controller'; 

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
       }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}