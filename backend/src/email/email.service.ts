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
    
}