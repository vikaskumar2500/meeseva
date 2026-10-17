import { env } from '../../../config/env.js';
import type { IEmailProvider } from '../../../domain/interfaces/notification.provider.interface.js';

export class SendGridEmailProvider implements IEmailProvider {
  readonly name = 'SendGridEmailProvider';

  isAvailable(): boolean {
    const { SENDGRID_API_KEY, OTP_EMAIL_FROM } = env;
    return Boolean(SENDGRID_API_KEY && OTP_EMAIL_FROM);
  }

  async sendEmail(
    to: string,
    subject: string,
    content: string
  ): Promise<boolean> {
    const { SENDGRID_API_KEY, OTP_EMAIL_FROM } = env;

    if (!this.isAvailable()) {
      return false;
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: OTP_EMAIL_FROM },
        subject,
        content: [{ type: 'text/plain', value: content }],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `SendGrid email dispatch failed: ${response.status} ${body}`
      );
    }

    return true;
  }
}

export class MockEmailProvider implements IEmailProvider {
  readonly name = 'MockEmailProvider';
  private sentEmails: Array<{
    to: string;
    subject: string;
    content: string;
    timestamp: Date;
  }> = [];

  isAvailable(): boolean {
    return true;
  }

  async sendEmail(
    to: string,
    subject: string,
    content: string
  ): Promise<boolean> {
    this.sentEmails.push({ to, subject, content, timestamp: new Date() });
    if (env.NODE_ENV !== 'test') {
      console.info(`[Email to ${to}] Subject: ${subject}\nContent: ${content}`);
    }
    return true;
  }

  getSentEmails() {
    return [...this.sentEmails];
  }

  clear() {
    this.sentEmails = [];
  }
}
