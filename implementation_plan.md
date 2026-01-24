# Implementation Plan - Android Cloud Build

We will set up a GitHub Action to automatically build the Android APK whenever code is pushed to the `main` branch. This avoids the need for the user to install Android Studio locally.

## User Review Required
> [!NOTE]
> This workflow builds a **Debug APK**. It is not signed for the Play Store yet. It is for testing on your device.
> To install it, you may need to enable "Install from Unknown Sources" on your Android phone.

## Proposed Changes

### Projects/WomenAI

#### [NEW] [.github/workflows/android-build.yml](file:///home/alan/home_ai/projects/WomenAI/.github/workflows/android-build.yml)
- Create a new workflow file that:
    1.  Checks out the code.
    2.  Sets up Node.js 20.
    3.  Sets up Java (JDK 17).
    4.  Installs dependencies (`npm ci` in `frontend`).
    5.  Builds the web app (`npm run build`).
    6.  Syncs Capacitor (`npx cap sync`).
    7.  Builds the APK using Gradle (`./gradlew assembleDebug`).
    8.  Uploads the APK as a workflow artifact.

## Verification Plan

### Automated Tests
- **Trigger:** Push the code to GitHub.
- **Verify:** Watch the "Actions" tab in the GitHub repository.
- **Success:** The workflow completes with a green checkmark.

### Manual Verification
1.  Download the `app-debug.apk` from the GitHub Actions run summary.
2.  Transfer it to an Android phone.
3.  Install and launch the app.
4.  Verify the "Logo" matches the new emoji favicon and the app loads the WomenAI interface.
