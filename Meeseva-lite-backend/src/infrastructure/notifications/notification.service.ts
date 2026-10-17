import { env } from '../../config/env.js';
import type {
  INotificationService,
  ISmsProvider,
  IEmailProvider,
  SendOtpPayload,
  OtpPurpose,
} from '../../domain/interfaces/notification.provider.interface.js';

export class NotificationService implements INotificationService {
  constructor(
    private readonly smsProviders: ISmsProvider[] = [],
    private readonly emailProviders: IEmailProvider[] = []
  ) {}

  async sendOtp(payload: SendOtpPayload): Promise<void> {
    const message = this.buildOtpMessage(payload.otp, payload.purpose);

    if (env.NODE_ENV === 'test') {
      return;
    }

    let smsSent = false;
    for (const provider of this.smsProviders) {
      if (provider.isAvailable()) {
        try {
          smsSent = await provider.sendSms(payload.phone, message);
          if (smsSent) break;
        } catch (error) {
          console.warn(
            `[NotificationService] SMS provider ${provider.name} failed:`,
            error
          );
        }
      }
    }

    let emailSent = false;
    if (payload.email) {
      const subject =
        payload.purpose === 'password_reset'
          ? 'Reset your MeeSeva Lite password'
          : 'Verify your MeeSeva Lite account';

      for (const provider of this.emailProviders) {
        if (provider.isAvailable()) {
          try {
            emailSent = await provider.sendEmail(
              payload.email,
              subject,
              message
            );
            if (emailSent) break;
          } catch (error) {
            console.warn(
              `[NotificationService] Email provider ${provider.name} failed:`,
              error
            );
          }
        }
      }
    }

    if (!smsSent && !emailSent) {
      if (env.NODE_ENV === 'production') {
        throw new Error(
          'OTP delivery failed: No active SMS or Email provider configured or operational.'
        );
      }
      console.warn(
        `[OTP Fallback Console] Phone: ${payload.phone} | Code: ${payload.otp} | Purpose: ${payload.purpose}`
      );
    }
  }

  async sendStatusUpdateNotification(
    to: { phone?: string; email?: string },
    applicationTitle: string,
    status: string,
    remarks?: string
  ): Promise<void> {
    const text = `Update on application "${applicationTitle}": Status is now "${status.toUpperCase()}".${remarks ? ` Note: ${remarks}` : ''}`;

    if (to.phone) {
      for (const provider of this.smsProviders) {
        if (provider.isAvailable()) {
          try {
            const ok = await provider.sendSms(to.phone, text);
            if (ok) break;
          } catch {
            // continue fallback
          }
        }
      }
    }

    if (to.email) {
      for (const provider of this.emailProviders) {
        if (provider.isAvailable()) {
          try {
            const ok = await provider.sendEmail(
              to.email,
              `Application Status Update: ${applicationTitle}`,
              text
            );
            if (ok) break;
          } catch {
            // continue fallback
          }
        }
      }
    }
  }

  private buildOtpMessage(otp: string, purpose: OtpPurpose): string {
    const action =
      purpose === 'password_reset'
        ? 'reset your MeeSeva Lite password'
        : 'verify your MeeSeva Lite account';
    return `Your OTP to ${action} is ${otp}. It is valid for 10 minutes.`;
  }
}
