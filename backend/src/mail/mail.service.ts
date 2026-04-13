import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Sicontrola" <noreply@sicontrola.com>',
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      // Log explicit instruction for the user in development
      console.log(`[MAIL MOCK] To: ${to} | Subject: ${subject}`);
      return null;
    }
  }

  async sendConfirmationEmail(email: string, name: string) {
    const subject = 'Confirmação de Cadastro - Sicontrola';
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #00F0FF;">Olá, ${name}!</h2>
        <p>Seu cadastro inicial no <strong>Sicontrola</strong> foi realizado com sucesso.</p>
        <p>Para continuar, por favor acesse o sistema e complete seus dados escolares e anexe os documentos necessários.</p>
        <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
           <p style="margin: 0; font-size: 14px; color: #555;">Você está recebendo este e-mail porque se cadastrou no sistema de transporte estudantil municipal.</p>
        </div>
      </div>
    `;
    return this.sendMail(email, subject, html);
  }
}
