# 📘 API Documentation
## API Endpoints

### User Routes

#### 1. Create User
- **Endpoint:** `POST /api/v1/user/signup`
- **Request Body:**
    ```json
    {
        "name": "string",
        "email": "string",
        "password": "string" (min 6 len)
    }
    ```
- **Response:**
    ```json
    {
        "message": "Signup successful! Verification email sent.",
        "success": true
    }

    also send email
    ```

#### 2. Verify User By Email Link
- **Endpoint:** `GET /api/v1/user/verify/:token`
- **Request Parameters:**
    - `token`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTM4MjdlZDMzYWY5MWViZGE3ODg5NyIsImlhdCI6
- **Response:**
    ```json
    { 
    "success": true, 
    "message": "Email verified successfully!"
     }
    ```

#### 3. Login User
- **Endpoint:** `post /api/v1/user/login`

- **Request Body:**
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
- **Response:**
    ```json
    {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTM4MjdlZDMzYWY5MWViZGE3ODg5NyIsImlhdCI6MTc2Mjk2MTk4M30.q_VZWkba2BfvM2XJRhpJfq26Y6f7nZ8E8hMVTMlC7Ko",
    "user": {
        "coins": {
            "total": 0,
            "earned": 0,
            "redemed": 0
        },
        "_id": "6913827ed33af91ebda78897",
        "name": "user1",
        "email": "foxacab993@agenra.com",
        "feedbacks": [],
        "isBlocked": false,
        "withdrawHistory": [],
        "reportHistory": [],
    }
}
    ```

#### 4. Forgot Password
- **Endpoint:** `post /api/v1/user/forgot-password`
- **Request Body:**
    ```json
    {
        "email": "string"
    }
    ```

- **Response:**
    ```json
    {
      "success": true,
      "message": "OTP sent to email",
    }
    ```
    

#### 5. Verify OTP
- **Endpoint:** `post /api/v1/user/verify-otp/:email`

- **Request Parameters:**
    - `email`: "string

- **Request Body:**
    ```json
    {
        "otp": "string"
    }
    ```

- **Response:**
    ```json
    { 
        "message": "OTP Verification successfully",
        "success": true
    }
    ```

#### 6. Resend OTP
- **Endpoint:** `post /api/v1/user/resend-otp/:email`

- **Request Parameters:**
    - `email`: "string

- **Response:**
    ```json
    { 
        "message": "OTP Verification successfully",
        "success": true
    }
    ```

#### 7. New password   frontend should be (otp==confirmOtp)
- **Endpoint:** `post /api/v1/user/new-password/:email`

- **Request Parameters:**
    - `email`: "string

- **Request Body:**
    ```json
    {
        "newPassword": "string"
    }
    ```

- **Response:**
    ```json
    { 
        "message": "OTP Verification successfully",
        "success": true
    }
    ```

#### 8. Home
- **Endpoint:** `post /api/v1/user`
- ## Headers ##
- headers.authorization = "Bearer {{token}}"

- **Response:**
    ```json
    {
        "success": true,"message":"welCome",
        "user": {
        "coins": {
            "total": 0,
            "earned": 0,
            "redemed": 0
        },
        "_id": "6913827ed33af91ebda78897",
        "name": "user1",
        "email": "foxacab993@agenra.com",
        "feedbacks": [],
        "isBlocked": false,
        "withdrawHistory": [],
        "reportHistory": [],
    }
        
    }
    ```
