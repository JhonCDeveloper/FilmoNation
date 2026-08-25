export type HttpErrorType =
  | 'NOT_FOUND' // TMDB 34 / 404 HTTP
  | 'VALIDATION' // TMDB 22 / 400 HTTP
  | 'RATE_LIMIT' // 429 HTTP
  | 'SERVER_ERROR' // 500+ HTTP
  | 'NETWORK_ERROR' // Sin conexión a internet
  | 'UNKNOWN';

export class HttpError extends Error {
  public readonly type: HttpErrorType;
  public readonly statusCode?: number | undefined;
  public readonly retryAfter?: number | undefined;

  constructor(type: HttpErrorType, message: string, statusCode?: number, retryAfter?: number) {
    super(message);
    this.name = 'HttpError';
    this.type = type;
    this.statusCode = statusCode;
    this.retryAfter = retryAfter;
  }
}
