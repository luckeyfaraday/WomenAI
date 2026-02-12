# Feature: Menstrual Cycle Tracking

## Overview
The Menstrual Cycle Tracking feature allows users to log their menstrual cycles, track symptoms, and receive predictions for future cycles. This is a core component of the health-focused MVP for ClaraAI.

## goals
- Enable users to log cycle start and end dates.
- Predict next cycle start date.
- (Future) Track symptoms (cramps, mood, flow intensity).
- (Future) Provide insights based on logged data.

## Data Model

### `cycles` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique identifier for the cycle entry. |
| `user_id` | INTEGER | NOT NULL | ID of the user (linked to users table - TBD). |
| `start_date` | DATE | NOT NULL | The first day of menstruation. |
| `end_date` | DATE | | The last day of menstruation (nullable if current). |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation timestamp. |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Record update timestamp. |

## User Flows

### 1. Log a New Period
**User Intent:** "I got my period today."
1. User interacts with AI (chat or UI button).
2. AI asks for confirmation of start date (defaults to today).
3. System creates a new entry in `cycles` with `start_date`.

### 2. Log Period End
**User Intent:** "My period ended."
1. User captures intent.
2. System updates the latest open cycle entry (where `end_date` is NULL) with the provided date.

### 3. View History
**User Intent:** "When was my last period?"
1. System queries the `cycles` table for the most recent entry.
2. AI responds with the date and duration.

## API Endpoints (Draft)

- `POST /api/cycles`: Create a new cycle entry.
    - Body: `{ start_date: 'YYYY-MM-DD' }`
- `PUT /api/cycles/:id`: Update an existing cycle (e.g., set end date).
    - Body: `{ end_date: 'YYYY-MM-DD' }`
- `GET /api/cycles`: Retrieve cycle history.
