import type { RequestHandler } from 'express';
import { ApplicationService } from './application.service.js';

export class ApplicationController {
  constructor(private readonly applicationService = new ApplicationService()) {}

  create: RequestHandler = async (request, response, next) => {
    try {
      const application = await this.applicationService.createApplication(request.user!.id, request.body);
      response.status(201).json({ application });
    } catch (error) {
      next(error);
    }
  };

  list: RequestHandler = async (request, response, next) => {
    try {
      const applications = await this.applicationService.listApplications(request.user!.id);
      response.json({ applications });
    } catch (error) {
      next(error);
    }
  };

  getById: RequestHandler = async (request, response, next) => {
    try {
      const application = await this.applicationService.getApplication(request.user!.id, request.params.applicationId as string);
      response.json({ application });
    } catch (error) {
      next(error);
    }
  };

  update: RequestHandler = async (request, response, next) => {
    try {
      const application = await this.applicationService.updateApplication(request.user!.id, request.params.applicationId as string, request.body);
      response.json({ application });
    } catch (error) {
      next(error);
    }
  };

  delete: RequestHandler = async (request, response, next) => {
    try {
      await this.applicationService.deleteApplication(request.user!.id, request.params.applicationId as string);
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}