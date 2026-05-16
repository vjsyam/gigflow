# GigFlow API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST `/auth/register`

Register a new user.

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "secret123",
  "role": "sales"   // "admin" | "sales" (optional, default: "sales")
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64abc123...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales"
    }
  }
}
```

**Error 409:** Email already registered  
**Error 422:** Validation failed

---

### POST `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64abc123...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales"
    }
  }
}
```

**Error 401:** Invalid credentials

---

### GET `/auth/me` 🔒

Get the currently authenticated user.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "64abc123...",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "role": "sales"
  }
}
```

---

## Lead Endpoints

### GET `/leads` 🔒

Get paginated leads with optional filters.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `status` | string | Filter: `New` \| `Contacted` \| `Qualified` \| `Lost` |
| `source` | string | Filter: `Website` \| `Instagram` \| `Referral` |
| `search` | string | Search by name or email (case-insensitive) |
| `sortBy` | string | `latest` (default) \| `oldest` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |

**Example:** `GET /leads?status=Qualified&source=Instagram&search=Rahul&sortBy=latest&page=1`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64abc123...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "notes": "Met at conference",
      "createdBy": {
        "_id": "64xyz...",
        "name": "Admin User",
        "email": "admin@gigflow.com"
      },
      "createdAt": "2026-05-17T10:00:00.000Z",
      "updatedAt": "2026-05-17T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### POST `/leads` 🔒

Create a new lead.

**Request Body:**
```json
{
  "name": "Priya Patel",
  "email": "priya@example.com",
  "status": "New",
  "source": "Website",
  "notes": "Interested in premium plan"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { /* Lead object */ }
}
```

**Error 422:** Validation failed

---

### GET `/leads/:id` 🔒

Get a single lead by ID.

**Response 200:**
```json
{
  "success": true,
  "data": { /* Lead object with populated createdBy */ }
}
```

**Error 404:** Lead not found  
**Error 403:** Not authorized (Sales user accessing another's lead)

---

### PUT `/leads/:id` 🔒

Update a lead. All fields are optional.

**Request Body:**
```json
{
  "status": "Qualified",
  "notes": "Confirmed budget and timeline"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": { /* Updated lead object */ }
}
```

---

### DELETE `/leads/:id` 🔒

Delete a lead.

**Response 200:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

**Error 403:** Not authorized to delete

---

### GET `/leads/stats` 🔒

Get aggregate statistics for the dashboard.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "byStatus": {
      "New": 12,
      "Contacted": 8,
      "Qualified": 15,
      "Lost": 7
    },
    "bySource": {
      "Website": 20,
      "Instagram": 14,
      "Referral": 8
    }
  }
}
```

---

### GET `/leads/export` 🔒

Export leads as a CSV file. Supports the same filters as `GET /leads` (except `page`, `limit`, `sortBy`).

**Query Parameters:** `status`, `source`, `search`

**Response:** `Content-Type: text/csv` with attachment download

**CSV Columns:** Name, Email, Status, Source, Notes, Created By, Created At

---

## Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [/* array of validation errors if applicable */]
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient permissions |
| 404 | Not Found |
| 409 | Conflict — e.g., email already exists |
| 422 | Unprocessable Entity — validation failed |
| 500 | Internal Server Error |
