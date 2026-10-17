import { describe, it, expect, vi } from 'vitest';
import { DocumentService } from './document.service.js';
import type { IDocumentRepository } from '../../domain/interfaces/document.repository.interface.js';
import type { IStorageProvider } from '../../domain/interfaces/storage.provider.interface.js';

describe('DocumentService (SOLID Unit Test)', () => {
  const mockStorage: IStorageProvider = {
    name: 'MockStorage',
    saveFile: vi.fn().mockResolvedValue({
      url: '/uploads/sample.pdf',
      filename: 'sample.pdf',
      size: 1024,
      mimetype: 'application/pdf',
    }),
    deleteFile: vi.fn().mockResolvedValue(true),
  };

  const mockRepo: IDocumentRepository = {
    create: vi.fn().mockResolvedValue({
      id: 'doc-123',
      name: 'Aadhaar Card',
      fileUrl: '/uploads/sample.pdf',
      verificationStatus: 'pending',
    }),
    findById: vi.fn().mockImplementation(async (id: string) => {
      if (id === 'doc-123') {
        return {
          id: 'doc-123',
          userId: 'user-456',
          name: 'Aadhaar Card',
          fileUrl: '/uploads/sample.pdf',
        };
      }
      return null;
    }),
    findByUserId: vi.fn().mockResolvedValue([]),
    findByUserIdAndType: vi.fn().mockResolvedValue(null),
    findVerified: vi.fn().mockResolvedValue([]),
    findPending: vi.fn().mockResolvedValue([]),
    countByUserId: vi.fn().mockResolvedValue(1),
    updateVerificationStatus: vi
      .fn()
      .mockResolvedValue({ id: 'doc-123', verificationStatus: 'verified' }),
    updateExtractedData: vi
      .fn()
      .mockResolvedValue({ id: 'doc-123', extractedData: { uid: '1234' } }),
    delete: vi.fn().mockResolvedValue({ id: 'doc-123' }),
    deleteByUserId: vi.fn().mockResolvedValue({ deletedCount: 1 }),
  };

  const service = new DocumentService(mockRepo, mockStorage);

  it('should upload a document and save file to storage provider', async () => {
    const doc = await service.uploadDocument(
      'user-456',
      {
        filename: 'aadhaar.pdf',
        originalname: 'aadhaar.pdf',
        mimetype: 'application/pdf',
        size: 1024,
      },
      { name: 'Aadhaar Card', type: 'aadhaar' }
    );

    expect(mockStorage.saveFile).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalled();
    expect(doc.name).toBe('Aadhaar Card');
  });

  it('should verify document ownership when retrieving by id', async () => {
    const doc = await service.getDocumentById('user-456', 'doc-123');
    expect(doc.id).toBe('doc-123');

    await expect(
      service.getDocumentById('wrong-user', 'doc-123')
    ).rejects.toThrow('Access denied');
  });

  it('should delete a document and remove from storage provider', async () => {
    await service.deleteDocument('user-456', 'doc-123');
    expect(mockStorage.deleteFile).toHaveBeenCalledWith('/uploads/sample.pdf');
    expect(mockRepo.delete).toHaveBeenCalledWith('doc-123');
  });
});
