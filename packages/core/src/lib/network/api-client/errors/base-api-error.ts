export class BaseApiError extends Error {
  public readonly code: number;
  public readonly data: unknown;

  constructor(message: string, code: number, data: unknown) {
    super(message);

    this.name = 'BaseApiError';
    this.code = code;
    this.data = data;
  }
}
