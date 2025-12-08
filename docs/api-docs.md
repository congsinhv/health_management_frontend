# API Documentation

## Schedule API

This section details the API endpoints related to managing user health schedules.

### Get All Schedules

`GET /api/v1/schedules/`

Retrieves a list of all health schedules for the authenticated user, filtering out any superseded schedules.

#### Request

No parameters required.

#### Response (200 OK)

```json
[
  {
    "id": 1,
    "user_id": 123,
    "goal": "gain",
    "schedule_mode": "fixed",
    "selected_days": ["monday", "wednesday", "friday"],
    "timezone": "America/New_York",
    "weekly_plan": {
      "monday": {
        "exercise": "Weightlifting",
        "duration_minutes": 60,
        "estimated_calories": 300,
        "description": "Upper body workout",
        "status": "completed",
        "error_message": null
      }
    },
    "status": "active",
    "created_at": "2025-12-01T10:00:00Z",
    "updated_at": "2025-12-01T10:00:00Z"
  }
]
```

#### Error Responses

- `401 Unauthorized`: If the user is not authenticated.
- `500 Internal Server Error`: For unexpected server issues.

### Update Schedule Status

`PATCH /api/v1/schedules/{scheduleId}/`

Updates the status of a specific health schedule. Currently supports changing status between `active` and `paused`.

#### Path Parameters

| Name         | Type      | Description                       |
| :----------- | :-------- | :-------------------------------- |
| `scheduleId` | `integer` | The ID of the schedule to update. |

#### Request Body (application/json)

| Name     | Type     | Description                                                               |
| :------- | :------- | :------------------------------------------------------------------------ |
| `status` | `string` | The new status for the schedule. Must be either `"active"` or `"paused"`. |

```json
{
  "status": "paused"
}
```

#### Response (200 OK)

```json
{
  "id": 1,
  "status": "paused",
  "updated_at": "2025-12-08T11:30:00Z"
}
```

#### Error Responses

- `400 Bad Request`: If the request body is invalid (e.g., `status` is not `"active"` or `"paused"`).
- `401 Unauthorized`: If the user is not authenticated.
- `404 Not Found`: If the `scheduleId` does not correspond to an existing schedule.
- `500 Internal Server Error`: For unexpected server issues.
