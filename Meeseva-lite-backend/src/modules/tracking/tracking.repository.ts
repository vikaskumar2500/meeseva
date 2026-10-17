import { TrackingModel } from './tracking.model.js';
import type { ITrackingRepository } from '../../domain/interfaces/tracking.repository.interface.js';

export class TrackingRepository implements ITrackingRepository {
  async create(input: {
    applicationId: string;
    status: string;
    note?: string;
    updatedBy: string;
  }) {
    return TrackingModel.create(input);
  }

  async findByApplicationId(applicationId: string) {
    return TrackingModel.find({ applicationId }).sort({ createdAt: -1 });
  }
}
