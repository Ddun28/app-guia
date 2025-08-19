import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user.module'; 
import { AuthService } from './auth.service'; 
import { LocalStrategy } from './strategies/local.strategy'; 
import { JwtStrategy } from './strategies/jwt.strategy'; 
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthController } from './auth.controller'; 
import { UserProfilesModule } from '../user-profiles/user-profiles.module';

@Module({
  imports: [
    UserModule,
    UserProfilesModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}