# 📘 API Documentation
## API Endpoints

### User Routes

#### 1. Create User
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

    also send email
    ```
