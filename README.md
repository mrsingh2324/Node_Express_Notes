# BookVault API
Node.js + Express + SQLite project.
How to build RESTful services with user authentication and resource management.

---

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install express sqlite3 bcrypt jsonwebtoken dotenv
   ```
2. **(Optional) Configure environment variables**
   - Create a `.env` file in the project root if you want to change defaults.
   - Available variables:
     ```env
     PORT=3000
     JWT_SECRET=super_secret_key
     ```
3. **Run the server**
   ```bash
   node app.js
   ```
4. **Test the API**
   - By default, the API is available at: `http://localhost:{PORT}`
   - Use Postman, Thunder Client, or curl to hit the endpoints.

> **Tip:** The SQLite database file is created automatically at `data/bookvault.db` the first time the server runs.

---

## Run SQLite

```bash
sqlite3 data/bookvault.db
sqlite> SELECT id, name, email, created_at FROM users;
```

## 🛠️ API Cheatsheet (Postman / Thunder Client)

### 1. Register a New User
- **Endpoint:** `POST http://localhost:3000/api/users/register`
- **Body (JSON):**
  ```json
  {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "password": "SecretPass123"
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "message": "Registration successful. You can now log in."
  }
  ```

### 2. Log In
- **Endpoint:** `POST http://localhost:3000/api/users/login`
- **Body (JSON):**
  ```json
  {
    "email": "ada@example.com",
    "password": "SecretPass123"
  }
  ```
- **Success Response:** `200 OK`
  ```json
  {
    "message": "Login successful.",
    "token": "<JWT_TOKEN>",
    "expiresIn": "1h"
  }
  ```

### 3. Use the JWT Token
- Copy the `token` from the login response.
- Set the `Authorization` header on subsequent requests:
  ```text
  Authorization: Bearer <JWT_TOKEN>
  ```

### 4. Books CRUD Examples (Authenticated)
- **Common Base URL:** `http://localhost:3000/api/books`

#### GET All Books
```
GET /api/books
Headers: Authorization: Bearer <JWT_TOKEN>
```

#### POST Create Book
```
POST /api/books
Headers: Authorization: Bearer <JWT_TOKEN>
Body:
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008
}
```

#### PUT Update Book
```
PUT /api/books/1
Headers: Authorization: Bearer <JWT_TOKEN>
Body:
{
  "title": "Clean Code (Updated)",
  "author": "Robert C. Martin",
  "year": 2009
}
```

#### DELETE Book
```
DELETE /api/books/1
Headers: Authorization: Bearer <JWT_TOKEN>
```

---

## 📋 Endpoint Overview

| Method | Endpoint                  | Description                              | Auth Required |
|--------|---------------------------|------------------------------------------|---------------|
| POST   | `/api/users/register`     | Register a new user                      | No            |
| POST   | `/api/users/login`        | Log in and receive a JWT token           | No            |
| GET    | `/api/books`              | Fetch all books owned by the user        | Yes (JWT)     |
| POST   | `/api/books`              | Create a new book                        | Yes (JWT)     |
| PUT    | `/api/books/:id`          | Update a specific book you own           | Yes (JWT)     |
| DELETE | `/api/books/:id`          | Delete a specific book you own           | Yes (JWT)     |

---

## 👩‍🏫 Notes for Teachers

- **bcrypt:** Demonstrates secure password storage. Show students how the plain-text password never touches the database.
- **JWT (jsonwebtoken):** Explain stateless authentication. The payload includes user ID/email and expires in 1 hour, forcing periodic re-authentication.
- **Middleware (`middleware/auth.js`):** Highlights how Express middleware can guard routes by validating tokens before letting requests through.
- **SQLite Setup (`db/setup.js`):** Illustrates how to create tables programmatically on startup—useful when teaching migrations vs. auto-setup.
- **Route Structure (`routes/users.js`, `routes/books.js`):** Encourages modular design, making it easier for students to navigate and extend the project.
- **Logging & Error Handling:** Console logs and friendly messages help beginners understand request flow and diagnose issues.

Encourage students to experiment by adding new fields, creating additional secured routes, or building a simple frontend that consumes this API.
