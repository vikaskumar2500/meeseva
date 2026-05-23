import { AppError } from '../../common/errors/app-error.js';
import { ApplicationRepository } from '../applications/application.repository.js';
import { TrackingRepository } from './tracking.repository.js';

export class TrackingService {
  constructor(
    private readonly trackingRepository = new TrackingRepository(),
    private readonly applicationRepository = new ApplicationRepository(),
  ) {}

  async createTrackingEntry(userId: string, input: { applicationId: string; status: string; note?: string }) {
    const application = await this.applicationRepository.findById(input.applicationId);

    if (!application || application.userId.toString() !== userId) {
      throw new AppError(404, 'Application not found');
    }

    const trackingEntry = await this.trackingRepository.create({
      applicationId: input.applicationId,
      status: input.status,
      note: input.note,
      updatedBy: userId,
    });

    await this.applicationRepository.updateById(application.id, { status: input.status });

    return trackingEntry;
  }

  async listTimeline(userId: string, applicationId: string) {
    const application = await this.applicationRepository.findById(applicationId);

    if (!application || application.userId.toString() !== userId) {
      throw new AppError(404, 'Application not found');
    }

    return this.trackingRepository.findByApplicationId(applicationId);
  }
}