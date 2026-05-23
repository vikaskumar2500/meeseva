import { ServiceModel } from './service.model.js';

export class ServiceRepository {
  async findAll(skip: number = 0, limit: number = 10) {
    return ServiceModel.find().skip(skip).limit(limit).lean();
  }

  async findById(id: number) {
    return ServiceModel.findOne({ id }).lean();
  }

  async findByCategory(category: string, skip: number = 0, limit: number = 10) {
    return ServiceModel.find({ category })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async findByDepartment(department: string, skip: number = 0, limit: number = 10) {
    return ServiceModel.find({ department })
      .skip(skip)
      .limit(limit)
      .lean();
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
    return ServiceModel.find({ tags: tag })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async getCount() {
    return ServiceModel.countDocuments();
  }

  async getCategories() {
    return ServiceModel.distinct('category');
  }

  async getDepartments() {
    return ServiceModel.distinct('department');
  }

  async getTags() {
    return ServiceModel.distinct('tags');
  }

  async create(data: any) {
    return ServiceModel.create(data);
  }

  async updateById(id: number, data: any) {
    return ServiceModel.findOneAndUpdate({ id }, data, { new: true }).lean();
  }

  async deleteById(id: number) {
    return ServiceModel.findOneAndDelete({ id });
  }

  async bulkCreate(services: any[]) {
    return ServiceModel.insertMany(services);
  }
}
