import type { RequestHandler } from 'express';
import { TrackingService } from './tracking.service.js';

export class TrackingController {
  constructor(private readonly trackingService = new TrackingService()) {}

  create: RequestHandler = async (request, response, next) => {
    try {
      const trackingEntry = await this.trackingService.createTrackingEntry(
        request.user!.id,
        request.body
      );
      response.status(201).json({ trackingEntry });
    } catch (error) {
      next(error);
    }
  };

  timeline: RequestHandler = async (request, response, next) => {
    try {
      const timeline = await this.trackingService.listTimeline(
        request.user!.id,
        request.params.applicationId as string
      );
      response.json({ timeline });
    } catch (error) {
      next(error);
    }
  };

  publicTimeline: RequestHandler = async (request, response, next) => {
    try {
      const result = await this.trackingService.getPublicTimeline(
        request.params.applicationId as string
      );
      response.json(result);
    } catch (error) {
      next(error);
    }
  };
}
