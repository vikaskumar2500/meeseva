import { env } from '../../../config/env.js';
import type { ISmsProvider } from '../../../domain/interfaces/notification.provider.interface.js';

export class TwilioSmsProvider implements ISmsProvider {
  readonly name = 'TwilioSmsProvider';

  isAvailable(): boolean {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_PHONE } = env;
    return Boolean(
      TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_PHONE
    );
  }

  async sendSms(to: string, message: string): Promise<boolean> {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_PHONE } = env;

    if (!this.isAvailable()) {
      return false;
    }

    if (!this.isE164Phone(TWILIO_FROM_PHONE!)) {
      throw new Error(
        'TWILIO_FROM_PHONE must be an E.164 Twilio SMS-capable sender, e.g. +15551234567'
      );
    }

    const normalizedTo = to.startsWith('+') ? to : `+91${to}`;

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: TWILIO_FROM_PHONE!,
          To: normalizedTo,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Twilio OTP delivery failed: ${response.status} ${body}`);
    }

    return true;
  }

  private isE164Phone(phone: string): boolean {
    return /^\+[1-9]\d{1,14}$/.test(phone);
  }
}

export class MockSmsProvider implements ISmsProvider {
  readonly name = 'MockSmsProvider';
  private sentMessages: Array<{
    to: string;
    message: string;
    timestamp: Date;
  }> = [];

  isAvailable(): boolean {
    return true;
  }

  async sendSms(to: string, message: string): Promise<boolean> {
    this.sentMessages.push({ to, message, timestamp: new Date() });
    if (env.NODE_ENV !== 'test') {
      console.info(`[SMS to ${to}]: ${message}`);
    }
    return true;
  }

  getSentMessages() {
    return [...this.sentMessages];
  }

  clear() {
    this.sentMessages = [];
  }
}
