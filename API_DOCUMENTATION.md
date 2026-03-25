# 📚 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6578abc123def456",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

```json
// 400 - Missing fields
{
  "success": false,
  "message": "Please provide all required fields"
}

// 400 - User exists
{
  "success": false,
  "message": "User already exists with this email or username"
}
```

---

### 2. Login User

**POST** `/auth/login`

Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6578abc123def456",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

```json
// 400 - Missing credentials
{
  "success": false,
  "message": "Please provide email and password"
}

// 401 - Invalid credentials
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get User Profile

**GET** `/auth/profile`

Get current user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "6578abc123def456",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**

```json
// 401 - No token
{
  "success": false,
  "message": "No authentication token, access denied"
}

// 401 - Invalid token
{
  "success": false,
  "message": "Token is invalid or expired"
}

// 404 - User not found
{
  "success": false,
  "message": "User not found"
}
```

---

## ✅ Todo Endpoints

### 1. Get All Todos

**GET** `/todos`

Retrieve all todos for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "todos": [
    {
      "_id": "6578xyz789abc012",
      "title": "Complete project",
      "description": "Finish the todo app",
      "completed": false,
      "createdAt": "2024-02-08T10:30:00.000Z"
    },
    {
      "_id": "6578xyz789abc013",
      "title": "Review code",
      "description": "Check for bugs",
      "completed": true,
      "createdAt": "2024-02-08T11:45:00.000Z"
    }
  ]
}
```

---

### 2. Create Todo

**POST** `/todos`

Create a new todo item.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New task",
  "description": "Task description (optional)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Todo created successfully",
  "todo": {
    "_id": "6578xyz789abc014",
    "title": "New task",
    "description": "Task description",
    "completed": false,
    "createdAt": "2024-02-08T12:00:00.000Z"
  }
}
```

**Error Responses:**

```json
// 400 - Missing title
{
  "success": false,
  "message": "Title is required"
}

// 401 - Not authenticated
{
  "success": false,
  "message": "No authentication token, access denied"
}
```

---

### 3. Update Todo

**PUT** `/todos/:id`

Update an existing todo.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Todo ID

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Note:** All fields are optional. Only include the fields you want to update.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Todo updated successfully",
  "todo": {
    "_id": "6578xyz789abc014",
    "title": "Updated title",
    "description": "Updated description",
    "completed": true,
    "createdAt": "2024-02-08T12:00:00.000Z"
  }
}
```

**Error Responses:**

```json
// 404 - Todo not found
{
  "success": false,
  "message": "Todo not found"
}
```

---

### 4. Delete Todo

**DELETE** `/todos/:id`

Delete a todo item.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Todo ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

**Error Responses:**

```json
// 404 - Todo not found
{
  "success": false,
  "message": "Todo not found"
}
```

---

## 🏥 Utility Endpoints

### Health Check

**GET** `/health`

Check if the server is running.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-02-08T12:30:00.000Z"
}
```

---

## 🔒 Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required or failed |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## 📋 Example Usage

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Create Todo:**
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My task","description":"Task details"}'
```

**Get Todos:**
```bash
curl http://localhost:5000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript Fetch

**Register:**
```javascript
const register = async () => {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123'
    })
  });
  const data = await response.json();
  console.log(data);
};
```

**Get Todos:**
```javascript
const getTodos = async (token) => {
  const response = await fetch('http://localhost:5000/api/todos', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data.todos);
};
```

---

## 🛡️ Security Notes

1. **JWT Tokens** expire after 4 days
2. **Passwords** are hashed with bcrypt (10 salt rounds)
3. **CORS** is enabled for all origins in development
4. Always use **HTTPS** in production
5. Store tokens securely (localStorage/sessionStorage)
6. Never expose **JWT_SECRET** in client-side code

---
## Future Improvement
## 📝 Rate Limiting

Currently, there are no rate limits implemented. Consider adding rate limiting in production using packages like `express-rate-limit`.

---


All endpoints are prefixed with `/api` but do not include version numbers. Future versions may use `/api/v2`, etc.
