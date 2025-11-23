# 📘 Admin API Documentation
## API Endpoints

### Admin Routes

#### 1. Create Drivers
- **Endpoint:** `POST /api/v1/admin/make-driver`
- **Headers:** `Bearer token` 
- **Request Body:**
    ```json
    {
        "name": "string",
        "email": "string",
       
    }
    ```
- **Response:**
    ```json
    {
        "message": "driver creation successful! Verification email sent to driver.",
        "success": true
    }

    also send email
    ```

#### 2. Login 
- **Endpoint:** `Post /api/v1/admin/login`
- **Request Body:**
    ```json
    {
        "password": "string",
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

#### 3. Get Drivers
- **Headers:** `Bearer token` 
- **Endpoint:** `Get /api/v1/admin/drivers`
- **Response:**
    ```json
    {
    "success": true,
    "message": "Login successful",
    "drivers":[]
    }
    ```

#### 4. Get Users
- **Headers:** `Bearer token` 
- **Endpoint:** `Get /api/v1/admin/users`
- **Response:**
    ```json
    {
    "success": true,
    "message": "Login successful",
    "users":[]
    }
    ```

#### 5. Get Reports
- **Headers:** `Bearer token` 
- **Endpoint:** `Get /api/v1/admin/reports`
- **Response:**
    ```json
    {
    "success": true,
    "message": "Login successful",
    "reports":[]
    }
    ```

#### 6. Get User details
- **Headers:** `Bearer token` 
- **Endpoint:** `Get /api/v1/admin/user-details/:id`
- **Response:**
    ```json
    {
    "success": true,
    "message": "User found successful",
    "user": {
    "_id": "6745c92ea9b121348c21df11",
    "name": "Karan",
    "email": "karan@example.com",
    "phoneNo": "9876543210",
    "profilePic": "https://cloudinary.com/img/user1.png",
    "profilePicPublicId": "user/karan123",
    "googleId": null,

    "referralCode": "ABCD1234",
    "referredBy": "XYZ890",

    "coins": {
      "balance": 450,
      "earnedTotal": 1500,
      "spentTotal": 1050,
      "pendingWithdrawal": 0,
      "locked": 0,
      "updatedAt": "2025-01-15T10:20:00.000Z"
    },

    "withdrawHistory": [
      {
        "_id": "6745cc7f43be06fbc44b12aa",
        "amount": 250,
        "method": "upi",
        "status": "completed",
        "date": "2025-01-14T12:20:00.000Z"
      },
      
    ],

    "bankDetails": {
      "accountHolderName": "Karan Singh",
      "accountNumber": "12345678901",
      "ifscCode": "SBIN0001234",
      "bankName": "SBI",
      "upiId": "karansingh@ybl"
    },

    "reports": [
      {
        "_id": "6745d993a2320c37b7d2d454",
        "reportId": {
          "_id": "6745d993a2320c37b7d2d454",
          "status": "accepted",

          "location": {
            "lat": 26.4858,
            "lng": 80.3211,
            "address": "Kanpur Nagar, UP, India"
          },

          "photos": [
            {
              "url": "https://cloudinary.com/waste/img1.jpg",
          
            }
          ],

          "type": {
            "reportedType": "dry waste",
            "verifiedType": "dry waste"
          },

          "weight": {
            "reportedWeight": "5 kg",
            "verifiedWeight": "4.8 kg"
          },

          "reportedBy": {
            "_id": "6745c92ea9b121348c21df11",
            "name": "Karan Singh",
            "email": "karan@example.com",
            "phoneNo": "9876543210"
          },

          "acceptedBy": {
            "_id": "6745c92ea9b121348c210999",
            "name": "Rohit Yadav",
            "email": "driver1@example.com",
            "phoneNo": "9988776655"
          },

          "timestamps": {
            "createdAt": "2025-01-16T14:50:00.000Z",
            "acceptedAt": "2025-01-16T15:40:00.000Z",
            "completedAt": "2025-01-16T16:00:00.000Z"
          },

          "userCoinsEarned": 40,
          "driverCoinsEarned": 25,
          "notes": "Pickup successful"
        }
      },
    ],

    "feedbacks": [
      {
        "_id": "6745e1104d4224fdbcd76372",
        "rating": 5,
        "comment": "Great service!",
        "createdAt": "2025-01-19T10:40:00.000Z"
      }
    ],

    "isBlocked": false,
    "createdAt": "2025-01-05T08:00:00.000Z",
    "updatedAt": "2025-01-19T12:00:00.000Z"
  }
    }
    ```


#### 7. Get Driver details
- **Headers:** `Bearer token` 
- **Endpoint:** `Get /api/v1/admin/driver-details/:id`
- **Response:**
    ```json
    {
    "success": true,
    "message": "driver found successful",
    "driver": {
    "_id": "67b8242cce54a72f96b23011",
    "name": "Rohit Kumar",
    "email": "rohit.driver@example.com",
    "phoneNo": "9876543210",
    "coins": {
      "balance": 350,
      "earnedTotal": 1200,
      "spentTotal": 850,
      "pendingWithdrawal": 100,
      "locked": 0,
      "updatedAt": "2025-01-20T09:34:21.000Z"
    },
    "withdrawHistory": [
      {
        "_id": "67b824b2cc54a72f96b23881",
        "amount": 200,
        "method": "upi",
        "date": "2025-01-21T10:00:00.000Z",
        "status": "completed"
      }
    ],
    "bankDetails": {
      "accountHolderName": "Rohit Kumar",
      "accountNumber": "1234567890",
      "ifscCode": "SBIN0000456",
      "bankName": "State Bank of India",
      "upiId": "rohit@sbi"
    },
    "active": true,
    
    "location": {
      "lat": 28.6129,
      "lng": 77.2295
    },
    "rating": {
      "average": 4.6,
      "totalRatings": 142,
      "totalWork": 287
    },
    "reports": [
      {
        "_id": "67b825aacc54a72f96b24afc",
        "reportId": {
          "_id": "67b82500cc54a72f96b23ff9",
          "reportedBy": {
            "_id": "67b818dacd48f263a537b798",
            "name": "Vishal Sharma",
            "email": "vishal.user@example.com",
            "phoneNo": "9999999999"
          },
          "acceptedBy": {
            "_id": "67b8242cce54a72f96b23011",
            "name": "Rohit Kumar",
            "email": "rohit.driver@example.com"
          },
          "status": "accepted",
          "photos": [
            {
              "url": "https://cloudinary.com/waste/photo1.jpg",
            }
          ],
          "type": {
            "reportedType": "dry waste",
            "verifiedType": "dry waste"
          },
          "weight": {
            "reportedWeight": "2 KG",
            "verifiedWeight": "1.8 KG"
          },
          "timestamps": {
            "createdAt": "2025-01-20T07:00:00.000Z",
            "acceptedAt": "2025-01-20T07:30:00.000Z"
          },
          "notes": "Verified successfully"
        }
      }
    ],
    "reportStats": {
      "totalReports": 287,
      "accepted": 240,
      "declined": 12,
      "pending": 35
    },
    "feedbacks": [
      {
        "_id": "67b82900cc54a72f96b28bd3",
        "user": "67b818dacd48f263a537b798",
        "rating": 5,
        "comment": "Good job!"
      }
    ],
    "isBlocked": false,
    "createdAt": "2025-01-15T12:30:21.000Z",
    "updatedAt": "2025-01-21T08:10:00.000Z"
  }
    }
    ```


#### 8. Get Report details
- **Headers:** `Bearer token` 
- **Endpoint:** `Get /api/v1/admin/report-details/:id`
- **Response:**
    ```json
    {
    "success": true,
    "message": "Login successful",
    "report":{
        "_id": "67c0113f9d52a84592b90a11",
        "reportedBy": {
          "_id": "67c00e3b8edc142774a4f121",
          "name": "Akash Singh",
          "email": "akash.user@example.com",
          "phoneNo": "9999988888"
        },
        "acceptedBy": {
          "_id": "67b8242cce54a72f96b23011",
          "name": "Rohit Kumar",
          "email": "rohit.driver@example.com",
          "phoneNo": "9876543210"
        },
        "userCoinsEarned": 20,
        "driverCoinsEarned": 15,
        "location": {
          "lat": 28.6139,
          "lng": 77.2090,
          "address": "Rajpath Area, New Delhi, India"
        },
        "photos": [
          {
            "url": "https://cloudinary.com/report/photo1.jpg",
            
          }
        ],
        "type": {
          "reportedType": "dry waste",
          "verifiedType": "dry waste"
        },
        "weight": {
          "reportedWeight": "2 KG",
          "verifiedWeight": "1.9 KG"
        },
        "status": "accepted",
        "timestamps": {
          "createdAt": "2025-01-24T07:45:00.000Z",
          "acceptedAt": "2025-01-24T08:10:00.000Z",
          "completedAt": "2025-01-24T09:00:00.000Z"
        },
        "notes": "Driver verified and waste collected",
        "createdAt": "2025-01-24T07:45:10.000Z",
        "updatedAt": "2025-01-24T09:00:00.000Z",
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
