# Firebase Setup Guide - Troubleshooting Sign Up Issues

If sign-up is not working, follow these steps to configure Firebase properly:

## Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `evergreen-4b811`
3. Click on **"Authentication"** in the left sidebar
4. Click on **"Get started"** (if you haven't enabled it yet)
5. Click on the **"Sign-in method"** tab
6. Click on **"Email/Password"**
7. **Enable** the "Email/Password" provider (toggle it ON)
8. Click **"Save"**

## Step 2: Set Up Firestore Database

1. In Firebase Console, click on **"Firestore Database"** in the left sidebar
2. Click **"Create database"** (if you haven't created it yet)
3. Choose **"Start in test mode"** (for development/testing)
4. Select a location closest to you
5. Click **"Enable"**

## Step 3: Update Firestore Security Rules (Important!)

1. In Firestore Database, click on the **"Rules"** tab
2. Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own document
    match /Users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User_Habits collection - users can only read/write their own habits
    match /User_Habits/{habitId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userID;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userID;
    }
    
    // Weekly_Progress collection - users can only read/write their own progress
    match /Weekly_Progress/{progressId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userID;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userID;
    }
    
    // Habits, Levels, Quizzes collections - read only for authenticated users
    match /Habits/{document=**} {
      allow read: if request.auth != null;
    }
    match /Levels/{document=**} {
      allow read: if request.auth != null;
    }
    match /Quizzes/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"** to save the rules

**Note:** These rules allow authenticated users to read/write their own data. For a hackathon prototype, this is acceptable. For production, you'd want stricter rules.

## Step 4: Check Browser Console for Errors

1. Open your browser's Developer Tools:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I`
   - **Firefox**: Press `F12` or `Ctrl+Shift+K`
   - **Safari**: Press `Cmd+Option+I` (Mac only)

2. Click on the **"Console"** tab

3. Try to sign up again

4. Look for any red error messages - these will tell you exactly what's wrong

Common errors you might see:
- `auth/operation-not-allowed` → Email/Password not enabled in Firebase
- `permission-denied` → Firestore rules are blocking the write
- `auth/network-request-failed` → Network connection issue
- `auth/invalid-api-key` → Firebase config is wrong

## Step 5: Verify Firebase Configuration

Make sure your `firebaseConfig.js` file has the correct values. It should look like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC9jcCorXg4SAHIhxWApuVg-L9fLdwOTD8",
  authDomain: "evergreen-4b811.firebaseapp.com",
  projectId: "evergreen-4b811",
  storageBucket: "evergreen-4b811.firebasestorage.app",
  messagingSenderId: "644153701644",
  appId: "1:644153701644:web:b25b8b523204a315b98529"
};
```

## Quick Checklist

- [ ] Firebase Authentication enabled
- [ ] Email/Password provider enabled
- [ ] Firestore Database created
- [ ] Firestore Security Rules updated and published
- [ ] Browser console checked for errors
- [ ] Internet connection working
- [ ] Firebase config values are correct

## Still Not Working?

1. **Check the browser console** (F12) - look for red error messages
2. **Check the terminal** where you ran `npm start` - look for any error messages
3. **Try refreshing the page** after enabling Firebase features
4. **Clear browser cache** and try again
5. **Check if you're connected to the internet**

If you see a specific error message, share it and I can help you fix it!

