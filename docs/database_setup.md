# ClaraAI Project: PostgreSQL Database Setup Guide

This document provides instructions for setting up your PostgreSQL database for the ClaraAI backend, including troubleshooting common connection issues.

## 1. Install PostgreSQL

If you don't already have PostgreSQL installed on your system, you'll need to download and install it.

*   **Download Page:** [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
*   Follow the installation instructions for your operating system. During installation, you will typically be asked to set a password for the default `postgres` user. Remember this password.

## 2. Create a Database

After installing PostgreSQL, you need to create a dedicated database for the ClaraAI project. You can do this using a tool like `psql` (PostgreSQL's command-line client) or a GUI tool like pgAdmin.

**Using `psql` (Command Line):**

1.  Open your terminal or command prompt.
2.  Connect to the default `postgres` database:
    ```bash
    psql -U postgres
    ```
    (Enter your `postgres` user password when prompted.)
3.  Once connected, create the new database:
    ```sql
    CREATE DATABASE womenai_db;
    \q
    ```
    (This creates a database named `womenai_db` and then quits `psql`.)

## 3. Configure Environment Variables (`.env` file)

The ClaraAI backend connects to your PostgreSQL database using a connection string defined in an environment variable.

1.  Navigate to your backend directory: `projects/WomenAI/backend`
2.  Create a new file named `.env` (if it doesn't already exist).
3.  Add the following line to your `.env` file, replacing the placeholders with your actual PostgreSQL credentials:

    ```
    DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/womenai_db"
    ```
    *   **`YOUR_USER`**: Your PostgreSQL username (e.g., `postgres`).
    *   **`YOUR_PASSWORD`**: The password for `YOUR_USER`.
    *   **`localhost`**: The host where your PostgreSQL server is running (usually `localhost` for local development).
    *   **`5432`**: The port your PostgreSQL server is listening on (default is `5432`).
    *   **`womenai_db`**: The name of the database you created in step 2.

## 4. Run the Database Schema Creation Script

Once your PostgreSQL server is running and your `.env` file is correctly configured, you can run the script to create the `cycles` table.

1.  Navigate to your backend directory in your terminal:
    ```bash
    cd projects/WomenAI/backend
    ```
2.  Execute the script:
    ```bash
    node scripts/create_cycles_table.js
    ```
    You should see a message like: `Cycles table created successfully or already exists.`

## Troubleshooting `ECONNREFUSED` Error

If you encounter an `ECONNREFUSED` error when running the script, it means the Node.js application could not connect to the PostgreSQL server. Here's a checklist:

*   **Is PostgreSQL Running?**
    *   **Windows:** Open "Services" (search for it in the Start Menu) and ensure the PostgreSQL service (e.g., `postgresql-x64-16`) is running. If not, start it.
    *   **macOS/Linux:** If installed via Homebrew or a package manager, you might use `brew services list` or `sudo systemctl status postgresql` to check its status and start it if necessary.
*   **Correct Port?** Ensure your PostgreSQL server is actually listening on port `5432`. If you configured it differently, update the `DATABASE_URL` in your `.env` file accordingly.
*   **Correct Credentials?** Double-check the `YOUR_USER` and `YOUR_PASSWORD` in your `DATABASE_URL`.
*   **Firewall?** Temporarily disable any local firewalls to see if they are blocking the connection (re-enable after testing).

---

After successfully running the `create_cycles_table.js` script, please let me know. We can then proceed with building the API endpoints.
