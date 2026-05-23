import { AppError } from '../../common/errors/app-error.js';
import { ApplicationRepository } from './application.repository.js';

export class ApplicationService {
  constructor(private readonly applicationRepository = new ApplicationRepository()) {}

  async createApplication(
    userId: string,
    input: { applicationType: string; title: string; payload?: Record<string, unknown> } & Record<string, unknown>,
  ) {
    const { applicationType, title, payload, ...dynamicFields } = input;

    return this.applicationRepository.create({
      userId,
      applicationType,
      title,
      payload: { ...(payload ?? {}), ...dynamicFields },
    });
  }

  async listApplications(userId: string) {
    return this.applicationRepository.findByUserId(userId);
  }

  async getApplication(userId: string, applicationId: string) {
    const application = await this.applicationRepository.findById(applicationId);

    if (!application || application.userId.toString() !== userId) {
      throw new AppError(404, 'Application not found');
    }

    return application;
  }

  async updateApplication(
    userId: string,
    applicationId: string,
    updates: Partial<{ applicationType: string; title: string; payload: Record<string, unknown>; status: string }> & Record<string, unknown>,
  ) {
    const application = await this.getApplication(userId, applicationId);
    const { payload, ...dynamicFields } = updates;

    return this.applicationRepository.updateById(application.id, {
      ...dynamicFields,
      ...(payload ? { payload: { ...(application.payload as Record<string, unknown>), ...payload } } : {}),
    });
  }

  async deleteApplication(userId: string, applicationId: string) {
    const application = await this.getApplication(userId, applicationId);
    return this.applicationRepository.deleteById(application.id);
  }
}