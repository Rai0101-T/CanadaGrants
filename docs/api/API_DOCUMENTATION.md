# Canadian Grant Finder API Documentation

This document outlines the available API endpoints for the Canadian Grant Finder application.

## Authentication Endpoints

### Register a New User

```
POST /api/register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "isBusiness": boolean,
  "businessName": "string",
  "businessType": "string",
  "businessDescription": "string",
  "industry": "string",
  "province": "string",
  "employeeCount": "string",
  "yearFounded": "string",
  "website": "string",
  "phoneNumber": "string",
  "address": "string"
}
```

**Response:** The created user object with a 201 status code.

### Login

```
POST /api/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** The user object with a 200 status code.

### Logout

```
POST /api/logout
```

**Response:** 200 status code upon successful logout.

### Get Current User

```
GET /api/user
```

**Response:** The current authenticated user object or 401 if not authenticated.

## Grant Endpoints

### Get All Grants

```
GET /api/grants
```

**Response:** Array of all grants.

### Get Featured Grants

```
GET /api/grants/featured
```

**Response:** Array of featured grants.

### Get Grant by ID

```
GET /api/grants/:id
```

**Response:** A single grant object.

### Get Grants by Type

```
GET /api/grants/type/:type
```

**Parameters:**
- `type`: "federal", "provincial", or "private"

**Response:** Array of grants of the specified type.

### Search Grants

```
GET /api/grants/search/:query
```

**Parameters:**
- `query`: Search term

**Response:** Array of grants matching the search query.

## User Grants (My List) Endpoints

### Get User's Grants

```
GET /api/mylist/:userId
```

**Parameters:**
- `userId`: User ID

**Response:** Array of grants saved by the user.

### Add Grant to User's List

```
POST /api/mylist
```

**Request Body:**
```json
{
  "userId": number,
  "grantId": number,
  "status": "string",
  "notes": "string"
}
```

**Response:** The created user grant object.

### Remove Grant from User's List

```
DELETE /api/mylist/:userId/:grantId
```

**Parameters:**
- `userId`: User ID
- `grantId`: Grant ID

**Response:** 200 status code on success.

### Check if Grant is in User's List

```
GET /api/mylist/:userId/:grantId
```

**Parameters:**
- `userId`: User ID
- `grantId`: Grant ID

**Response:** Boolean indicating if the grant is in the user's list.

## User Profile Endpoints

### Update User Profile

```
POST /api/user/update
```

**Request Body:** User object with fields to update.

**Response:** The updated user object.

## Grant Compatibility Endpoints

### Calculate Grant Compatibility

```
POST /api/grants/compatibility/:grantId
```

**Parameters:**
- `grantId`: Grant ID

**Request Body:** User profile data.

**Response:** Compatibility score and analysis.

### Get Grant Recommendations

```
POST /api/grants/recommend
```

**Request Body:** User profile data.

**Response:** Array of recommended grants.

## GrantScribe Endpoints

### Get Application Assistance

```
POST /api/grantscribe/assist
```

**Request Body:**
```json
{
  "grantId": number,
  "prompt": "string"
}
```

**Response:** AI-generated assistance text.

### Check for Plagiarism

```
POST /api/grantscribe/plagiarism-check
```

**Request Body:**
```json
{
  "text": "string"
}
```

**Response:** Plagiarism analysis.

### Generate Ideas

```
POST /api/grantscribe/generate-ideas
```

**Request Body:**
```json
{
  "grantId": number,
  "prompt": "string"
}
```

**Response:** AI-generated ideas.

## Admin Endpoints

### Run All Scrapers

```
POST /api/admin/scraper/run
```

**Response:** Status of the scraper operation.

### Run Specific Scraper

```
POST /api/admin/scraper/run/:source
```

**Parameters:**
- `source`: Scraper source identifier

**Response:** Status of the specific scraper operation.

### Add Grant

```
POST /api/admin/grants/add
```

**Request Body:** Grant object to add.

**Response:** The created grant object.

### Update Grant Image

```
POST /api/admin/grants/update-image
```

**Request Body:**
```json
{
  "id": number,
  "imageUrl": "string"
}
```

**Response:** The updated grant object.

### Delete Grant

```
DELETE /api/admin/grants/:id
```

**Parameters:**
- `id`: Grant ID

**Response:** 200 status code on success.