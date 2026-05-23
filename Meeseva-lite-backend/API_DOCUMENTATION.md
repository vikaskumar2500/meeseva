# ISE Backend API Documentation

This document provides a summary of the API endpoints for the ISE backend.

## Base URL

The base URL for all endpoints is `http://localhost:5000/api/v1`.

## Authentication

### OTP-Based Registration Flow (Recommended for Frontend)

This is a two-step registration process with OTP verification.

#### Step 1: Initiate Registration (Send OTP)

- **Method**: `POST`
- **URL**: `/auth/register/initiate`
- **Description**: Starts the registration process and sends OTP to user's phone.
- **Body**:
  ```json
  {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210"
  }
  ```

  ---

  ## Services

  Browse and search government services without authentication.

  ### 1. Get all services

  - **Method**: `GET`
  - **URL**: `/services`
  - **Query Parameters**:
    - `page` (optional): Page number (default: 1)
    - `limit` (optional): Items per page (default: 10)
    - `category` (optional): Filter by category
    - `department` (optional): Filter by department
    - `tag` (optional): Filter by tag
  - **Response**:
    ```json
    {
      "data": [
        {
          "_id": "60a5...",
          "id": 1,
          "name": "Aadhaar Registration",
          "description": "Register for unique identification number",
          "category": "Identity & Documents",
          "department": "Ministry of Electronics and Information Technology",
          "eligibility": ["All Indian residents", "Age 18+"],
          "requiredDocuments": ["Birth certificate", "Address proof"],
          "fees": 0,
          "processingTime": "7-14 days",
          "rating": 4.5,
          "reviewCount": 2345,
          "popular": true,
          "tags": ["identity", "documents", "free"]
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 150,
        "pages": 15
      }
    }
    ```

  ### 2. Search services

  - **Method**: `GET`
  - **URL**: `/services/search`
  - **Query Parameters**:
    - `q` (required): Search query
    - `page` (optional): Page number
    - `limit` (optional): Items per page
  - **Example**: `/services/search?q=aadhaar&page=1&limit=10`
  - **Response**: Same as get all services

  ### 3. Get popular services

  - **Method**: `GET`
  - **URL**: `/services/popular`
  - **Query Parameters**:
    - `limit` (optional): Number of popular services (default: 10)
  - **Response**:
    ```json
    {
      "data": [
        { ...service object... }
      ]
    }
    ```

  ### 4. Get service categories

  - **Method**: `GET`
  - **URL**: `/services/filters/categories`
  - **Response**:
    ```json
    {
      "data": [
        "Identity & Documents",
        "Travel Documents",
        "Transportation",
        "Education",
        "Health & Wellness",
        "Social Welfare",
        "Property & Housing",
        "Business & Commerce",
        "Labor & Employment"
      ]
    }
    ```

  ### 5. Get service departments

  - **Method**: `GET`
  - **URL**: `/services/filters/departments`
  - **Response**:
    ```json
    {
      "data": [
        "Ministry of Electronics and Information Technology",
        "Ministry of Finance",
        "Ministry of External Affairs",
        "Ministry of Road Transport & Highways",
        "Ministry of Education"
      ]
    }
    ```

  ### 6. Get service tags

  - **Method**: `GET`
  - **URL**: `/services/filters/tags`
  - **Response**:
    ```json
    {
      "data": [
        "identity",
        "documents",
        "free",
        "taxation",
        "travel",
        "international"
      ]
    }
    ```

  ### 7. Get single service

  - **Method**: `GET`
  - **URL**: `/services/:id`
  - **Example**: `/services/1`
  - **Response**: Single service object

  ---

  ## Documents

  These endpoints require authentication. Manage user documents with OCR support.

  ### 1. Upload document

  - **Method**: `POST`
  - **URL**: `/documents`
  - **Headers**: `Authorization: Bearer <token>`
  - **Body** (multipart/form-data):
    - `file` (required): Document file
    - `name` (required): Document name
    - `type` (required): Document type (aadhaar, pan, passport, license, certificate, other)
    - `issuer` (required): Issuing authority
    - `documentNumber` (required): Document number
    - `issueDate` (optional): ISO date string
    - `expiryDate` (optional): ISO date string
  - **Response**:
    ```json
    {
      "_id": "60a5...",
      "userId": "60a5...",
      "name": "My Aadhaar",
      "type": "aadhaar",
      "issuer": "UIDAI",
      "documentNumber": "123456789012",
      "fileUrl": "/uploads/document.pdf",
      "fileMimetype": "application/pdf",
      "fileSize": 102400,
      "verificationStatus": "pending",
      "createdAt": "2026-05-14T..."
    }
    ```

  ### 2. Get user documents

  - **Method**: `GET`
  - **URL**: `/documents`
  - **Headers**: `Authorization: Bearer <token>`
  - **Query Parameters**:
    - `page` (optional): Page number
    - `limit` (optional): Items per page
    - `status` (optional): Filter by status (pending, verified, rejected)
  - **Response**: Paginated documents with pagination info

  ### 3. Get single document

  - **Method**: `GET`
  - **URL**: `/documents/:id`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: Single document object

  ### 4. Delete document

  - **Method**: `DELETE`
  - **URL**: `/documents/:id`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: `{ "message": "Document deleted successfully" }`

  ### 5. Update extracted data (OCR)

  - **Method**: `PATCH`
  - **URL**: `/documents/:id/extracted-data`
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**:
    ```json
    {
      "extractedData": {
        "name": "John Doe",
        "dob": "1990-01-01",
        "address": "..."
      }
    }
    ```
  - **Response**: Updated document object

  ### 6. Update verification status (Admin)

  - **Method**: `PATCH`
  - **URL**: `/documents/:id/verification`
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**:
    ```json
    {
      "status": "verified",
      "remarks": "Document verified successfully"
    }
    ```
  - **Response**: Updated document object

  ---

  ## User Profile

  These endpoints require authentication.

  ### 1. Get profile

  - **Method**: `GET`
  - **URL**: `/users/me`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: User object with all details

  ### 2. Update profile

  - **Method**: `PATCH`
  - **URL**: `/users/me`
  - **Headers**: `Authorization: Bearer <token>`
  - **Body** (all optional):
    ```json
    {
      "fullName": "John Doe",
      "address": "123 Main St",
      "country": "India",
      "state": "Karnataka",
      "district": "Bengaluru",
      "pinCode": "560001",
      "aadhaar": "123456789012",
      "avatar": "https://example.com/avatar.jpg"
    }
    ```
  - **Response**: Updated user object

  ### 3. Change password

  - **Method**: `POST`
  - **URL**: `/users/change-password`
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**:
    ```json
    {
      "currentPassword": "oldpassword123",
      "newPassword": "newpassword456"
    }
    ```
  - **Response**: `{ "message": "Password changed successfully" }`

  ### 4. Get saved services

  - **Method**: `GET`
  - **URL**: `/users/saved-services`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**:
    ```json
    {
      "data": [1, 5, 10, 15]
    }
    ```

  ### 5. Add saved service

  - **Method**: `POST`
  - **URL**: `/users/saved-services`
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**:
    ```json
    {
      "serviceId": 5
    }
    ```
  - **Response**: Updated user object

  ### 6. Remove saved service

  - **Method**: `DELETE`
  - **URL**: `/users/saved-services/:serviceId`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: Updated user object

  ### 7. Add trusted document

  - **Method**: `POST`
  - **URL**: `/users/trusted-documents`
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**:
    ```json
    {
      "name": "My Aadhaar",
      "issuer": "UIDAI",
      "verified": false
    }
    ```
  - **Response**: Updated user object

  ### 8. Get application statistics

  - **Method**: `GET`
  - **URL**: `/users/stats`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**:
    ```json
    {
      "totalApplications": 5,
      "totalApproved": 3,
      "totalRejected": 1,
      "totalPending": 1
    }
    ```
