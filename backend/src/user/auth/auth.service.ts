import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

 async validateUser(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new UnauthorizedException('Email y contraseña son requeridos');
    }

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuario no registrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const { password: _, ...result } = user.toObject();
    return result;
  }


  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}