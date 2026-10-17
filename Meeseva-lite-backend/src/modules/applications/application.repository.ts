import { ApplicationModel } from './application.model.js';
import type { IApplicationRepository } from '../../domain/interfaces/application.repository.interface.js';

export class ApplicationRepository implements IApplicationRepository {
  async create(input: {
    userId: string;
    applicationType: string;
    title: string;
    payload: Record<string, unknown>;
  }) {
    return ApplicationModel.create(input);
  }

  async findById(applicationId: string) {
    return ApplicationModel.findById(applicationId);
  }

  async findByUserId(userId: string) {
    return ApplicationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findAll(filter: Record<string, any> = {}) {
    return ApplicationModel.find(filter).sort({ createdAt: -1 });
  }

  async updateById(
    applicationId: string,
    updates: Partial<{
      applicationType: string;
      title: string;
      payload: Record<string, unknown>;
      status: string;
    }>
  ) {
    return ApplicationModel.findByIdAndUpdate(applicationId, updates, {
      returnDocument: 'after',
    });
  }

  async deleteById(applicationId: string) {
    return ApplicationModel.findByIdAndDelete(applicationId);
  }
}
