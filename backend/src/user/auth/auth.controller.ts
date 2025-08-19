import { Controller, Post, Request, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard'; 
import type { Response } from 'express';  
import { JwtAuthGuard } from './guards/jwt-auth.guard'; 
import { UserService } from '../user.service';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(req.user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400000, 
    });

    return { 
      message: 'Inicio de Sesión exitoso',
      access_token,
      user: req.user 
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logout exitoso' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userService.findUserByEmailWithProfile(req.user.email);

    const { password, ...userWithoutPassword } = user!.toObject(); 
    
    return userWithoutPassword;
  }
}