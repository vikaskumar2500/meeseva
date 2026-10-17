import { AppError } from '../../common/errors/app-error.js';
import type { ITrackingRepository } from '../../domain/interfaces/tracking.repository.interface.js';
import type { IApplicationRepository } from '../../domain/interfaces/application.repository.interface.js';
import { TrackingRepository } from './tracking.repository.js';
import { ApplicationRepository } from '../applications/application.repository.js';

export class TrackingService {
  constructor(
    private readonly trackingRepository: ITrackingRepository = new TrackingRepository(),
    private readonly applicationRepository: IApplicationRepository = new ApplicationRepository()
  ) {}

  async createTrackingEntry(
    userId: string,
    input: { applicationId: string; status: string; note?: string }
  ) {
    const application = await this.applicationRepository.findById(
      input.applicationId
    );

    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    const trackingEntry = await this.trackingRepository.create({
      applicationId: input.applicationId,
      status: input.status,
      note: input.note,
      updatedBy: userId,
    });

    await this.applicationRepository.updateById(
      application.id || application._id.toString(),
      {
        status: input.status,
      }
    );

    return trackingEntry;
  }

  async listTimeline(userId: string, applicationId: string) {
    const application =
      await this.applicationRepository.findById(applicationId);

    if (!application || application.userId.toString() !== userId) {
      throw new AppError(404, 'Application not found');
    }

    return this.trackingRepository.findByApplicationId(applicationId);
  }

  async getPublicTimeline(applicationId: string) {
    const application =
      await this.applicationRepository.findById(applicationId);
    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    const timeline =
      await this.trackingRepository.findByApplicationId(applicationId);
    return {
      application: {
        id: application.id || application._id.toString(),
        title: application.title,
        applicationType: application.applicationType,
        status: application.status,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
      timeline,
    };
  }
}
