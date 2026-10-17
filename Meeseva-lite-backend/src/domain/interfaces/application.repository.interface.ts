export interface IApplicationRepository {
  create(data: {
    userId: string;
    applicationType: string;
    title: string;
    payload: Record<string, unknown>;
  }): Promise<any>;
  findById(id: string): Promise<any>;
  findByUserId(userId: string): Promise<any[]>;
  findAll(filter?: Record<string, any>): Promise<any[]>;
  updateById(id: string, updates: Record<string, any>): Promise<any>;
  deleteById(id: string): Promise<any>;
}
