## Build and Run

1. Run in the command line:

   ```
   docker-compose up -d
   ```

2. Open `http://localhost:3000` in a web browser.

# API Documentation

## Authentication

### Register

**Endpoint:** `POST /auth/register`

**Request body:**

```json
{
  "username": "user1",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User successfully created"
}
```

### Login

**Endpoint:** `POST /auth/login`

**Request body:**

```json
{
  "username": "user1",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "someToken"
}
```

## Articles

### Get all articles

**Endpoint:** `GET /articles`

- `page` (optional): Page number (default: 1)
- `author` (optional): Filter by author
- `publicationDate` (optional): Filter by publication date

**Request:**
`GET /articles?page=1&author=John Doe&publicationDate=2023-01-01`

**Response:**

```json
{
  "data": [
    {
      "id": "6bbc528c-0f99-4a47-8893-eb24d2fc0148",
      "title": "First Article",
      "description": "This is the first article.",
      "publicationDate": "2023-01-01T00:00:00.000Z",
      "author": "John Doe"
    },
    {
      "id": "5dd8b711-5509-4f47-b67d-f38a30ea51a4",
      "title": "Second Article",
      "description": "This is the second article.",
      "publicationDate": "2023-01-02T00:00:00.000Z",
      "author": "Jane Doe"
    }
  ],
  "currentPage": 1,
  "totalPages": 1
}
```

### Get one article

**Endpoint:** `GET /articles/:id`

**Request:**
`GET /articles/6bbc528c-0f99-4a47-8893-eb24d2fc0148`

**Response:**

```json
{
      "id": "6bbc528c-0f99-4a47-8893-eb24d2fc0148",
      "title": "First Article",
      "description": "This is the first article.",
      "publicationDate": "2023-01-01T00:00:00.000Z",
      "author": "John Doe"
},
```

### Create an article

**Endpoint:** `POST /articles`

**Headers**

- `Authorization: Bearer <jwt_token_here>`

**Request body example**

```json
{
  "title": "New Article",
  "description": "This is a new article.",
  "publicationDate": "2023-01-01",
  "author": "John Doe"
}
```

**Response**

```json
{
  "id": "6bbc12c-0f19-4a49-8893-eb24d2fc0148",
  "title": "New Article",
  "description": "This is a new article.",
  "publicationDate": "2023-01-01T00:00:00.000Z",
  "author": "John Doe"
}
```

### Update an article

**Endpoint:** `PUT /articles/:id`

**Headers**

- `Authorization: Bearer <jwt_token_here>`

**Request body example**

```json
{
  "description": "New description"
}
```

**Response**

- `Status code: 200`

### Delete an article

**Endpoint:** `DELETE /articles/:id`

**Headers**

- `Authorization: Bearer <jwt_token_here>`

**Request:**
`DELETE /articles/6bbc528c-0f99-4a47-8893-eb24d2fc0148`

**Response**

- `Status code: 200`
