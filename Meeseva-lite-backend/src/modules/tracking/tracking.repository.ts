import { TrackingModel } from './tracking.model.js';

export class TrackingRepository {
  async create(input: { applicationId: string; status: string; note?: string; updatedBy: string }) {
    return TrackingModel.create(input);
  }

  async findByApplicationId(applicationId: string) {
    return TrackingModel.find({ applicationId }).sort({ createdAt: -1 });
  }
}