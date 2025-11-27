# Admin API Documentation (Frontend)

Base path: `/api/v1/admin/`

This document explains the admin-related API endpoints provided by the backend routes in `routes/adminRoute.js`. It includes the endpoint descriptions, authentication details, request/response schemas, sample requests, and important notes for the frontend.

---

## 🔐 Authentication & Headers

- All endpoints that use `isAdmin` or `isAuthenticated` middleware require an `Authorization` header in the form:

  Authorization: `Bearer <token>`

- All requests that have a body should set `Content-Type: application/json` unless uploading files.

- The admin JWT is obtained after a successful login (returns `token`). The JWT payload contains `{ id }` (admin user id).

---

## Endpoints

### 1) POST /signup
- Purpose: Register a new admin and send a verification email.
- Route: `/api/v1/admin/signup`
- Auth: Public
- Body (application/json):
  - name (string) - required
  - email (string, email) - required
  - password (string) - optional on backend validations (but send for login later)

- Success: 201
```json
{ "message": "Signup successful! Verification email sent.", "success": true }
```

- Errors: 400 for validation errors or user exists; 500 for internal server errors.

- Notes: Backend sends a verification token as an email link. Token is valid for 1 day.


### 2) GET /verify/:token
- Purpose: Verify admin's email via token.
- Route: `/api/v1/admin/verify/:token`
- Auth: Public
- Path param: token

- Success: 200
```json
{ "success": true, "message": "Email verified successfully!" }
```

- Errors: 400 invalid/expired token, 404 user not found.


### 3) POST /login
- Purpose: Admin login (returns JWT & admin user object)
- Route: `/api/v1/admin/login`
- Auth: Public
- Body (application/json):
  - email (string) - required
  - password (string) - required

- Success (200):
```json
{ "success": true, "message": "Login successful", "token": "<JWT>", "user": { /* admin object */ } }
```

- Errors: 400 validation, 404 user not found, 500 server error.


### 4) POST /make-driver
- Purpose: Create a new driver (admin-only)
- Route: `/api/v1/admin/make-driver`
- Auth: Admin (Authorization: Bearer <token>)
- Body (application/json):
  - name (string) - required
  - email (string) - required

- Success (200):
```json
{
  "success": true,
  "message": "driver creation successful! Verification email sent to driver.",
  "driver": { /* new driver object */ }
}
```

- Errors:
  - 400: all fields required
  - 500: Internal error

- Notes: Backend generates a `randomOtp()` for driver as a password and emails credentials to the driver.


### 5) GET /drivers
- Purpose: Return a list of driver objects (populated with reports)
- Route: `/api/v1/admin/drivers`
- Auth: Admin
- Response (200):
```json
{ "success": true, "message": "all drivers are here", "drivers": [ /* driver objects */ ] }
```

- Errors: 500 server error


### 6) GET /users
- Purpose: Return all users (populated reports)
- Route: `/api/v1/admin/users`
- Auth: Admin
- Response (200):
```json
{ "success": true, "message": "all users are here", "users": [ /* user objects */ ] }
```

- Errors: 500 server error


### 7) GET /reports
- Purpose: Return all reports with populated `reportedBy` and `acceptedBy` details
- Route: `/api/v1/admin/reports`
- Auth: Admin
- Response (200):
```json
{ "success": true, "message": "all reports are here", "reports": [ /* report items */ ] }
```

- Note: `reportedBy` selected fields are `name`, `email`; `acceptedBy` selects `name`, `phone`.


### 8) GET /user-details/:id
- Purpose: Fetch details for a single user (with nested populated `reports.reportId`, their `reportedBy`, `acceptedBy`, and `feedbacks`)
- Route: `/api/v1/admin/user-details/:id`
- Auth: Admin
- Path param: id (user id)
- Success (200):
```json
{ "success": true, "message": "user is here", "user": {/* populated user object */} }
```

- Errors: 404 user not found, 500 server error


### 9) GET /driver-details/:id
- Purpose: Fetch a driver's detailed data with nested populated reports and feedbacks
- Route: `/api/v1/admin/driver-details/:id`
- Auth: Admin
- Path param: id (driver id)
- Success (200):
```json
{ "success": true, "message": "driver is here", "driver": {/* populated driver object */} }
```

- Errors: 404 driver not found, 500 server error


### 10) GET /report-details/:id
- Purpose: Fetch a single report with `reportedBy` and `acceptedBy` selected fields
- Route: `/api/v1/admin/report-details/:id`
- Auth: Admin
- Path param: id (report id)
- Success (200):
```json
{ "success": true, "message": "report is here", "report": {/* report object */} }
```

- Errors: 404 Report not found, 500 server error

- FYI: The backend route references a `Report` variable rather than `reportModel` in the handler; if this endpoint throws a server error, share the logs with backend devs.


### 11) GET /dashbord
- Purpose: Return a small summary summary/stats for dashboard
- Route: `/api/v1/admin/dashbord`
- Auth: Admin
- Response (200):
```json
{
  "success": true,
  "data": {
    "reports": { "total": 120, "byStatus": [{ "_id": "pending", "count": 10 }] },
    "users": { "total": 1000 },
    "drivers": { "total": 200, "active": 150 }
  }
}
```

