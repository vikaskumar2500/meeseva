import { AppError } from '../../common/errors/app-error.js';
import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface.js';
import { ServiceRepository } from './service.repository.js';
import type { Service } from './service.model.js';

export interface GetAllServicesFilter {
  page?: number;
  limit?: number;
  category?: string;
  department?: string;
  tag?: string;
}

export class GovServiceCatalogService {
  constructor(
    private readonly serviceRepository: IServiceRepository = new ServiceRepository()
  ) {}

  async getAllServices(filter: GetAllServicesFilter) {
    const page = Math.max(1, filter.page || 1);
    const limit = Math.max(1, Math.min(100, filter.limit || 10));
    const skip = (page - 1) * limit;

    let services;
    if (filter.category) {
      services = await this.serviceRepository.findByCategory(
        filter.category,
        skip,
        limit
      );
    } else if (filter.department) {
      services = await this.serviceRepository.findByDepartment(
        filter.department,
        skip,
        limit
      );
    } else if (filter.tag) {
      services = await this.serviceRepository.getByTag(filter.tag, skip, limit);
    } else {
      services = await this.serviceRepository.findAll(skip, limit);
    }

    const total = await this.serviceRepository.getCount();

    return {
      data: services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getServiceById(id: number) {
    if (typeof id !== 'number' || Number.isNaN(id)) {
      throw new AppError(400, 'Invalid service ID: must be a valid number');
    }
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new AppError(404, 'Service not found');
    }
    return service;
  }

  async searchServices(query: string, page = 1, limit = 10) {
    if (!query || query.trim().length < 2) {
      throw new AppError(400, 'Search query must be at least 2 characters');
    }

    const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
    const services = await this.serviceRepository.search(
      query.trim(),
      skip,
      limit
    );

    return {
      data: services,
      pagination: {
        page,
        limit,
        total: services.length,
        pages: Math.ceil(services.length / limit) || 1,
      },
    };
  }

  async getPopularServices(limit = 10) {
    return this.serviceRepository.getPopularServices(Math.min(50, limit));
  }

  async getCategories() {
    return this.serviceRepository.getCategories();
  }

  async getDepartments() {
    return this.serviceRepository.getDepartments();
  }

  async getTags() {
    return this.serviceRepository.getTags();
  }

  async createService(data: Partial<Service>) {
    return this.serviceRepository.create(data);
  }

  async updateService(id: number, data: Partial<Service>) {
    const updated = await this.serviceRepository.updateById(id, data);
    if (!updated) {
      throw new AppError(404, 'Service not found');
    }
    return updated;
  }

  async deleteService(id: number) {
    const deleted = await this.serviceRepository.deleteById(id);
    if (!deleted) {
      throw new AppError(404, 'Service not found');
    }
    return deleted;
  }
}
