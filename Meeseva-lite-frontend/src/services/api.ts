import type {
  AuthResponse,
  GovService,
  Application,
  TrackingEntry,
  PublicTrackingResult,
  UserDocument,
} from '../types/index.js';

const API_BASE = '/api/v1';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('meeseva_token');
  }

  private getHeaders(isFormData = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(isFormData),
        ...(options.headers || {}),
      },
    });

    if (res.status === 204) {
      return {} as T;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = data?.message || data?.error || `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    return data as T;
  }

  // --- Auth Endpoints ---
  async initiateRegister(payload: { fullName: string; email: string; phone: string }) {
    return this.request<{ message: string; phone: string; expiresIn: number; devOtp?: string }>(
      '/auth/register/initiate',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  }

  async verifyRegisterOtp(payload: {
    fullName: string;
    email: string;
    phone: string;
    otp: string;
    password: string;
    role?: 'citizen' | 'officer';
  }) {
    return this.request<AuthResponse>('/auth/register/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async login(payload: { loginId: string; password: string }) {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async initiateForgotPassword(loginId: string) {
    return this.request<{ message: string; phone: string; expiresIn: number; devOtp?: string }>(
      '/auth/forgot-password/initiate',
      {
        method: 'POST',
        body: JSON.stringify({ loginId }),
      }
    );
  }

  async verifyForgotPassword(payload: { loginId: string; otp: string; newPassword: string }) {
    return this.request<{ message: string }>('/auth/forgot-password/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getProfile() {
    return this.request<{ user: any }>('/users/profile');
  }

  // --- Services Endpoints ---
  async getServices(params: { category?: string; department?: string; tag?: string; page?: number; limit?: number } = {}) {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.department) query.set('department', params.department);
    if (params.tag) query.set('tag', params.tag);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    return this.request<{ data: GovService[]; pagination: { page: number; limit: number; total: number; pages: number } }>(
      `/services?${query.toString()}`
    );
  }

  async searchServices(q: string) {
    return this.request<{ data: GovService[]; pagination: { page: number; limit: number; total: number; pages: number } }>(
      `/services/search?q=${encodeURIComponent(q)}`
    );
  }

  async getPopularServices() {
    return this.request<{ data: GovService[] }>('/services/popular');
  }

  async getCategories() {
    return this.request<{ data: string[] }>('/services/categories');
  }

  // --- Applications Endpoints ---
  async createApplication(payload: {
    applicationType: string;
    title: string;
    payload?: Record<string, any>;
    [key: string]: any;
  }) {
    return this.request<{ application: Application }>('/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getMyApplications() {
    return this.request<{ applications: Application[] }>('/applications');
  }

  async getAllApplications(filter: { status?: string; applicationType?: string } = {}) {
    const query = new URLSearchParams();
    if (filter.status) query.set('status', filter.status);
    if (filter.applicationType) query.set('applicationType', filter.applicationType);
    return this.request<{ applications: Application[] }>(`/applications/all?${query.toString()}`);
  }

  async getApplicationById(id: string) {
    return this.request<{ application: Application }>(`/applications/${id}`);
  }

  async updateApplicationStatus(id: string, status: string, note?: string) {
    return this.request<{ application: Application }>(`/applications/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, note }),
    });
  }

  // --- Tracking Endpoints ---
  async getPublicTracking(applicationId: string) {
    return this.request<PublicTrackingResult>(`/tracking/public/${applicationId}`);
  }

  async getApplicationTimeline(applicationId: string) {
    return this.request<{ timeline: TrackingEntry[] }>(`/tracking/${applicationId}`);
  }

  // --- Document Locker Endpoints ---
  async uploadDocument(formData: FormData) {
    return this.request<UserDocument>('/documents', {
      method: 'POST',
      body: formData,
    });
  }

  async getDocuments(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request<{ data: UserDocument[]; pagination: any }>(`/documents${query}`);
  }

  async deleteDocument(id: string) {
    return this.request<void>(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Speech Assistance Endpoint ---
  async transcribeSpeech(audioBlob: Blob, languageCode?: string) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'speech.wav');
    if (languageCode) {
      formData.append('languageCode', languageCode);
    }
    return this.request<{ transcript: string }>('/speech/transcribe', {
      method: 'POST',
      body: formData,
    });
  }
}

export const api = new ApiClient();

