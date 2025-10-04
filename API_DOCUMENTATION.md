# 📡 API Documentation

Complete REST API documentation for the Book Review Platform.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Sign Up

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. Login

Authenticate existing user.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User

Get authenticated user details.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📚 Book Endpoints

### 1. Get All Books

Get paginated list of books with optional search, filter, and sort.

**Endpoint:** `GET /books`

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 5) - Items per page
- `search` (string, optional) - Search by title or author
- `genre` (string, optional) - Filter by genre
- `sort` (string, optional) - Sort by: `title`, `year`, `rating`

**Example:** `GET /books?page=1&limit=5&genre=Fantasy&sort=rating`

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "totalPages": 5,
  "currentPage": 1,
  "data": [
    {
      "_id": "64abc123...",
      "title": "Harry Potter and the Philosopher's Stone",
      "author": "J.K. Rowling",
      "description": "A young wizard begins his journey...",
      "genre": "Fantasy",
      "publishedYear": 1997,
      "averageRating": 4.5,
      "reviewCount": 10,
      "addedBy": {
        "_id": "64abc456...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Book

Get detailed book information with reviews.

**Endpoint:** `GET /books/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "title": "Harry Potter and the Philosopher's Stone",
    "author": "J.K. Rowling",
    "description": "A young wizard begins his journey...",
    "genre": "Fantasy",
    "publishedYear": 1997,
    "averageRating": 4.5,
    "reviewCount": 10,
    "addedBy": {
      "_id": "64abc456...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "reviews": [
      {
        "_id": "64abc789...",
        "rating": 5,
        "reviewText": "Amazing book!",
        "user": {
          "_id": "64abc456...",
          "name": "Jane Smith"
        },
        "createdAt": "2024-01-02T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Book not found"
}
```

---

### 3. Create Book

Add a new book (requires authentication).

**Endpoint:** `POST /books`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel set in the Jazz Age.",
  "genre": "Fiction",
  "publishedYear": 1925
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A classic American novel...",
    "genre": "Fiction",
    "publishedYear": 1925,
    "addedBy": "64abc456...",
    "averageRating": 0,
    "reviewCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Please provide a book title"
}
```

---

### 4. Update Book

Update book details (requires authentication, creator only).

**Endpoint:** `PUT /books/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "description": "Updated description",
  "genre": "Mystery",
  "publishedYear": 2020
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "title": "Updated Title",
    // ... updated fields
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to update this book"
}
```

---

### 5. Delete Book

Delete a book (requires authentication, creator only).

**Endpoint:** `DELETE /books/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to delete this book"
}
```

---

### 6. Get User's Books

Get all books added by authenticated user.

**Endpoint:** `GET /books/user/my-books`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    // ... array of books
  ]
}
```

---

## ⭐ Review Endpoints

### 1. Get Reviews for Book

Get all reviews for a specific book.

**Endpoint:** `GET /reviews/:bookId`

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64abc789...",
      "book": "64abc123...",
      "user": {
        "_id": "64abc456...",
        "name": "John Doe"
      },
      "rating": 5,
      "reviewText": "Absolutely amazing book! Highly recommend.",
      "createdAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Create Review

Add a review for a book (requires authentication).

**Endpoint:** `POST /reviews/:bookId`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "reviewText": "This book was absolutely amazing! Highly recommend it to everyone."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc789...",
    "book": "64abc123...",
    "user": {
      "_id": "64abc456...",
      "name": "John Doe"
    },
    "rating": 5,
    "reviewText": "This book was absolutely amazing!...",
    "createdAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "You have already reviewed this book"
}
```

---

### 3. Update Review

Update own review (requires authentication, creator only).

**Endpoint:** `PUT /reviews/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 4,
  "reviewText": "Updated review text..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc789...",
    // ... updated review
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to update this review"
}
```

---

### 4. Delete Review

Delete own review (requires authentication, creator only).

**Endpoint:** `DELETE /reviews/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

---

### 5. Get User's Reviews

Get all reviews by authenticated user.

**Endpoint:** `GET /reviews/user/my-reviews`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64abc789...",
      "rating": 5,
      "reviewText": "Great book!",
      "book": {
        "_id": "64abc123...",
        "title": "Harry Potter",
        "author": "J.K. Rowling"
      },
      "createdAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

---

### 6. Get Rating Distribution

Get rating distribution for a book (for charts).

**Endpoint:** `GET /reviews/:bookId/distribution`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    { "rating": 5, "count": 15 },
    { "rating": 4, "count": 8 },
    { "rating": 3, "count": 3 },
    { "rating": 2, "count": 1 },
    { "rating": 1, "count": 0 }
  ]
}
```

---

## 📋 Genres List

Available genres for books:

- Fiction
- Non-Fiction
- Science Fiction
- Fantasy
- Mystery
- Romance
- Thriller
- Biography
- History
- Self-Help
- Other

---

## 🔍 Query Examples

### Search books by title
```
GET /api/books?search=harry
```

### Filter by genre
```
GET /api/books?genre=Fantasy
```

### Sort by rating
```
GET /api/books?sort=rating
```

### Combined query
```
GET /api/books?page=2&limit=10&genre=Fiction&sort=year&search=gatsby
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## 🔐 Authorization Rules

| Action | Authentication Required | Authorization |
|--------|------------------------|---------------|
| View books | No | Public |
| View book details | No | Public |
| View reviews | No | Public |
| Create book | Yes | Any logged-in user |
| Update book | Yes | Book creator only |
| Delete book | Yes | Book creator only |
| Create review | Yes | Any logged-in user (once per book) |
| Update review | Yes | Review creator only |
| Delete review | Yes | Review creator only |

---

## 📦 Postman Collection

Import the `Postman_Collection.json` file from the backend directory for a ready-to-use API collection with all endpoints pre-configured.

**Steps:**
1. Open Postman
2. Click Import
3. Select `backend/Postman_Collection.json`
4. Set the `token` variable after login
5. Start testing!

---

**API Version:** 1.0.0  
**Last Updated:** 2024
