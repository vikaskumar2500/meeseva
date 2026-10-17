import { describe, it, expect, vi } from 'vitest';
import { TrackingService } from './tracking.service.js';
import type { ITrackingRepository } from '../../domain/interfaces/tracking.repository.interface.js';
import type { IApplicationRepository } from '../../domain/interfaces/application.repository.interface.js';

describe('TrackingService (SOLID Unit Test)', () => {
  const mockTrackingRepo: ITrackingRepository = {
    create: vi
      .fn()
      .mockImplementation(async (input) => ({
        id: 'track-1',
        ...input,
        createdAt: new Date(),
      })),
    findByApplicationId: vi.fn().mockResolvedValue([
      { id: 'track-1', status: 'submitted', note: 'Submitted' },
      { id: 'track-2', status: 'under_review', note: 'Under officer review' },
    ]),
  };

  const mockAppRepo: IApplicationRepository = {
    create: vi.fn(),
    findById: vi.fn().mockImplementation(async (id: string) => {
      if (id === 'app-123') {
        return {
          id: 'app-123',
          userId: 'user-789',
          title: 'Income Certificate Application',
          applicationType: 'revenue',
          status: 'submitted',
        };
      }
      return null;
    }),
    findByUserId: vi.fn().mockResolvedValue([]),
    findAll: vi.fn().mockResolvedValue([]),
    updateById: vi
      .fn()
      .mockResolvedValue({ id: 'app-123', status: 'under_review' }),
    deleteById: vi.fn(),
  };

  const service = new TrackingService(mockTrackingRepo, mockAppRepo);

  it('should create tracking entry and update application status', async () => {
    const entry = await service.createTrackingEntry('user-789', {
      applicationId: 'app-123',
      status: 'under_review',
      note: 'Officer reviewing documents',
    });

    expect(mockTrackingRepo.create).toHaveBeenCalled();
    expect(mockAppRepo.updateById).toHaveBeenCalledWith('app-123', {
      status: 'under_review',
    });
    expect(entry.status).toBe('under_review');
  });

  it('should return public timeline for citizens without requiring auth', async () => {
    const result = await service.getPublicTimeline('app-123');
    expect(result.application.title).toBe('Income Certificate Application');
    expect(result.timeline).toHaveLength(2);
  });
});
