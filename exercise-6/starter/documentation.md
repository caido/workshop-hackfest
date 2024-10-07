# Documentation

[Check full documentation](https://docs.caido.io/concepts/internals/graphql.html)

## Authentication token

Authentication format:

```http
Authorization: Bearer <YOUR ACCESS TOKEN>
```

Obtain the token using:

```js
JSON.parse(localStorage.CAIDO_AUTHENTICATION).accessToken;
```
