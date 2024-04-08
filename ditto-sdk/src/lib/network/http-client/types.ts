export interface HttpClient {
  post(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  get(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

export type HttpClientMethod = 'get' | 'post';
