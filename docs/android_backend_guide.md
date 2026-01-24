# Connecting Android APK to Backend

This guide explains how to ensure your WomenAI Android app can communicate with the backend server in both Development and Production environments.

## The Problem: "Localhost"

In basic web development, your frontend talks to `http://localhost:3000`.
However, on an Android device (Physical or Emulator), `localhost` refers to **the device itself**, not your computer.

Therefore, the app cannot find the backend at `localhost`.

## Solutions

### 1. Production (Live App Store Release)

In production, your backend is hosted on a public server (e.g., Render, AWS, Heroku) with a real domain name (e.g., `https://api.womenai.com`).

**How it works:**
Since the backend has a public URL, the Android device connects to it just like any other website, using standard internet protocols. No special IP addresses (`10.0.2.2`) are needed.

**Step-by-Step Setup:**

1.  **Set the Environment Variable:**
    Create or edit `.env.production` in your `frontend` directory:
    ```bash
    VITE_API_URL=https://your-backend-url.onrender.com
    ```

2.  **Build the App:**
    When you build the frontend for Capacitor, Vite will bake this URL into the javascript bundle.
    ```bash
    npm run build
    npx cap sync
    ```

3.  **Verify:**
    Open the app on a device. It will automatically make requests to `https://your-backend-url.onrender.com`.

**Security Note:**
Android requires secure connections (HTTPS) by default. Ensure your production backend uses `https://`. If you try to use `http://` in production, the app will block the connection unless you explicitly allow it (discouraged).

### 2. Android Emulator (Development)
The Android Emulator uses a special Magic IP to refer to the host computer's localhost.

**Magic IP:** `10.0.2.2`

**Step:**
If you are running the backend on your computer at port 3000, tell the app to look at:
`http://10.0.2.2:3000`

### 3. Physical Device (Development)
To test on a real phone via USB, both devices must be on the same **Wi-Fi Network**.

**Steps:**
1. Find your computer's Local IP Address (e.g., `192.168.1.5`).
   - Linux/Mac: Run `ifconfig` or `ip addr show`.
   - Windows: Run `ipconfig`.
2. Configure the app to point to that IP.
   `VITE_API_URL=http://192.168.1.5:3000`
3. Ensure your backend binds to `0.0.0.0` (all interfaces) not just `localhost`.
   - In `backend/index.js`, ensure `app.listen(port, '0.0.0.0')`.

## Network Security Config (Cleartext Traffic)

By default, Android blocks HTTP (unencrypted) traffic.

### Quick Fix (Development Only)
To allow HTTP traffic to your local computer:

1. Open `android/app/src/main/AndroidManifest.xml`.
2. Add `android:usesCleartextTraffic="true"` to the `<application>` tag.

```xml
<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="WomenAI"
    android:usesCleartextTraffic="true"  <!-- ADD THIS LINE -->
    ... >
```

### Proper Fix (Network Security Config)
Create a config file to allow cleartext *only* for specific domains (like your local IP).

1. Create `android/app/src/main/res/xml/network_security_config.xml`.
2. Add content:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">192.168.1.5</domain> <!-- Your Local IP -->
    </domain-config>
</network-security-config>
```
3. Reference it in `AndroidManifest.xml`:
```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ... >
```
