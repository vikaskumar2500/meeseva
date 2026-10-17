export interface FileUploadPayload {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
  path?: string;
}

export interface StoredFileResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface IStorageProvider {
  readonly name: string;
  saveFile(file: FileUploadPayload): Promise<StoredFileResult>;
  deleteFile(fileUrl: string): Promise<boolean>;
}
