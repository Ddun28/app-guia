import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false, 
      ignoreTLS: true, 
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/auth/verify?token=${token}`;
    
    const mailOptions = {
      from: `"App Guía" <${this.configService.get('EMAIL_FROM')}>`,
      to: email,
      subject: 'Verifica tu cuenta',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">¡Gracias por registrarte!</h1>
          <p style="font-size: 16px;">Para completar tu registro, por favor haz clic en el siguiente botón:</p>
          <a href="${verificationUrl}" 
          style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verificar mi cuenta
          </a>
          <p style="font-size: 14px; color: #6b7280;">
          O copia y pega este enlace en tu navegador:<br>
          <span style="word-break: break-all;">${verificationUrl}</span>
          </p>
      </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/auth/create-password?token=${token}`;
    
    const mailOptions = {
      from: `"App Guía" <${this.configService.get('EMAIL_FROM')}>`,
      to: email,
      subject: 'Restablecer tu contraseña',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Restablecer contraseña</h1>
          <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
          <p style="font-size: 16px;">Haz clic en el siguiente botón para crear una nueva contraseña:</p>
          
          <a href="${resetUrl}" 
          style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Restablecer contraseña
          </a>
          
          <p style="font-size: 14px; color: #6b7280;">
          O copia y pega este enlace en tu navegador:<br>
          <span style="word-break: break-all;">${resetUrl}</span>
          </p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 20px 0;">
          <p style="font-size: 14px; color: #dc2626; margin: 0;">
              ⚠️ <strong>Importante:</strong> Este enlace expirará en 1 hora por seguridad.
          </p>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">
          Si no solicitaste este restablecimiento, ignora este email y tu contraseña permanecerá sin cambios.
          </p>
      </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}