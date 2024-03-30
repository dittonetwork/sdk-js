import { HttpClient, HttpClientMethod } from './types';
import * as fetchPonyfill from 'fetch-ponyfill';
import { Optional } from '../types';

export class DittoHttpClient implements HttpClient {
  private readonly fetch = fetchPonyfill().fetch;

  private baseUrl = 'https://backend.dittonetwork.io';

  public get(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return this.fetch(...this.enrichRequest('get', input, init));
  }

  public post(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return this.fetch(...this.enrichRequest('post', input, init));
  }

  private enrichWithMethod(
    method: HttpClientMethod,
    input: RequestInfo | URL,
    init?: RequestInit
  ): [input: RequestInfo | URL, init?: RequestInit] {
    if (input instanceof Request) {
      input = { ...input, method: method };
    }

    if (init) {
      init = { ...init, method: method };
    }

    return [input, init];
  }

  private enrichInputWithBaseUrl(input: RequestInfo | URL): RequestInfo | URL {
    const addBaseUrl = (input: string) =>
      this.baseUrl + (input.startsWith('/') ? input : '/' + input);

    if (
      typeof input === 'string' &&
      !input.startsWith('http://') &&
      !input.startsWith('https://')
    ) {
      input = addBaseUrl(input);
      return input;
    }

    if (
      input instanceof Request &&
      !input.url.startsWith('http://') &&
      !input.url.startsWith('https://')
    ) {
      input = {
        ...input,
        url: this.baseUrl + addBaseUrl(input.url),
      };
    }

    return input;
  }

  private enrichRequest(
    method: HttpClientMethod,
    _input: RequestInfo | URL,
    _init?: RequestInit
  ): [RequestInfo | URL, Optional<RequestInit>] {
    const [input, init] = this.enrichWithMethod(method, _input, _init);
    return [this.enrichInputWithBaseUrl(input), init];
  }
}
