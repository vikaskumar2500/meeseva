import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(defaultTab);

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'citizen' | 'officer'>('citizen');
  const [regOtp, setRegOtp] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regStep, setRegStep] = useState<1 | 2>(1);

  // Forgot password form state
  const [forgotLoginId, setForgotLoginId] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);

  // Dev OTP feedback & error/loading states
  const [devOtpNotification, setDevOtpNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetStates = () => {
    setError(null);
    setSuccessMessage(null);
    setDevOtpNotification(null);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetStates();
    setLoading(true);
    try {
      const res = await api.login({ loginId, password });
      login(res);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetStates();
    setLoading(true);
    try {
      const res = await api.initiateRegister({
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
      });
      if (res.devOtp) {
        setDevOtpNotification(`Your Verification OTP is: ${res.devOtp}`);
        setRegOtp(res.devOtp); // Auto-fill for convenience
      }
      setSuccessMessage('OTP sent successfully to your mobile number!');
      setRegStep(2);
    } catch (err: any) {
      setError(err.message || 'Registration initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetStates();
    setLoading(true);
    try {
      const res = await api.verifyRegisterOtp({
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
        otp: regOtp,
        password: regPassword,
        role: regRole,
      });
      login(res);
      onClose();
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    resetStates();
    setLoading(true);
    try {
      const res = await api.initiateForgotPassword(forgotLoginId);
      if (res.devOtp) {
        setDevOtpNotification(`Your Reset OTP is: ${res.devOtp}`);
        setForgotOtp(res.devOtp);
      }
      setSuccessMessage('Reset OTP sent to your registered phone number');
      setForgotStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    resetStates();
    setLoading(true);
    try {
      await api.verifyForgotPassword({
        loginId: forgotLoginId,
        otp: forgotOtp,
        newPassword: forgotNewPassword,
      });
      setSuccessMessage('Password reset successfully! You can now log in.');
      setTab('login');
      setForgotStep(1);
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gov-navy text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-bold text-base">MeeSeva Citizen Portal</h3>
              <p className="text-xs text-slate-300">Govt. of India Citizen Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              setTab('login');
              resetStates();
            }}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition ${
              tab === 'login'
                ? 'bg-white text-gov-blue border-b-2 border-gov-blue'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('register');
              resetStates();
            }}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition ${
              tab === 'register'
                ? 'bg-white text-gov-blue border-b-2 border-gov-blue'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Register (OTP)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Notifications */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">
              {successMessage}
            </div>
          )}
          {devOtpNotification && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-800 font-semibold animate-pulse">
              ⚡ {devOtpNotification}
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or citizen@email.com"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      resetStates();
                    }}
                    className="text-xs text-gov-blue hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gov-blue hover:bg-gov-navy text-white text-sm font-semibold rounded-lg shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Need an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    resetStates();
                  }}
                  className="text-xs text-gov-blue font-bold hover:underline"
                >
                  Register here
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER WITH OTP */}
          {tab === 'register' && (
            <div>
              {regStep === 1 ? (
                <form onSubmit={handleInitiateRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name (as per Aadhaar)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (10 digits)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        placeholder="9876543210"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="john.doe@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Type
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                    >
                      <option value="citizen">Citizen (General Public)</option>
                      <option value="officer">Government Officer (Reviewer/Admin)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gov-blue hover:bg-gov-navy text-white text-sm font-semibold rounded-lg shadow-md transition disabled:opacity-50"
                  >
                    <span>{loading ? 'Sending OTP...' : 'Send Verification OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyRegister} className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
                    OTP sent to <span className="font-bold text-slate-800">{regPhone}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter 6-digit OTP
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="123456"
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm tracking-widest font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Create Password (minimum 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="w-1/3 py-2 px-3 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md transition disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify & Register'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {tab === 'forgot' && (
            <div>
              {forgotStep === 1 ? (
                <form onSubmit={handleInitiateForgot} className="space-y-4">
                  <p className="text-xs text-slate-600 mb-2">
                    Enter your registered phone or email address to receive a secure password reset code.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number or Email
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="9876543210"
                      value={forgotLoginId}
                      onChange={(e) => setForgotLoginId(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-gov-blue hover:bg-gov-navy text-white text-sm font-semibold rounded-lg shadow-md transition disabled:opacity-50"
                  >
                    {loading ? 'Sending OTP...' : 'Send Reset Code'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTab('login');
                        resetStates();
                      }}
                      className="text-xs text-slate-600 hover:underline"
                    >
                      Return to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyForgot} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="w-full px-3 py-2 text-sm tracking-widest font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-blue focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-gov-blue hover:bg-gov-navy text-white text-sm font-semibold rounded-lg shadow-md transition disabled:opacity-50"
                  >
                    {loading ? 'Resetting Password...' : 'Reset & Save Password'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
