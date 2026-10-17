export type OtpPurpose = 'registration' | 'password_reset' | 'status_update';

export interface SendOtpPayload {
  phone: string;
  email?: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface ISmsProvider {
  readonly name: string;
  isAvailable(): boolean;
  sendSms(to: string, message: string): Promise<boolean>;
}

export interface IEmailProvider {
  readonly name: string;
  isAvailable(): boolean;
  sendEmail(to: string, subject: string, content: string): Promise<boolean>;
}

export interface INotificationService {
  sendOtp(payload: SendOtpPayload): Promise<void>;
  sendStatusUpdateNotification(
    to: { phone?: string; email?: string },
    applicationTitle: string,
    status: string,
    remarks?: string
  ): Promise<void>;
}
