import type { RequestHandler } from 'express';
import { GovServiceCatalogService } from './service.service.js';

export class ServiceController {
  constructor(private readonly service = new GovServiceCatalogService()) {}

  /**
   * Get all services with pagination, category, department, or tag filtering
   */
  getAllServices: RequestHandler = async (request, response, next) => {
    try {
      const page = Math.max(1, parseInt(request.query.page as string) || 1);
      const limit = Math.max(
        1,
        Math.min(100, parseInt(request.query.limit as string) || 10)
      );
      const category = request.query.category as string;
      const department = request.query.department as string;
      const tag = request.query.tag as string;

      const result = await this.service.getAllServices({
        page,
        limit,
        category,
        department,
        tag,
      });
      response.json(result);
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
      const limit = Math.max(
        1,
        Math.min(100, parseInt(request.query.limit as string) || 10)
      );

      const result = await this.service.searchServices(query, page, limit);
      response.json(result);
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
      const service = await this.service.getServiceById(id);
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
      const limit = Math.max(
        1,
        Math.min(100, parseInt(request.query.limit as string) || 10)
      );
      const services = await this.service.getPopularServices(limit);
      response.json({ data: services });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all categories
   */
  getCategories: RequestHandler = async (_request, response, next) => {
    try {
      const categories = await this.service.getCategories();
      response.json({ data: categories });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all departments
   */
  getDepartments: RequestHandler = async (_request, response, next) => {
    try {
      const departments = await this.service.getDepartments();
      response.json({ data: departments });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all tags
   */
  getTags: RequestHandler = async (_request, response, next) => {
    try {
      const tags = await this.service.getTags();
      response.json({ data: tags });
    } catch (error) {
      next(error);
    }
  };
}
