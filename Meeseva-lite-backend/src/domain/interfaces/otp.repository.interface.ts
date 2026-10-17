export interface CreateOtpInput {
  email?: string;
  phone?: string;
  code: string;
  purpose: 'registration' | 'password_reset';
}

export interface VerifyOtpInput {
  email?: string;
  phone?: string;
  code: string;
  purpose: 'registration' | 'password_reset';
}

export interface IOtpRepository {
  create(data: CreateOtpInput): Promise<any>;
  verify(data: VerifyOtpInput): Promise<any>;
  findByEmail(
    email: string,
    purpose: 'registration' | 'password_reset'
  ): Promise<any>;
  findByPhone(
    phone: string,
    purpose: 'registration' | 'password_reset'
  ): Promise<any>;
  deleteByEmail(
    email: string,
    purpose?: 'registration' | 'password_reset'
  ): Promise<any>;
  deleteByPhone(
    phone: string,
    purpose?: 'registration' | 'password_reset'
  ): Promise<any>;
}
