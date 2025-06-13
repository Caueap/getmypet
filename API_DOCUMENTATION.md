# GetMyPet API Documentation

## 🚀 Base URL
```
http://localhost:3000
```

## 🔐 Authentication
**Type:** JWT Bearer Token
**Header:** `Authorization: Bearer <token>`

### Get Token:
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## 📋 API Endpoints

### 🔑 Authentication
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/login` | ❌ | User login |
| POST | `/auth/register` | ❌ | User registration |

### 👥 Users
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/users` | ❌ | Get all users (with pets populated) |
| GET | `/users/:id` | ❌ | Get specific user (with pets) |
| GET | `/users/:id/pets` | ❌ | Get user with pets (same as above) |
| POST | `/users` | ❌ | Create new user |
| PATCH | `/users/:id` | ❌ | Update user |
| DELETE | `/users/:id` | ❌ | Delete user |

### 🐕 Pets
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/pets` | ❌ | Get all pets |
| GET | `/pets/available` | ❌ | Get available pets |
| GET | `/pets/my-pets` | ✅ | Get current user's pets |
| GET | `/pets/owner/:ownerId` | ❌ | Get pets by owner |
| GET | `/pets/:id` | ❌ | Get specific pet |
| POST | `/pets` | ✅ | Create pet (owner = current user) |
| PATCH | `/pets/:id` | ❌ | Update pet |
| DELETE | `/pets/:id` | ❌ | Delete pet |

### 🏠 Adoptions
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/adoptions` | ❌ | Get all adoptions |
| GET | `/adoptions/statistics` | ❌ | Get adoption statistics |
| GET | `/adoptions/my-applications` | ✅ | Get current user's applications |
| GET | `/adoptions/my-pets-applications` | ✅ | Get applications for user's pets |
| GET | `/adoptions/applicant/:id` | ❌ | Get applications by applicant |
| GET | `/adoptions/owner/:id` | ❌ | Get applications by owner |
| GET | `/adoptions/pet/:id` | ❌ | Get applications for specific pet |
| GET | `/adoptions/:id` | ❌ | Get specific adoption |
| POST | `/adoptions` | ✅ | Create adoption (applicant = current user) |
| PATCH | `/adoptions/:id` | ❌ | Update adoption status |
| PATCH | `/adoptions/:id/complete` | ❌ | Complete adoption (transfers pet) |
| DELETE | `/adoptions/:id` | ❌ | Delete adoption |

## 📊 Data Models

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string", 
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "pets": [Pet],
  "role": "user",
  "isActive": true,
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Pet
```json
{
  "id": "string",
  "name": "string",
  "species": "dog|cat|bird|rabbit|other",
  "breed": "string?",
  "size": "small|medium|large",
  "age": "number",
  "gender": "male|female",
  "description": "string",
  "images": ["string"],
  "status": "available|adopted|pending",
  "vaccinations": ["string"],
  "isNeutered": "boolean",
  "location": "string",
  "ownerId": "string",
  "adoptedBy": "string?",
  "adoptedAt": "date?",
  "isActive": true,
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Adoption
```json
{
  "id": "string",
  "petId": "Pet",
  "applicantId": "User", 
  "ownerId": "User",
  "status": "pending|approved|rejected|completed",
  "message": "string",
  "ownerNotes": "string?",
  "applicationDate": "date",
  "responseDate": "date?",
  "completionDate": "date?",
  "isActive": true,
  "createdAt": "date",
  "updatedAt": "date"
}
```

## 🔄 Adoption Workflow
```
1. pending → User applies for adoption
2. approved → Owner approves application  
3. completed → Pet ownership transfers automatically
```

## 📝 Request Examples

### Register User
```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "phone": "123456789",
  "address": "123 Main St",
  "city": "Crato",
  "state": "CE",
  "zipCode": "63100-000"
}
```

### Create Pet
```json
POST /pets
Authorization: Bearer <token>
{
  "name": "Lua",
  "species": "dog",
  "breed": "Golden Retriever", 
  "size": "medium",
  "age": 0.2,
  "gender": "female",
  "description": "Very friendly dog!",
  "status": "available",
  "vaccinations": ["vaccine1", "vaccine2"],
  "isNeutered": true,
  "location": "Crato"
}
```

### Apply for Adoption
```json
POST /adoptions
Authorization: Bearer <token>
{
  "petId": "petId",
  "ownerId": "ownerId", 
  "message": "I would love to adopt this pet!"
}
```

### Approve Adoption
```json
PATCH /adoptions/:id
{
  "status": "approved",
  "ownerNotes": "Great application!"
}
```

## 🎯 Key Features for Flutter App
- ✅ User authentication (login/register)
- ✅ Browse available pets with filters
- ✅ User profiles with their pets
- ✅ Apply for pet adoption
- ✅ Manage adoption applications
- ✅ Pet registration for owners
- ✅ Adoption status tracking 