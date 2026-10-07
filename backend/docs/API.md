# Gym Platform API

Base URL (dev): `http://localhost:3333`

All bodies are JSON. Dates are ISO 8601 strings (UTC). IDs are UUIDs.

## Conventions

### Authentication

| Token | Where it lives | Lifetime |
|---|---|---|
| Access token (JWT) | Response body `token`; send it as `Authorization: Bearer <token>` | 10 minutes |
| Refresh token (JWT) | `refreshToken` cookie (`HttpOnly`, `SameSite=Lax`, `Secure` in production) | 7 days |

Both tokens carry `sub` (user id) and `role` (`ADMIN` or `MEMBER`).

When the access token expires, call `PATCH /token/refresh` with the cookie to get a new one. Browsers must send requests with credentials (`withCredentials: true` / `credentials: 'include'`) so the cookie travels. The API's CORS allowlist comes from `CORS_ORIGIN`.

### Auth column

- **Public**: no token.
- **User**: any valid access token.
- **Admin**: access token with `role: ADMIN`.

### Errors

Every error response has the shape `{ "message": string }`. Validation errors also carry `issues`, a map from field name to messages:

```json
{
  "message": "Validation error",
  "issues": { "email": ["Invalid email address"] }
}
```

| Status | When |
|---|---|
| 400 | Invalid body, query or path params (`issues` lists the fields) |
| 401 | Missing/invalid/expired access token; wrong credentials; invalid refresh token |
| 403 | Authenticated, but the route is admin-only |
| 404 | Resource not found |
| 409 | Conflict with current state (email taken, already checked in today, already validated) |
| 422 | A business rule refused the action (too far from the gym, validation window over) |
| 500 | Unexpected error |

### Pagination

List endpoints take `page` (integer ≥ 1, default 1) and return up to **20** items per page. There is no total count; a page with fewer than 20 items is the last one.

### Modalities

`WEIGHT_TRAINING`, `CROSSFIT`, `FUNCTIONAL`, `YOGA`, `PILATES`, `SWIMMING`, `MARTIAL_ARTS`, `DANCE`

---

## Shared shapes

### User

```json
{
  "id": "uuid",
  "name": "Gustavo",
  "email": "gustavo@example.com",
  "role": "MEMBER",
  "created_at": "2025-10-07T18:43:00.000Z"
}
```

### Gym

```json
{
  "id": "uuid",
  "title": "Iron House",
  "description": "Musculação de alto rendimento...",
  "phone": "(11) 3000-1001",
  "address": "Rua Haddock Lobo, 150 - Cerqueira César",
  "modalities": ["WEIGHT_TRAINING", "FUNCTIONAL"],
  "latitude": -23.5610,
  "longitude": -46.6556,
  "created_at": "2025-10-07T18:43:00.000Z"
}
```

`description`, `phone` and `address` may be `null`. `latitude` and `longitude` are numbers.

