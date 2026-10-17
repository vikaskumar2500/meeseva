export interface ITrackingRepository {
  create(input: {
    applicationId: string;
    status: string;
    note?: string;
    updatedBy: string;
  }): Promise<any>;
  findByApplicationId(applicationId: string): Promise<any[]>;
}
