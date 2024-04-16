import { JSONBody } from './types';
import { HttpClient } from '../http-client/types';
import { BaseApiError } from './errors/base-api-error';
import { DittoStorage } from '../../storage/types';
import { Maybe } from '../../types';
import { ACCESS_TOKEN_KEY } from '../../constants';

export class BaseApiClient {
  constructor(private readonly httpClient: HttpClient, private readonly storage: DittoStorage) {}

  public async doGet<T>(path: string, query: Record<string, string> = {}): Promise<T> {
    const accessToken = await this.getAuthKey();
    const response = await this.httpClient.get(
      `${path}?${Object.entries(query).reduce(
        (acc, item) =>
          acc.length === 0 ? `${item[0]}=${item[1]}` : `${acc}&${item[0]}=${item[1]}`,
        ''
      )}`,
      {
        headers: {
          ...(accessToken ? { Authorization: accessToken } : {}),
        },
      }
    );

    await this.throwErrorIfNeeded(response);

    const result = await response.json();

    return result as T;
  }

  public async doPost<T, P = JSONBody>(path: string, body: P): Promise<T> {
    const accessToken = await this.getAuthKey();
    const response = await this.httpClient.post(path, {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: accessToken } : {}),
      },
    });

    await this.throwErrorIfNeeded(response);

    const result = await response.json();

    return result as T;
  }

  private async getAuthKey(): Promise<Maybe<string>> {
    const authKeyRaw = this.storage.get(ACCESS_TOKEN_KEY);
    if (authKeyRaw instanceof Promise) {
      return await authKeyRaw;
    }

    if (typeof authKeyRaw === 'string') {
      return authKeyRaw;
    }

    return undefined;
  }

  private async throwErrorIfNeeded(response: Response): Promise<Response> {
    if (!response.ok) {
      const error = await response.json();
      throw new BaseApiError(error.message, response.status, error);
    }

    return response;
  }
}
