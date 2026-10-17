import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../../config/env.js';
import type {
  IStorageProvider,
  FileUploadPayload,
  StoredFileResult,
} from '../../domain/interfaces/storage.provider.interface.js';

export class LocalStorageProvider implements IStorageProvider {
  readonly name = 'LocalStorageProvider';
  private readonly uploadDir: string;

  constructor(uploadDir = env.UPLOAD_DIR) {
    this.uploadDir = path.resolve(process.cwd(), uploadDir);
  }

  async saveFile(file: FileUploadPayload): Promise<StoredFileResult> {
    await fs.mkdir(this.uploadDir, { recursive: true });

    // If file was already written by multer diskStorage
    if (file.path) {
      return {
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      };
    }

    // If buffer is provided
    if (file.buffer) {
      const destination = path.join(this.uploadDir, file.filename);
      await fs.writeFile(destination, file.buffer);
      return {
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      };
    }

    throw new Error('No file buffer or path provided for storage');
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
