import type { RequestHandler } from 'express';
import { ServiceRepository } from './service.repository.js';
import { AppError } from '../../common/errors/app-error.js';

export class ServiceController {
  constructor(private readonly repository = new ServiceRepository()) {}

  /**
   * Get all services with pagination, category, department, or tag filtering
   */
  getAllServices: RequestHandler = async (request, response, next) => {
    try {
      const page = Math.max(1, parseInt(request.query.page as string) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(request.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      let services;
      const category = request.query.category as string;
      const department = request.query.department as string;
      const tag = request.query.tag as string;

      if (category) {
        services = await this.repository.findByCategory(category, skip, limit);
      } else if (department) {
        services = await this.repository.findByDepartment(department, skip, limit);
      } else if (tag) {
        services = await this.repository.getByTag(tag, skip, limit);
      } else {
        services = await this.repository.findAll(skip, limit);
      }

      const total = await this.repository.getCount();

      response.json({
        data: services,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Search services
   */
  searchServices: RequestHandler = async (request, response, next) => {
    try {
      const query = request.query.q as string;
      const page = Math.max(1, parseInt(request.query.page as string) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(request.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      if (!query || query.length < 2) {
        throw new AppError(400, 'Search query must be at least 2 characters');
      }

      const services = await this.repository.search(query, skip, limit);

      response.json({
        data: services,
        pagination: {
          page,
          limit,
          total: services.length,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get service by ID
   */
  getServiceById: RequestHandler = async (request, response, next) => {
    try {
      const id = parseInt(String(request.params.id), 10);
      const service = await this.repository.findById(id);

      if (!service) {
        throw new AppError(404, 'Service not found');
      }

      response.json(service);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get popular services
   */
  getPopularServices: RequestHandler = async (request, response, next) => {
    try {
      const limit = Math.max(1, Math.min(100, parseInt(request.query.limit as string) || 10));
      const services = await this.repository.getPopularServices(limit);

      response.json({
        data: services,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all categories
   */
  getCategories: RequestHandler = async (request, response, next) => {
    try {
      const categories = await this.repository.getCategories();
      response.json({ data: categories });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all departments
   */
  getDepartments: RequestHandler = async (request, response, next) => {
    try {
      const departments = await this.repository.getDepartments();
      response.json({ data: departments });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all tags
   */
  getTags: RequestHandler = async (request, response, next) => {
    try {
      const tags = await this.repository.getTags();
      response.json({ data: tags });
    } catch (error) {
      next(error);
    }
  };
}
