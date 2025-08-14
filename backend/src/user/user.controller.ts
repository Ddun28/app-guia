import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseInterceptors,
  Res,
  HttpStatus,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import type { Response } from 'express'; 
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { UserService } from './user.service';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';

@Controller('users')
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService, 
  ) {}

  @Post()
  async create(@Body() body: { nombre: string; apellido: string; email: string; password: string }) {
    if (!body.email) {
      return {
        message: 'El email es requerido',
        result: null
      };
    }

    const existingUser = await this.userService.findUserByEmail(body.email);
    if (existingUser) {
      return {
        message: 'El correo electrónico ya está registrado',
        result: null
      };
    }
    
    const user = await this.userService.createUser(body);
    const userObject = user.toObject(); 

    const verificationToken = this.generateVerificationToken();
    await this.userService.createVerification(user._id.toString(), verificationToken);

    this.sendVerificationEmail(user.email, verificationToken);

    const { password, ...result } = userObject;

    return {
      message: 'Usuario creado exitosamente. Por favor verifica tu email.',
      result
    };
  }

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    const verification = await this.userService.findVerificationByToken(token);
    
    if (!verification) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Token de verificación inválido o expirado',
        result: null
      });
    }

    const verificationId = verification._id.toString();
    const userId = verification.user_id.toString();

    const user = await this.userService.updateUser(userId, { 
      email_verified_at: new Date() 
    });

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Usuario no encontrado',
        result: null
      });
    }

    await this.userService.deleteVerification(verificationId);
    
    return res.status(HttpStatus.OK).json({
      message: 'Email verificado exitosamente',
      result: user
    });
  }

  @Post('resend-verification')
  async resendVerification(@Body() { email }: { email: string }) {
    const user = await this.userService.findUserByEmail(email);
    
    if (!user) {
      return {
        message: 'Usuario no encontrado',
        result: null
      };
    }

    // Convertimos user._id a string
    const userId = user._id.toString();

    if (user.email_verified_at) {
      return {
        message: 'Este email ya está verificado',
        result: null
      };
    }

    // Eliminar verificaciones anteriores - Implementamos esta función en el servicio
    await this.userService.deleteVerificationsForUser(userId);
    
    // Crear y enviar nueva verificación
    const verificationToken = this.generateVerificationToken();
    await this.userService.createVerification(userId, verificationToken);
    this.sendVerificationEmail(user.email, verificationToken);

    return {
      message: 'Email de verificación reenviado',
      result: null
    };
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAllUsers();
    return {
      message: users.length > 0 
        ? 'Usuarios obtenidos exitosamente' 
        : 'No hay usuarios registrados',
      result: users
    };
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return {
        message: 'Usuario no encontrado',
        result: null
      };
    }
    return {
      message: 'Usuario encontrado exitosamente',
      result: user
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<{ nombre: string; apellido: string; email: string }>) {
    const updatedUser = await this.userService.updateUser(id, body);
    if (!updatedUser) {
      return {
        message: 'Usuario no encontrado',
        result: null
      };
    }
    return {
      message: 'Usuario actualizado exitosamente',
      result: updatedUser
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedUser = await this.userService.updateUser(id, { email_verified_at: null });
    if (!deletedUser) {
      return {
        message: 'Usuario no encontrado',
        result: null
      };
    }
    return {
      message: 'Usuario marcado como no verificado exitosamente',
      result: deletedUser
    };
  }

  @Post('verify')
    async verifyEmailFromFrontend(@Body() { token }: { token: string }) {
    const verification = await this.userService.findVerificationByToken(token);
    
    if (!verification) {
        throw new BadRequestException('Token de verificación inválido o expirado');
    }

    const verificationId = verification._id.toString();
    const userId = verification.user_id.toString();

    const user = await this.userService.updateUser(userId, { 
        email_verified_at: new Date() 
    });

    if (!user) {
        throw new NotFoundException('Usuario no encontrado');
    }

    await this.userService.deleteVerification(verificationId);
    
    return {
        message: 'Email verificado exitosamente',
        result: user
    };
    }

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

   private async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      await this.emailService.sendVerificationEmail(email, token);
    } catch (error) {
      console.error('Error en sendVerificationEmail:', error);
    }
  }
}