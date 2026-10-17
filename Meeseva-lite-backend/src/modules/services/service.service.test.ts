import { describe, it, expect, vi } from 'vitest';
import { GovServiceCatalogService } from './service.service.js';
import type { IServiceRepository } from '../../domain/interfaces/service.repository.interface.js';

describe('GovServiceCatalogService (SOLID Unit Test)', () => {
  const mockRepo: IServiceRepository = {
    findAll: vi
      .fn()
      .mockResolvedValue([
        { id: 1, name: 'Income Certificate', category: 'Certificates' },
      ]),
    findById: vi.fn().mockImplementation(async (id: number) => {
      if (id === 1) return { id: 1, name: 'Income Certificate' };
      return null;
    }),
    findByCategory: vi
      .fn()
      .mockResolvedValue([
        { id: 1, name: 'Income Certificate', category: 'Certificates' },
      ]),
    findByDepartment: vi.fn().mockResolvedValue([]),
    search: vi.fn().mockResolvedValue([{ id: 1, name: 'Income Certificate' }]),
    getPopularServices: vi
      .fn()
      .mockResolvedValue([
        { id: 1, name: 'Income Certificate', popular: true },
      ]),
    getByTag: vi.fn().mockResolvedValue([]),
    getCount: vi.fn().mockResolvedValue(1),
    getCategories: vi.fn().mockResolvedValue(['Certificates', 'Revenue']),
    getDepartments: vi.fn().mockResolvedValue(['Revenue Department']),
    getTags: vi.fn().mockResolvedValue(['income', 'certificate']),
    create: vi.fn(),
    updateById: vi.fn(),
    deleteById: vi.fn(),
    bulkCreate: vi.fn(),
  };

  const service = new GovServiceCatalogService(mockRepo);

  it('should return paginated services', async () => {
    const result = await service.getAllServices({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
    expect(mockRepo.findAll).toHaveBeenCalledWith(0, 10);
  });

  it('should filter by category if provided', async () => {
    await service.getAllServices({
      page: 1,
      limit: 10,
      category: 'Certificates',
    });
    expect(mockRepo.findByCategory).toHaveBeenCalledWith('Certificates', 0, 10);
  });

  it('should get service by ID or throw 404', async () => {
    const s = await service.getServiceById(1);
    expect(s.name).toBe('Income Certificate');

    await expect(service.getServiceById(999)).rejects.toThrow(
      'Service not found'
    );
  });

  it('should perform keyword search', async () => {
    const res = await service.searchServices('income', 1, 10);
    expect(res.data).toHaveLength(1);
    expect(mockRepo.search).toHaveBeenCalledWith('income', 0, 10);
  });
});