### CheckIn

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "gym_id": "uuid",
  "created_at": "2025-10-07T18:43:00.000Z",
  "validated_at": null
}
```

`validated_at` is `null` until an admin validates the check-in.

---

## Users and sessions

### POST /users

Create an account. The user is signed in immediately.

- **Auth**: Public
- **Body**

  ```json
  { "name": "Gustavo", "email": "gustavo@example.com", "password": "123456" }
  ```

  `name` must not be empty, `email` must be a valid address (it is stored lowercased), `password` must be at least 6 characters.

- **Response 201**: `{ "token": "<access token>" }`, plus the `refreshToken` cookie.
- **Errors**: 400 (validation), 409 (email already registered)

### POST /sessions

Sign in.

- **Auth**: Public
- **Body**: `{ "email": "gustavo@example.com", "password": "123456" }`
- **Response 200**: `{ "token": "<access token>" }`, plus the `refreshToken` cookie.
- **Errors**: 400 (validation), 401 (`Invalid credentials!`)

### PATCH /token/refresh

Exchange the refresh token cookie for a new access token. The refresh token is rotated, and the user's current role is read from the database.

- **Auth**: `refreshToken` cookie
- **Body**: none
- **Response 200**: `{ "token": "<access token>" }`, plus a new `refreshToken` cookie.
- **Errors**: 401 (missing, invalid or expired cookie, or the user no longer exists; the cookie is cleared)

### POST /sessions/logout

Sign out by clearing the refresh token cookie. The access token stays valid until it expires (up to 10 min), so clients must discard it.

- **Auth**: Public
- **Response 204**: empty body.

### GET /me

The signed-in user's profile.

- **Auth**: User
- **Response 200**: `{ "user": User }`
- **Errors**: 401, 404 (the user was deleted)

---

## Gyms

### GET /gyms/search

Search gyms by title or address (case-insensitive), optionally filtered by modality. With no `query` and no `modality`, every gym is listed. Results are sorted by title.

- **Auth**: User
- **Query params**

  | Name | Type | Required | Notes |
  |---|---|---|---|
  | `query` | string | no | Matches title or address, up to 100 characters |
  | `modality` | Modality | no | Only gyms that offer it |
  | `page` | integer | no | Default 1 |

- **Response 200**: `{ "gyms": Gym[] }`
- **Errors**: 400, 401

### GET /gyms/nearby

Gyms within a radius of a coordinate, closest first (at most 100).

- **Auth**: User
- **Query params**

  | Name | Type | Required | Notes |
  |---|---|---|---|
  | `latitude` | number | yes | -90 to 90 |
  | `longitude` | number | yes | -180 to 180 |
  | `radius` | number | no | Kilometers, > 0 and ≤ 50. Default 10 |

- **Response 200**: `{ "gyms": Gym[] }`
- **Errors**: 400, 401

### GET /gyms/:gymId

- **Auth**: User
- **Path params**: `gymId` (UUID)
- **Response 200**: `{ "gym": Gym }`
- **Errors**: 400 (invalid UUID), 401, 404

### POST /gyms

- **Auth**: Admin
- **Body**

  ```json
  {
    "title": "Iron House",
    "description": "Optional text",
    "phone": "Optional text",
    "address": "Optional text",
    "modalities": ["WEIGHT_TRAINING"],
    "latitude": -23.561,
    "longitude": -46.6556
  }
  ```

  Only `title`, `latitude` and `longitude` are required. Empty strings in the optional text fields are stored as `null`. `modalities` defaults to `[]`.

- **Response 201**: `{ "gym": Gym }`
- **Errors**: 400, 401, 403

### PUT /gyms/:gymId

Replace a gym's data. Same body and rules as `POST /gyms`. Omitted optional fields are cleared.

- **Auth**: Admin
- **Path params**: `gymId` (UUID)
- **Response 200**: `{ "gym": Gym }`
- **Errors**: 400, 401, 403, 404

---

## Check-ins

### POST /gyms/:gymId/check-ins

Check in at a gym. The server is the source of truth for both rules:

- the user must be **within 100 meters** of the gym;
- a user can check in **once per day**. Days follow the `APP_TIMEZONE` setting (default `America/Sao_Paulo`).

- **Auth**: User
- **Path params**: `gymId` (UUID)
- **Body**: `{ "latitude": -23.561, "longitude": -46.6556 }`, the user's current position.
- **Response 201**: `{ "checkIn": CheckIn }`
- **Errors**: 400, 401, 404 (gym not found), 409 (already checked in today), 422 (more than 100 m away)

### GET /check-ins/history

The signed-in user's check-ins, most recent first, each with a summary of its gym.

- **Auth**: User
- **Query params**: `page` (integer, default 1)
- **Response 200**

  ```json
  {
    "checkIns": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "gym_id": "uuid",
        "created_at": "2025-10-07T21:43:00.000Z",
        "validated_at": null,
        "gym": { "id": "uuid", "title": "Iron House", "address": "Rua ..." }
      }
    ]
  }
  ```

- **Errors**: 400, 401

### GET /check-ins/metrics

The signed-in user's stats. Weeks start on Monday. Days follow `APP_TIMEZONE`.

- **Auth**: User
- **Response 200**

  ```json
  {
    "checkInsCount": 42,
    "checkInsThisWeek": 3,
    "checkInsThisMonth": 11,
    "currentStreak": 3,
    "bestStreak": 8
  }
  ```

  `currentStreak` counts consecutive days with a check-in ending today, or ending yesterday if the user has not checked in yet today.

- **Errors**: 401

### GET /check-ins

Every check-in on the platform, most recent first, with the user and the gym. Admins use it to find check-ins to validate.

- **Auth**: Admin
- **Query params**

  | Name | Type | Required | Notes |
  |---|---|---|---|
  | `status` | `pending` \| `validated` | no | Default: both |
  | `page` | integer | no | Default 1 |

- **Response 200**

  ```json
  {
    "checkIns": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "gym_id": "uuid",
        "created_at": "2025-10-07T21:43:00.000Z",
        "validated_at": null,
        "gym": { "id": "uuid", "title": "Iron House", "address": "Rua ..." },
        "user": { "id": "uuid", "name": "Gustavo", "email": "gustavo@example.com" }
      }
    ]
  }
  ```

- **Errors**: 400, 401, 403

### PATCH /check-ins/:checkInId/validate

Confirm that a check-in really happened. A check-in can only be validated **up to 20 minutes after it was created**, and only once.

- **Auth**: Admin
- **Path params**: `checkInId` (UUID)
- **Response 204**: empty body.
- **Errors**: 400, 401, 403, 404, 409 (already validated), 422 (more than 20 minutes have passed)

---

## Health

### GET /health

- **Auth**: Public
- **Response 200**: `{ "status": "ok" }`
