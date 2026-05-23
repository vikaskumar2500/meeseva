import { ApplicationModel } from './application.model.js';

export class ApplicationRepository {
  async create(input: { userId: string; applicationType: string; title: string; payload: Record<string, unknown> }) {
    return ApplicationModel.create(input);
  }

  async findById(applicationId: string) {
    return ApplicationModel.findById(applicationId);
  }

  async findByUserId(userId: string) {
    return ApplicationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async updateById(applicationId: string, updates: Partial<{ applicationType: string; title: string; payload: Record<string, unknown>; status: string }>) {
    return ApplicationModel.findByIdAndUpdate(applicationId, updates, { new: true });
  }

  async deleteById(applicationId: string) {
    return ApplicationModel.findByIdAndDelete(applicationId);
  }
}