import { OTPModel } from './otp.model.js';
import type {
  IOtpRepository,
  CreateOtpInput,
  VerifyOtpInput,
} from '../../domain/interfaces/otp.repository.interface.js';

export class OTPRepository implements IOtpRepository {
  async create(data: CreateOtpInput) {
    // Delete any existing OTP for this email/phone
    if (data.email) {
      await OTPModel.deleteMany({
        email: data.email.toLowerCase(),
        purpose: data.purpose,
      });
    }
    if (data.phone) {
      await OTPModel.deleteMany({ phone: data.phone, purpose: data.purpose });
    }

    // Create new OTP (valid for 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return OTPModel.create({
      ...data,
      email: data.email ? data.email.toLowerCase() : undefined,
      expiresAt,
      attempts: 0,
      verified: false,
    });
  }

  async verify(data: VerifyOtpInput) {
    const query: any = {
      code: data.code,
      purpose: data.purpose,
      expiresAt: { $gt: new Date() },
    };

    if (data.email) {
      query.email = data.email.toLowerCase();
    } else if (data.phone) {
      query.phone = data.phone;
    }

    const otp = await OTPModel.findOne(query);
    if (!otp) {
      return null;
    }

    // Increment attempts
    otp.attempts += 1;

    // Lock after 5 attempts
    if (otp.attempts > 5) {
      return null;
    }

    otp.verified = true;
    await otp.save();

    return otp;
  }

  async findByEmail(email: string, purpose: 'registration' | 'password_reset') {
    return OTPModel.findOne({
      email: email.toLowerCase(),
      purpose,
      expiresAt: { $gt: new Date() },
    }).lean();
  }

  async findByPhone(phone: string, purpose: 'registration' | 'password_reset') {
    return OTPModel.findOne({
      phone,
      purpose,
      expiresAt: { $gt: new Date() },
    }).lean();
  }

  async deleteByEmail(
    email: string,
    purpose?: 'registration' | 'password_reset'
  ) {
    const query: any = { email: email.toLowerCase() };
    if (purpose) {
      query.purpose = purpose;
    }
    return OTPModel.deleteMany(query);
  }

  async deleteByPhone(
    phone: string,
    purpose?: 'registration' | 'password_reset'
  ) {
    const query: any = { phone };
    if (purpose) {
      query.purpose = purpose;
    }
    return OTPModel.deleteMany(query);
  }
}
