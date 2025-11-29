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
        "password": "string" (min 6 len),
        "referredBy": "string" (min 8 length)
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
- **Endpoint:** `Post /api/v1/user/verify/otp`
- **Request Body:**
    ```json
    {
        "otp": "string",
        "email":"string"
    }
    ```
- **Response:**
    ```json
    { 
    "success": true, 
    "message": "Email verified successfully!",
    "user":{},
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTM4MjdlZDMzYWY5MWViZGE3ODg5NyIsImlhdCI6MTc2Mjk2MTk4M30.q_VZWkba2BfvM2XJRhpJfq26Y6f7nZ8E8hMVTMlC7Ko"
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
        "reports":{},
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

#### 9. At Home By using socket io send to server when user logged in or visit home page or opend app
- **Event name:** `user_connect`
- **Payload** 
```json
{
  "userId": "6913827ed33af91ebda78897"
}
```

#### 10. At Home By using socket io recive from server when report accepted
- **Event name:** `report-accepted`
```json
{
    "message":"Your report has been accepted by a driver.",
    "driver":{},
    "report": {}, 
}
```



#### 11. Make Report

- **Endpoint:** `POST /api/v1/report/make-report`
- **Headers:** `Bearer token`
- ## Request formData:
  ```json
  {
      "latitude": "27.65765",
      "longitude": "132.53534",
      "type": "string",
      not require below
      "address": "string",
      "weight": "string",
      "notes": "string",
      "files": []
  }
  ```
- **Response:**

  ```json
  {
      "message": "Report created successfully!",
      "success": true,
      "report": {
  "_id": "67460b267a9c4fae78b91d11",

  "reportedBy": {
  "_id": "673aa3bd4fa91cb1e8b38277",
  "name": "Rohit Sharma",
  "email": "rohit@gmail.com",
  "phone": "9876543210"
  },

  "acceptedBy": {
  "_id": "673aa4ef4fa91cb1e8b38288",
  "name": "Driver Sanjay",
  "email": "sanjaydriver@gmail.com",
  "phoneNo": "9123456789",
  "coins": {
    "balance": 120,
    "earnedTotal": 430,
    "spentTotal": 75,
    "pendingWithdrawal": 20,
    "locked": 0,
    "updatedAt": "2025-11-25T10:30:45.123Z"
  },
  "rating": {
    "average": 4.5,
    "totalRatings": 120,
    "totalWork": 310
  },
  },

  "userCoinsEarned": 10,
  "driverCoinsEarned": 5,

  "location": {
      "lat": 19.0760,
      "lng": 72.8777,
      "address": "Andheri West, Mumbai"
  },

  "photos": [
  {
      "url": "https://res.cloudinary.com/demo/image/upload/report1.jpg",
      }
  ],

  "type": {
      "reportedType": "dry waste",
      "verifiedType": "dry waste"
  },

  "weight": {
      "reportedWeight": "5 kg",
      "verifiedWeight": "4.5 kg"
  },

  "status": "accepted",

  "timestamps": {
      "createdAt": "2025-11-26T16:30:00.123Z",
      "acceptedAt": "2025-11-26T17:00:00.987Z",
      "completedAt": null,
      "rejectedAt": null
      },

  "notes": "Driver verified and collected the waste.",

  "createdAt": "2025-11-26T16:30:00.123Z",
  "updatedAt": "2025-11-26T17:00:00.987Z"
  },
  }
  ```




