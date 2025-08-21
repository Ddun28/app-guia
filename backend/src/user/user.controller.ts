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
  NotFoundException,
  UseGuards,
  Request,
  InternalServerErrorException,
  HttpException,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import type { Response } from 'express'; 
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { UserService } from './user.service';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UpdateFullProfileDto } from './dto/update-full-profile.dto'; 
import { UserProfilesService } from './user-profiles/user-profiles.service';
import { User } from './user.mongo.schema';
import * as bcrypt from 'bcrypt'; 
import mongoose from 'mongoose';

@Controller('users')
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService, 
    private readonly userProfilesService: UserProfilesService, 
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
    
    return res.status(HttpStatus.OK).json({
      message: 'Email verificado exitosamente',
      result: user
    });
  }

  @Post('resend-verification')
  async resendVerification(@Body() { email }: { email: string }) {
    const user = await this.userService.findUserByEmail(email);
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const userId = user._id.toString();

    if (user.email_verified_at) {
      throw new BadRequestException('Este email ya está verificado');
    }

    await this.userService.deleteVerificationsForUser(userId);
    
    const verificationToken = this.generateVerificationToken();
    await this.userService.createVerification(userId, verificationToken);
    this.sendVerificationEmail(user.email, verificationToken);

    return {
      message: 'Email de verificación reenviado',
      result: null
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    if (!email) {
      throw new BadRequestException('El email es requerido');
    }

    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return {
        message: 'Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña',
        result: null
      };
    }

    // Generar token de restablecimiento
    const resetToken = this.generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora de expiración

    // Guardar token en el usuario
    await this.userService.updateUser(user._id.toString(), {
      reset_password_token: resetToken,
      reset_password_expires: resetTokenExpiry
    });

    // Enviar email
    await this.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña',
      result: null
    };
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() { password }: { password: string }
  ) {
    if (!token) {
      throw new BadRequestException('Token de restablecimiento requerido');
    }

    if (!password || password.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
    }

    // Buscar usuario por token y verificar expiración
    const user = await this.userService.findUserByResetToken(token);
    if (!user) {
      throw new BadRequestException('Token de restablecimiento inválido o expirado');
    }

    if (user.reset_password_expires && user.reset_password_expires < new Date()) {
      throw new BadRequestException('Token de restablecimiento expirado');
    }

    // Actualizar contraseña y limpiar token
    await this.userService.updateUser(user._id.toString(), {
      password: password,
      reset_password_token: null,
      reset_password_expires: null
    });

    return {
      message: 'Contraseña restablecida exitosamente',
      result: null
    };
  }

  @Post('verify-reset-token/:token')
  async verifyResetToken(@Param('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token de restablecimiento requerido');
    }

    const user = await this.userService.findUserByResetToken(token);
    if (!user) {
      throw new BadRequestException('Token de restablecimiento inválido');
    }

    if (user.reset_password_expires && user.reset_password_expires < new Date()) {
      throw new BadRequestException('Token de restablecimiento expirado');
    }

    return {
      message: 'Token válido',
      result: { email: user.email }
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req) {
    const user = await this.userService.findUserById(req.user._id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const { password, ...result } = user.toObject();
    return {
      message: 'Usuario obtenido exitosamente',
      result
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const users = await this.userService.findAllUsers();
    return {
      message: users.length > 0 
        ? 'Usuarios obtenidos exitosamente' 
        : 'No hay usuarios registrados',
      result: users
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const { password, ...result } = user.toObject();
    return {
      message: 'Usuario encontrado exitosamente',
      result
    };
  }

  @Put('me/profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateFullProfile(
    @Request() req,
    @Body() body: UpdateFullProfileDto
  ) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new BadRequestException('ID de usuario no encontrado');

      // Validar que las contraseñas coincidan si se proporcionan
      if (body.new_password || body.new_password_confirmation) {
        if (!body.new_password || !body.new_password_confirmation) {
          throw new BadRequestException('Ambos campos de contraseña son requeridos');
        }
        
        if (body.new_password !== body.new_password_confirmation) {
          throw new BadRequestException('Las contraseñas no coinciden');
        }
      }

      // Preparar datos de usuario para actualización
      const userUpdateData: any = {
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email
      };

      // Agregar contraseña solo si se proporciona
      if (body.new_password) {
        userUpdateData.password = body.new_password;
      }

      // Actualizar usuario (campos básicos)
      const updatedUser = await this.userService.updateUser(userId, userUpdateData);

      // Preparar datos para perfil
      const profileData = {
        edad: body.edad,
        estado_civil: body.estado_civil,
        sexo: body.sexo,
        fecha_nacimiento: body.fecha_nacimiento,
        telefono: body.telefono,
        ubicacion: body.ubicacion
      };

      // Actualizar o crear perfil
      let profileResult;
      try {
        profileResult = await this.userProfilesService.update(userId, profileData);
      } catch (error) {
        if (error.message.includes('not found')) {
          profileResult = await this.userProfilesService.create({
            user_id: userId,
            ...profileData
          });
        } else {
          throw error;
        }
      }

      return {
        message: 'Perfil actualizado exitosamente',
        data: {
          user: updatedUser,
          profile: profileResult
        }
      };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  async deactivateAccount(@Request() req) {
    const deletedUser = await this.userService.updateUser(req.user._id, { 
      email_verified_at: null,
    });
    if (!deletedUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return {
      message: 'Cuenta desactivada exitosamente',
      result: null
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

  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      await this.emailService.sendVerificationEmail(email, token);
    } catch (error) {
      console.error('Error en sendVerificationEmail:', error);
      throw new Error('Error al enviar el email de verificación');
    }
  }

  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      await this.emailService.sendPasswordResetEmail(email, token);
    } catch (error) {
      console.error('Error en sendPasswordResetEmail:', error);
      throw new InternalServerErrorException('Error al enviar el email de restablecimiento');
    }
  }
}