import { env } from '../../config/env.js';

type OtpPurpose = 'registration' | 'password_reset';

interface SendOtpInput {
  phone: string;
  email?: string;
  otp: string;
  purpose: OtpPurpose;
}

export class OtpDeliveryService {
  async sendOtp(input: SendOtpInput): Promise<void> {
    const message = this.buildMessage(input.otp, input.purpose);

    if (env.NODE_ENV === 'test') {
      return;
    }

    const deliveryResults = await Promise.allSettled([
      this.sendSms(input.phone, message),
      input.email
        ? this.sendEmail(input.email, input.otp, input.purpose)
        : Promise.resolve(false),
    ]);
    const delivered = deliveryResults.some(
      (result) => result.status === 'fulfilled' && result.value
    );

    if (!delivered) {
      if (env.NODE_ENV === 'production') {
        const errors = deliveryResults
          .filter(
            (result): result is PromiseRejectedResult =>
              result.status === 'rejected'
          )
          .map((result) =>
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason)
          );

        throw new Error(
          errors.length
            ? `OTP delivery failed: ${errors.join('; ')}`
            : 'OTP delivery provider is not configured'
        );
      }

      deliveryResults.forEach((result) => {
        if (result.status === 'rejected') {
          console.warn(
            result.reason instanceof Error
              ? result.reason.message
              : result.reason
          );
        }
      });
      console.warn(`[OTP][development fallback] ${input.phone}: ${input.otp}`);
    }
  }

  private buildMessage(otp: string, purpose: OtpPurpose): string {
    const action =
      purpose === 'password_reset'
        ? 'reset your MeeSeva Lite password'
        : 'verify your MeeSeva Lite account';
    return `Your OTP to ${action} is ${otp}. It is valid for 10 minutes.`;
  }

  private async sendSms(phone: string, message: string): Promise<boolean> {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_PHONE } = env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_PHONE) {
      return false;
    }

    if (!this.isE164Phone(TWILIO_FROM_PHONE)) {
      throw new Error(
        'TWILIO_FROM_PHONE must be an E.164 Twilio SMS-capable sender, for example +15551234567'
      );
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: TWILIO_FROM_PHONE,
          To: this.normalizePhone(phone),
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

  private async sendEmail(
    email: string,
    otp: string,
    purpose: OtpPurpose
  ): Promise<boolean> {
    const { SENDGRID_API_KEY, OTP_EMAIL_FROM } = env;

    if (!SENDGRID_API_KEY || !OTP_EMAIL_FROM) {
      return false;
    }

    const subject =
      purpose === 'password_reset'
        ? 'Reset your MeeSeva Lite password'
        : 'Verify your MeeSeva Lite account';
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: OTP_EMAIL_FROM },
        subject,
        content: [
          {
            type: 'text/plain',
            value: `Your OTP is ${otp}. It is valid for 10 minutes.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`SendGrid OTP email failed: ${response.status} ${body}`);
    }

    return true;
  }

  private normalizePhone(phone: string): string {
    return phone.startsWith('+') ? phone : `+91${phone}`;
  }

  private isE164Phone(phone: string): boolean {
    return /^\+[1-9]\d{1,14}$/.test(phone);
  }
}