- Errors: 500 server error


### 12) POST /forgot-password
- Purpose: Admin forgot-password: backend sends OTP to admin email
- Route: `/api/v1/admin/forgot-password`
- Auth: Public
- Body (application/json):
  - email (string) - required
- Success (200):
```json
{ "success": true, "message": "OTP sent to email" }
```
- Process: sets `user.otp` and `user.otpExpiry` (10 minutes); calls resetPassEmail.


### 13) POST /verify-otp/:email
- Purpose: Verify OTP for admin
- Route: `/api/v1/admin/verify-otp/:email`
- Auth: Public
- Path param: email
- Body: { otp: "<6-digit string>" }
- Success (201):
```json
{ "message": "OTP Verification successfully", "success": true }
```

- Validation: `otp` in body; also checks `user.otp`, expiry, match; sets `eligibleForNewPass = true` if valid.


### 14) GET /resend-otp/:email
- Purpose: Resend OTP for forgot password flow
- Route: `/api/v1/admin/resend-otp/:email`
- Auth: Public
- Success (200):
```json
{ "success": true, "message": "OTP sent to email" }
```

- Errors: 404 user not found, 404 if `user.otp` is not set (first call must be forgot-password), 500 error


### 15) POST /new-password/:email
- Purpose: Set new password after OTP verification
- Route: `/api/v1/admin/new-password/:email`
- Auth: Public (protected by OTP flow) - the backend enforces eligibility
- Body: { newPassword: "<password>" }
- Validations: newPassword required; user must have `eligibleForNewPass` true.
- Success (200):
```json
{ "message": "Password changed successfully!", "success": true }
```

- Errors: 400 user not found / missing fields / unauthorized; 500 server error


### 16) PUT /update-profile
- Purpose: Update profile for the authenticated user
- Route: `/api/v1/admin/update-profile`
- Auth: `isAuthenticated` middleware
- Body: varies; backend implementation is currently empty — assume typical profile updates like `name`, `phoneNo`, etc.

- Note: The endpoint handler is an empty stub; confirm with backend devs for required request shape and response structure.


### 17) GET /home
- Purpose: Returns current admin data (via `req.admin` from `isAdmin` middleware)
- Route: `/api/v1/admin/home`
- Auth: Admin
- Response (200):
```json
{ "success": true, "message": "welCome", "admin": {/* admin object */} }
```

- Errors: 404 admin not found, 500 server error

---

## Example Requests

### Login (axios)

```js
axios.post('/api/v1/admin/login', {
  email: 'admin@domain.com',
  password: 'superSecret'
}).then(res => {
  const token = res.data.token;
  // Save token to localStorage or state
});
```

### Get Drivers (axios)

```js
axios.get('/api/v1/admin/drivers', {
  headers: { Authorization: `Bearer ${token}` }
}).then(res => {
  const drivers = res.data.drivers;
});
```

### Create Driver (curl)

```bash
curl -X POST "http://localhost:5000/api/v1/admin/make-driver" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Driver Name", "email":"driver@example.com"}'
```

---

## General Response Patterns

- Success responses usually contain `success: true` or `message` string and data like `user`, `driver`, `reports`, `token` etc.

- Validation errors (express-validator) return status 400 and `errors` array:
```json
{ "success": false, "errors": [ { "msg": "Name is required", "param": "name" } ] }
```

- For token or auth failures response often is `success: false` with message "Authorization token is missing or invalid" or "The Session has expired".

---

## Backend Notes & Gotchas (FYI for Frontend)

- The route `adminRoute.js` refers to `userModel` (in `/users`, `/user-details`) but it is not imported at the top in the file; this may cause a server-side error if not defined elsewhere.
- The `report-details` handler references `Report.findById` instead of `reportModel.findById`. That's likely a bug — report fetching may break until fixed. If you see a 500 or crash, notify the backend developer.
- `update-profile` is currently a stub and returns nothing. Expect an update once implemented.
- `login` returns `token` and `user` as data; the frontend must store the JWT to call protected routes.

---

## Error Handling & UX Tips 💡

- Always capture and display informative messages from the backend: `message` and `errors` arrays when available.
- For OTP flows, show countdown / expiry (10 minutes) and allow user to request resend.
- When using `make-driver`, the backend will set a temp password and email it to the driver — keep UX clear: show a success toast that email was sent.
- For dashboard, the `reports.byStatus` is an array of objects `{ _id: "statusName", count: number }` — prepare charts accordingly.

---

## Contact & Next Steps

If an endpoint returns unexpected errors or data shapes (e.g., 500 or schema mismatch), please:
1) Confirm route prefix `/api/v1/admin/` in config.
2) Confirm you are passing the `Authorization` header for admin-protected routes.
3) Share the backend logs or error message; it might be the issues mentioned in the "Gotchas" section above.

---

Happy coding! If you'd like, I can also generate Postman / Insomnia collection JSON to quickly import these endpoints for testing. 🚀
