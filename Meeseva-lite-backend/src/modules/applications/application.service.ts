import { AppError } from '../../common/errors/app-error.js';
import type { IApplicationRepository } from '../../domain/interfaces/application.repository.interface.js';
import type { ITrackingRepository } from '../../domain/interfaces/tracking.repository.interface.js';
import type { INotificationService } from '../../domain/interfaces/notification.provider.interface.js';
import { ApplicationRepository } from './application.repository.js';

export class ApplicationService {
  constructor(
    private readonly applicationRepository: IApplicationRepository = new ApplicationRepository(),
    private readonly trackingRepository?: ITrackingRepository,
    private readonly notificationService?: INotificationService
  ) {}

  async createApplication(
    userId: string,
    input: { applicationType: string; title: string; payload?: Record<string, unknown> } & Record<string, unknown>,
  ) {
    const { applicationType, title, payload, ...dynamicFields } = input;

    const application = await this.applicationRepository.create({
      userId,
      applicationType,
      title,
      payload: { ...(payload ?? {}), ...dynamicFields },
    });

    // Create initial tracking entry if trackingRepository exists
    if (this.trackingRepository) {
      await this.trackingRepository.create({
        applicationId: application.id || application._id.toString(),
        status: 'submitted',
        note: 'Application successfully submitted by citizen',
        updatedBy: userId,
      });
    }

    return application;
  }

  async listApplications(userId: string) {
    return this.applicationRepository.findByUserId(userId);
  }

  async listAllApplications(filter: Record<string, any> = {}) {
    return this.applicationRepository.findAll(filter);
  }

  async getApplication(userId: string, applicationId: string) {
    const application = await this.applicationRepository.findById(applicationId);

    if (!application || application.userId.toString() !== userId) {
      throw new AppError(404, 'Application not found');
    }

    return application;
  }

  async getApplicationById(applicationId: string) {
    const application = await this.applicationRepository.findById(applicationId);
    if (!application) {
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

  async updateStatus(
    applicationId: string,
    status: string,
    note?: string,
    officerId?: string
  ) {
    const application = await this.getApplicationById(applicationId);

    const updated = await this.applicationRepository.updateById(application.id || application._id.toString(), {
      status,
    });

    if (this.trackingRepository) {
      await this.trackingRepository.create({
        applicationId: application.id || application._id.toString(),
        status,
        note: note || `Application status changed to ${status}`,
        updatedBy: officerId || 'SYSTEM_OFFICER',
      });
    }

    return updated;
  }

  async deleteApplication(userId: string, applicationId: string) {
    const application = await this.getApplication(userId, applicationId);
    return this.applicationRepository.deleteById(application.id);
  }
}