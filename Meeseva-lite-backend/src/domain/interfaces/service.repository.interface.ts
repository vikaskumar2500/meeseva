import type { Service } from '../../modules/services/service.model.js';

export interface IServiceRepository {
  findAll(skip?: number, limit?: number): Promise<any[]>;
  findById(id: number): Promise<any>;
  findByCategory(
    category: string,
    skip?: number,
    limit?: number
  ): Promise<any[]>;
  findByDepartment(
    department: string,
    skip?: number,
    limit?: number
  ): Promise<any[]>;
  search(query: string, skip?: number, limit?: number): Promise<any[]>;
  getPopularServices(limit?: number): Promise<any[]>;
  getByTag(tag: string, skip?: number, limit?: number): Promise<any[]>;
  getCount(): Promise<number>;
  getCategories(): Promise<string[]>;
  getDepartments(): Promise<string[]>;
  getTags(): Promise<string[]>;
  create(data: Partial<Service>): Promise<any>;
  updateById(id: number, data: Partial<Service>): Promise<any>;
  deleteById(id: number): Promise<any>;
  bulkCreate(services: Partial<Service>[]): Promise<any>;
}
