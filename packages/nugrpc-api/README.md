# NugRPC API

> Opinionated Rest Client, Powered by Axios

## Features

- ✅ Built-in adapter for Dedupe, and Priority Queue request.
- ✅ Composible hook for Axios interceptors.

## Instalation

```bash
yarn add @privyid/nugrpc-api
```

## Usage

```ts
import {
  createLazyton,
  ApiResponse,
  AxiosRequestConfig
} from '@privyid/nugrpc-api'

const useApi = createLazyton({ prefixURL: '/api' })

interface User {
  userId: string,
  email: string,
  name: string
  role: string,
}

interface FormUser {
  name: string,
  email: string,
  role: string,
}

function getUserProfile (config?: AxiosRequestConfig): ApiResponse<User> {
  return useApi().get('/user/profile', config)
}

function postUserProfile (body: FormUser, config?: AxiosRequestConfig): ApiResponse<User> {
  return useApi().post('/user/profile', body, config)
}
```

## Hook

There are available hook for add request/response interceptors.

```ts
import {
  onRequest,
  onRequestError,
  onResponse,
  onResponseError,
  onError,
  getCode,
  getMessage,
} from '@privyid/nugrpc-api'

function isUnauthorize (error: Error): boolean {
  const code    = getCode(error)
  const message = getMessage(error)

  return code === 401 && message === 'Unauthorized'
}

/** set additional or custom headers */
onRequest((config) => {
  const token: string = cookies.get('session/token') || ''

  // check available authorization header
  // and set authorization header
  if (config.headers && !config.headers.Authorization && token)
    config.headers.Authorization = `Bearer ${token}`

  return config
})

/**
 * check unauthorize error response
 * cause of invalid or expired token
 */
onResponseError(async (error) => {
  if (isUnauthorize(error)) {
    await navigateTo('/login')
  }

  throw error
})
```

## Queue

All request per instance will be add into queue before sent with priority `1`.
If you want to send your request first before the others, you can set using option `priority`. The higher priority will run first.

```ts
useApi().get('/document/load', {
  priority: 2,
})
```

## Dedupe

Sometime, you want to cancel request with same endpoint like when you working with searching or filter.

NuGrpc API has built in function for this case. Just set `requestId`, multiple sent request with same id will cancel last request before.

```ts
useApi().get('/document/load', {
  requestId: 'document-load',
})
```
## API

:point_right: You can learn more about usage in [JSDocs Documentation](https://www.jsdocs.io/package/@privyid/nugrpc-api).

## License
[MIT](/LICENSE) License
