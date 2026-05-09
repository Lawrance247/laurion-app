# Laurion — React Native App
## Complete Build & Play Store Publication Guide

---

## What's in This Package

```
LaurionApp/
├── App.tsx                        ← Root entry point
├── package.json                   ← All dependencies
├── tsconfig.json
├── babel.config.js
└── src/
    ├── theme/index.ts             ← Brand colours, typography, spacing
    ├── services/api.ts            ← ALL API calls to your Flask backend
    ├── components/index.tsx       ← Reusable UI components
    ├── navigation/index.tsx       ← Bottom tabs + stack navigation
    └── screens/
        ├── LoginScreen.tsx        ← Sign in
        ├── RegisterScreen.tsx     ← Create account (student/teacher)
        ├── DashboardScreen.tsx    ← Home: tasks, popular materials
        ├── ClassesScreen.tsx      ← Browse materials by grade & subject
        ├── PlannerScreen.tsx      ← Add/delete study tasks
        ├── NotesScreen.tsx        ← Write notes, share as text
        ├── ProfileScreen.tsx      ← Account info + logout
        ├── UploadScreen.tsx       ← Teacher: upload PDF/DOCX/PPTX
        └── AdminScreen.tsx        ← Admin: platform stats
```

---

## Step 1 — Set Up Your Computer

### Install Node.js
Download from https://nodejs.org (version 18 or higher)

### Install React Native CLI
```bash
npm install -g react-native-cli
```

### Install Android Studio
1. Download from https://developer.android.com/studio
2. Open Android Studio → SDK Manager → install:
   - Android SDK Platform 33 (Android 13)
   - Android SDK Build-Tools
   - Android Emulator
3. Create a virtual device (Pixel 7, API 33)

### Set Environment Variables (Windows)
Add to System Environment Variables:
```
ANDROID_HOME = C:\Users\YourName\AppData\Local\Android\Sdk
Path += %ANDROID_HOME%\tools
Path += %ANDROID_HOME%\platform-tools
```

### Set Environment Variables (Mac/Linux)
Add to ~/.zshrc or ~/.bashrc:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

---

## Step 2 — Deploy Your Flask Backend

**Your app needs to be live online before the mobile app can connect to it.**

### Option A: Deploy to Render (Free, Recommended)
1. Push your Flask code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your repo
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn server:app` (matches your Procfile)
6. Set environment variables:
   - `SECRET_KEY` = any random string
   - `DATABASE_URL` = (Render provides this with a free Postgres DB)
7. Copy your live URL, e.g. `https://laurion-app.onrender.com`

### Option B: Deploy to Railway
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Add PostgreSQL database plugin
4. It auto-detects your Procfile

---

## Step 3 — Configure the App

Open `src/services/api.ts` and update line 9:

```typescript
// BEFORE:
export const BASE_URL = 'https://YOUR-LAURION-BACKEND.onrender.com';

// AFTER (your real URL):
export const BASE_URL = 'https://laurion-app.onrender.com';
```

Also update `src/screens/ProfileScreen.tsx` line 45 with the same URL.

---

## Step 4 — Install Dependencies & Run

```bash
# Navigate into the project
cd LaurionApp

# Install all packages
npm install

# Start Metro bundler (keep this running in one terminal)
npx react-native start

# In a NEW terminal — run on Android emulator or physical device
npx react-native run-android
```

### Running on a Physical Android Phone
1. Enable Developer Options on your phone:
   Settings → About Phone → tap "Build Number" 7 times
2. Enable USB Debugging
3. Connect phone via USB
4. Run `npx react-native run-android`

---

## Step 5 — Build Release APK

```bash
cd android
./gradlew assembleRelease
```

Your APK will be at:
`android/app/build/outputs/apk/release/app-release.apk`

### Sign the APK (Required for Play Store)

Generate a keystore (do this ONCE, keep the file safe!):
```bash
keytool -genkey -v -keystore laurion-release.keystore \
  -alias laurion -keyalg RSA -keysize 2048 -validity 10000
```

Add to `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('laurion-release.keystore')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'laurion'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt')
        }
    }
}
```

Rebuild:
```bash
./gradlew assembleRelease
```

---

## Step 6 — Publish to Google Play Store

### 6.1 Create Developer Account
- Go to https://play.google.com/apps/publish
- Pay the one-time $25 registration fee
- Complete identity verification

### 6.2 Create New App
1. Click "Create app"
2. App name: **Laurion**
3. Default language: English (South Africa)
4. App category: Education
5. App type: App (not game)

### 6.3 Fill In Store Listing
- **Short description** (80 chars): Smart learning platform for Grades 8–12 students
- **Full description**: Include your subjects, features (planner, notes, materials)
- **Icon**: Use your logo.png (512×512 px required)
- **Screenshots**: Take at least 2 phone screenshots of the app
- **Feature graphic**: 1024×500 px banner image

### 6.4 Upload Your App
1. Production → Releases → Create new release
2. Upload your signed `app-release.apk`
3. Write release notes

### 6.5 Set Up Content Rating
Complete the content rating questionnaire — select "Education" category.

### 6.6 Set Pricing & Distribution
- Free app
- Select countries (include South Africa)

### 6.7 Submit for Review
Google reviews apps in 3–7 days. You'll receive an email once approved.

---

## App Features Summary

| Feature | Student | Teacher | Admin |
|---------|---------|---------|-------|
| Dashboard with tasks | ✅ | ✅ | ✅ |
| Browse materials by grade/subject | ✅ | ✅ | ✅ |
| Download study materials | ✅ | ✅ | ✅ |
| Write & save notes | ✅ | ✅ | ✅ |
| Share notes | ✅ | ✅ | ✅ |
| Study planner | ✅ | ✅ | ✅ |
| Upload materials | ❌ | ✅ | ✅ |
| Admin stats panel | ❌ | ❌ | ✅ |

---

## App Screens

1. **Login** — Sign in with username/password
2. **Register** — Create account as student or teacher
3. **Dashboard** — Overview: popular materials, today's tasks, quick-add task, overdue alerts
4. **Classes** — Grade selector (8–12) + subject picker (Math, Physical Science, Life Science, Geography, Accounting) → browse and open materials
5. **Planner** — Full task management with subject tagging and overdue highlighting
6. **Notes** — Rich text editor per subject/grade with auto-save indicator and share export
7. **Profile** — Account info, role display, navigation shortcuts, sign out
8. **Upload** (Teacher only) — Pick PDF/DOC/PPTX from device, assign subject & grade
9. **Admin** (Admin only) — Live platform stats

---

## Troubleshooting

**"Could not connect" on login**
→ Check your BASE_URL in `api.ts` is your live backend, not localhost

**Metro bundler error**
→ Run `npx react-native start --reset-cache`

**Android build fails**
→ Run `cd android && ./gradlew clean` then try again

**Session not persisting**
→ Your backend needs to accept cookie-based sessions from mobile; ensure CORS is configured

---

