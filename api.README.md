# @ditto-sdk/api

## Description
For internal usage purposes.

## Interfaces
```typescript
interface DittoApiClient {
    constructor(config: DittoApiClientConfig): DittoApiClient;
    
    setAuthKey(autKey: string): void;
    
    post(endpoint: string, body: JSONBody): Promise<Response>;
    get(endpoint: string, query: GetQuery): Promise<Response>;
}

interface DittoApiClientConfig {
    baseUrl: string,
    requestInterceptors?: Array<(request: Request) => Request>
}
```

## Usage example

```typescript
import { DittoApi as ApiClient, DAUnathorizedError, DABaseError } from '@ditto-sdk/api'
import { Workflow } from '@ditto-sdk/types'

// client initialization
const apiClient = new DittoApi({
    baseUrl: 'https://dev.backend.ditto.io',
    requestInterceptors: [
        // way for enriching requests
        (request: Request) => {
            request.headers = {
                ...request.headers,
                'X-app-name': 'user defined header'
            }

            return request;
        },
    ]
})

const response = await apiClient.get('/workflows', { page: 1, limit: 12 })
const workflows: Workflow[] = await response.json()
```