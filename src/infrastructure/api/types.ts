export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbErrorPayload {
  status_code: number;
  status_message: string;
}
