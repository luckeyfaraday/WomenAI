# Feature: Safety Resources Info

## Overview
The Safety Resources Info feature provides users with quick, discreet access to verified safety information, emergency contacts, and educational resources regarding personal safety and domestic violence.

## Goals
- Provide a curated directory of local and international safety hotlines.
- Enable discreet "Exit Mode" to quickly hide the app.
- Offer educational content on recognizing signs of abuse and creating safety plans.

## Data Model

### `safety_resources` Table (Static/Admin Managed)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique identifier. |
| `name` | TEXT | NOT NULL | Name of the organization or resource. |
| `phone` | TEXT | | Contact phone number. |
| `website` | TEXT | | URL to the resource. |
| `category` | TEXT | | e.g., "Domestic Violence", "Legal Aid", "Shelter". |
| `country_code` | VARCHAR(2) | | ISO country code for localization. |

## User Flows

### 1. Find Help
**User Intent:** "I need help with a stalker." or "Domestic violence hotline."
1. AI identifies safety-critical intent.
2. AI provides immediate hotline numbers (localized if possible).
3. AI offers to display a list of local shelters or legal references.

### 2. Quick Exit
**User Intent:** User triggers "Panic" or "Exit" button.
1. App immediately switches to a neutral, harmless interface (e.g., a weather app or news feed).
2. History of the sensitive conversation is hidden or locked.

## API Endpoints (Draft)

- `GET /api/safety/resources`: Retrieve list of safety resources (filterable by category/location).
