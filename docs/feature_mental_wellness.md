# Feature: Mental Wellness Support

## Overview
The Mental Wellness Support feature provides users with tools to track their mood, access grounding exercises, and receive supportive, empathetic AI interactions.

## Goals
- Enable users to log daily mood and emotional state.
- Provide immediate access to calming techniques (box breathing, grounding).
- Offer empathetic AI conversation tailored to the user's emotional state.

## Data Model

### `mood_logs` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique identifier. |
| `user_id` | INTEGER | NOT NULL | ID of the user. |
| `mood_score` | INTEGER | CHECK (1-5) | Numeric representation of mood (1=Very Bad, 5=Very Good). |
| `tags` | TEXT[] | | Array of descriptive tags (e.g., "Anxious", "Tired", "Excited"). |
| `notes` | TEXT | | Optional free-text notes. |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Timestamp of the log. |

## User Flows

### 1. Log Mood
**User Intent:** "I'm feeling anxious."
1. AI acknowledges and asks to log the feeling.
2. User confirms or selects a mood score/tag.
3. System saves to `mood_logs`.
4. AI offers a relevant resource (e.g., "Would you like to try a breathing exercise?").

### 2. Access Calming Exercise
**User Intent:** "I need to calm down."
1. AI presents a list of quick exercises (e.g., Box Breathing, 5-4-3-2-1 Grounding).
2. User selects one.
3. AI guides the user through the steps textually or via audio (future).

## API Endpoints (Draft)

- `POST /api/mood`: Create a new mood log.
- `GET /api/mood/history`: Retrieve mood history for charts/insights.
- `GET /api/wellness/exercises`: Retrieve list of available wellness exercises.
