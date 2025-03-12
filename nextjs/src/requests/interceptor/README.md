# API interceptor, 401 error

```apiClient.ts``` exports a reusable api client for axios which can be used in other requests. To this client there is an interceptor. This interceptor listens for 401 errors, so if any of the requests that uses this client gets a 401 response the interceptor will call the refresh token endpoint.
