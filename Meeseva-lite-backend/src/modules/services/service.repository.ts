import { ServiceModel } from './service.model.js';
import type { Service } from './service.model.js';
import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface.js';

export class ServiceRepository implements IServiceRepository {
  async findAll(skip: number = 0, limit: number = 10) {
    return ServiceModel.find().skip(skip).limit(limit).lean();
  }

  async findById(id: number) {
    return ServiceModel.findOne({ id }).lean();
  }

  async findByCategory(category: string, skip: number = 0, limit: number = 10) {
    return ServiceModel.find({ category }).skip(skip).limit(limit).lean();
  }

  async findByDepartment(
    department: string,
    skip: number = 0,
    limit: number = 10
  ) {
    return ServiceModel.find({ department }).skip(skip).limit(limit).lean();
  }

  async search(query: string, skip: number = 0, limit: number = 10) {
    return ServiceModel.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async getPopularServices(limit: number = 10) {
    return ServiceModel.find({ popular: true })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit)
      .lean();
  }

  async getByTag(tag: string, skip: number = 0, limit: number = 10) {
    return ServiceModel.find({ tags: tag }).skip(skip).limit(limit).lean();
  }

  async getCount() {
    return ServiceModel.countDocuments();
  }

  async getCategories(): Promise<string[]> {
    return ServiceModel.distinct('category') as unknown as string[];
  }

  async getDepartments(): Promise<string[]> {
    return ServiceModel.distinct('department') as unknown as string[];
  }

  async getTags(): Promise<string[]> {
    return ServiceModel.distinct('tags') as unknown as string[];
  }

  async create(data: Partial<Service>) {
    return ServiceModel.create(data);
  }

  async updateById(id: number, data: Partial<Service>) {
    return ServiceModel.findOneAndUpdate({ id }, data, {
      returnDocument: 'after',
    }).lean();
  }

  async deleteById(id: number) {
    return ServiceModel.findOneAndDelete({ id });
  }

  async bulkCreate(services: Partial<Service>[]) {
    return ServiceModel.insertMany(services);
  }
}
