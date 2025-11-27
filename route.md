# 📘 API Documentation

## API Endpoints

### User Routes

### 2. sending new report to driver by socket

- **Event Name:** `new-report`
- **Paylod :**

  ```json
  {
    "distance": 320,
    "msg": "A new report is available near you.",
    "report": {
      "_id": "67403aa4123bf128",
      "reportedBy": "67123abc981273",
      "userCoinsEarned": 15,
      "driverCoinsEarned": 25,
      "location": {
        "lat": "18.5204",
        "lng": "73.8567",
        "address": "Pune, Maharashtra"
      },
      "photos": [
        {
          "url": "https://res.cloudinary.com/...jpg",
          "public_id": "products/abc123"
        }
      ],
      "type": {
        "reportedType": "Garbage"
      },
      "weight": {
        "reportedWeight": "5kg"
      },
      "notes": "Road ke side kachra pada hai",
      "status": "pending",
      "createdAt": "2025-11-27T14:33:12.221Z"
    }
  }
  ```

