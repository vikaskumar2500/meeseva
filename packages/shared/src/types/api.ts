export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