- **Response (Success 200)**:
  ```json
  {
    "message": "OTP sent successfully",
    "phone": "9876543210",
    "expiresIn": 600
  }
  ```
- **Response (Error 409)**:
  ```json
  {
    "message": "Email already registered"
  }
  ```

#### Step 2: Verify OTP and Complete Registration

- **Method**: `POST`
- **URL**: `/auth/register/verify-otp`
- **Description**: Verifies OTP and creates the user account.
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "otp": "123456",
    "fullName": "John Doe",
    "password": "SecurePassword123"
  }
  ```
- **Response (Success 201)**:
  ```json
  {
    "user": {
      "_id": "60a5...",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "role": "citizen",
      "otpVerified": true,
      "createdAt": "2026-05-14T...",
      "updatedAt": "2026-05-14T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response (Error 400)**:
  ```json
  {
    "message": "Invalid or expired OTP"
  }
  ```

### OTP-Based Forgot Password Flow

This is a two-step password reset process with OTP verification.

#### Step 1: Initiate Forgot Password (Send OTP)

- **Method**: `POST`
- **URL**: `/auth/forgot-password/initiate`
- **Description**: Sends OTP to user's phone for password reset.
- **Body**:
  ```json
  {
    "loginId": "john.doe@example.com"
  }
  ```
- **Note**: `loginId` can be email or phone number.
- **Response (Success 200)**:
  ```json
  {
    "message": "OTP sent successfully",
    "phone": "9876543210",
    "expiresIn": 600
  }
  ```
- **Response (Error 404)**:
  ```json
  {
    "message": "User not found"
  }
  ```

#### Step 2: Verify OTP and Reset Password

- **Method**: `POST`
- **URL**: `/auth/forgot-password/verify-otp`
- **Description**: Verifies OTP and updates user's password.
- **Body**:
  ```json
  {
    "loginId": "john.doe@example.com",
    "otp": "123456",
    "newPassword": "NewSecurePassword456"
  }
  ```
- **Response (Success 200)**:
  ```json
  {
    "message": "Password reset successfully"
  }
  ```
- **Response (Error 400)**:
  ```json
  {
    "message": "Invalid or expired OTP"
  }
  ```

### Direct Login

- **Method**: `POST`
- **URL**: `/auth/login`
- **Description**: Authenticates a user and returns a JWT. The `loginId` field can be email or phone.
- **Body**:
  ```json
  {
    "loginId": "john.doe@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (Success 200)**:
  ```json
  {
    "user": {
      "_id": "60a5...",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "role": "citizen",
      "otpVerified": true,
      "createdAt": "2026-05-14T...",
      "updatedAt": "2026-05-14T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response (Error 401)**:
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

### Legacy Registration (Full Profile - Backward Compatibility)

- **Method**: `POST`
- **URL**: `/auth/register`
- **Description**: Creates a new user account with complete profile details in one step.
- **Body**:
  ```json
  {
    "desiredLoginId": "9999999999",
    "mobileNumber": "8888888888",
    "fullName": "John Doe",
    "address": "221B Baker Street",
    "country": "India",
    "state": "Karnataka",
    "district": "Bengaluru",
    "pinCode": "560001",
    "email": "john.doe@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
- **Response (Success 201)**:
  ```json
  {
    "user": {
      "role": "citizen",
      "_id": "60a5...",
      "desiredLoginId": "9999999999",
      "mobileNumber": "8888888888",
      "fullName": "John Doe",
      "address": "221B Baker Street",
      "country": "India",
      "state": "Karnataka",
      "district": "Bengaluru",
      "pinCode": "560001",
      "email": "john.doe@example.com",
      "otpVerified": true,
      "createdAt": "2026-05-14T...",
      "updatedAt": "2026-05-14T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

## Users

This endpoint requires authentication. You must include the JWT in the `Authorization` header as a Bearer token.

`Authorization: Bearer <your_jwt_token>`

### 1. Get user profile

- **Method**: `GET`
- **URL**: `/users/me`
- **Description**: Retrieves the profile of the currently authenticated user.
- **Response**:
  ```json
  {
    "user": {
        "role": "user",
        "_id": "60a5...",
      "desiredLoginId": "9999999999",
      "mobileNumber": "8888888888",
      "fullName": "John Doe",
      "address": "221B Baker Street",
      "country": "India",
      "state": "Karnataka",
      "district": "Bengaluru",
      "pinCode": "560001",
        "email": "john.doe@example.com",
        "createdAt": "2026-05-14T...",
        "updatedAt": "2026-05-14T..."
    }
  }
  ```

---

## Applications

These endpoints require authentication.

### 1. Create a new application

- **Method**: `POST`
- **URL**: `/applications`
- **Description**: Creates a new application for the authenticated user.
- **Body**:
  ```json
  {
    "applicationType": "leave_request",
    "title": "Vacation Request",
    "payload": {
      "startDate": "2026-06-01",
      "endDate": "2026-06-05",
      "reason": "Family vacation"
    }
  }
  ```
- **Response**:
  ```json
  {
    "application": {
        "userId": "60a5...",
        "applicationType": "leave_request",
        "title": "Vacation Request",
        "status": "draft",
        "payload": {
            "startDate": "2026-06-01",
            "endDate": "2026-06-05",
            "reason": "Family vacation"
        },
        "_id": "60a5...",
        "createdAt": "2026-05-14T...",
        "updatedAt": "2026-05-14T..."
    }
  }
  ```

### 2. List all applications

- **Method**: `GET`
- **URL**: `/applications`
- **Description**: Retrieves all applications for the authenticated user.
- **Response**:
  ```json
  {
    "applications": [
      {
        "_id": "60a5...",
        "userId": "60a5...",
        "applicationType": "leave_request",
        "title": "Vacation Request",
        "status": "draft",
        "payload": {
            "startDate": "2026-06-01",
            "endDate": "2026-06-05",
            "reason": "Family vacation"
        },
        "createdAt": "2026-05-14T...",
        "updatedAt": "2026-05-14T..."
      }
    ]
  }
  ```

### 3. Get an application by ID

- **Method**: `GET`
- **URL**: `/applications/:applicationId`
- **Description**: Retrieves a single application by its ID.
- **Response**:
  ```json
  {
    "application": {
        "_id": "60a5...",
        "userId": "60a5...",
        "applicationType": "leave_request",
        "title": "Vacation Request",
        "status": "draft",
        "payload": {
            "startDate": "2026-06-01",
            "endDate": "2026-06-05",
            "reason": "Family vacation"
        },
        "createdAt": "2026-05-14T...",
        "updatedAt": "2026-05-14T..."
    }
  }
  ```

### 4. Update an application

- **Method**: `PATCH`
- **URL**: `/applications/:applicationId`
- **Description**: Updates an existing application.
- **Body**:
  ```json
  {
    "status": "submitted",
    "payload": {
      "startDate": "2026-06-01",
      "endDate": "2026-06-07",
      "reason": "Extended family vacation"
    }
  }
  ```
- **Response**:
  ```json
  {
    "application": {
        "_id": "60a5...",
        "userId": "60a5...",
        "applicationType": "leave_request",
        "title": "Vacation Request",
        "status": "submitted",
        "payload": {
            "startDate": "2026-06-01",
            "endDate": "2026-06-07",
            "reason": "Extended family vacation"
        },
        "createdAt": "2026-05-14T...",
        "updatedAt": "2026-05-14T..."
    }
  }
  ```

---

## Tracking

These endpoints require authentication.

### 1. Create a new tracking entry

- **Method**: `POST`
- **URL**: `/tracking`
- **Description**: Adds a new tracking entry for an application and updates the application's status.
- **Body**:
  ```json
  {
    "applicationId": "60a5...",
    "status": "in_review",
    "note": "Forwarded to manager for approval."
  }
  ```
- **Response**:
  ```json
  {
    "trackingEntry": {
        "applicationId": "60a5...",
        "status": "in_review",
        "note": "Forwarded to manager for approval.",
        "updatedBy": "60a5...",
        "_id": "60a5...",
        "createdAt": "2026-05-14T...",
        "updatedAt": "2026-05-14T..."
    }
  }
  ```

### 2. Get application timeline

- **Method**: `GET`
- **URL**: `/tracking/:applicationId`
- **Description**: Retrieves the tracking history for a specific application.
- **Response**:
  ```json
  {
    "timeline": [
      {
        "_id": "60a5...",
        "applicationId": "60a5...",
        "status": "in_review",
        "note": "Forwarded to manager for approval.",
        "updatedBy": "60a5...",
        "createdAt": "2026-05-14T...",
        "updatedAt": "2026-05-14T..."
      },
      {
        "_id": "60a5...",
        "applicationId": "60a5...",
        "status": "submitted",
        "updatedBy": "60a5...",
        "createdAt": "2026-05-14T...",
        "updatedAt": "2026-05-14T..."
      }
    ]
  }
  ```
