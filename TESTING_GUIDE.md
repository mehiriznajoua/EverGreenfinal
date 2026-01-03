# Step-by-Step Testing Guide for EverGreen App

## Step 1: Start the Development Server

Open your terminal/command prompt in the project folder and run:

```bash
npm start
```

Wait for the Expo server to start. You should see:

- A QR code
- Options like: Press `w` for web, `a` for Android, `i` for iOS

## Step 2: Choose How to View the App

### Option A: Test in Web Browser (Easiest)

1. Press the `w` key in the terminal
2. A browser window will open automatically
3. The app will load at `http://localhost:8081` (or similar)

### Option B: Test on Your Phone (Real Device)

1. Install "Expo Go" app from:
   - Google Play Store (Android)
   - App Store (iOS)
2. Make sure your phone and computer are on the SAME WiFi network
3. Scan the QR code shown in the terminal with:
   - Android: Use the Expo Go app's scanner
   - iOS: Use the Camera app (it will open Expo Go)

### Option C: Test in Android Emulator

1. Make sure you have Android Studio installed
2. Start an Android emulator
3. Press `a` key in the terminal
4. The app will open in the emulator

### Option D: Test in iOS Simulator (Mac only)

1. Make sure you have Xcode installed
2. Press `i` key in the terminal
3. The app will open in the iOS simulator

## Step 3: Test the App Flow

### A. CREATE A NEW ACCOUNT

1. You'll see the login screen with "Welcome to EverGreen 🌱"
2. Click on "Don't have an account? Sign Up"
3. Fill in the form:
   - **Username**: Enter any name (e.g., "TestUser")
   - **Email**: Enter a valid email (e.g., "test@example.com")
   - **Password**: Enter at least 6 characters (e.g., "test123")
4. Click "Create Account"
5. You should see: "Account created successfully! Please sign in."
6. You'll be redirected back to login screen

### B. SIGN IN

1. Enter the email and password you just created
2. Click "Sign In"
3. You should now see the "Choose your habit 🌿" screen

### C. SELECT RUNNING HABIT

1. Click on "Running" in the list
2. You'll see a checkmark appear
3. Click "Continue" button at the bottom
4. You should see the Running Assessment quiz

### D. TAKE THE QUIZ

1. Read each question about your running ability
2. Click either:
   - "Yes, I can" (if you can do it)
   - "Not quite yet" (if you can't)
3. Click "Next" to continue
4. Answer all questions until the quiz completes
5. You'll see "You're all set! 🎯" screen with your starting level

### E. VIEW DASHBOARD

1. Click "Start Your Journey" button
2. You should see the Dashboard with:
   - A tree emoji (🌰🌱🍃🌿🌴🌲🌳) showing your progress
   - Your current streak (starts at 0)
   - Main task with a checkbox
   - 3 complementary tasks with checkboxes

### F. TEST TASK COMPLETION

1. **Check the main task**:

   - Click the checkbox next to the main task
   - It should turn green with a checkmark ✓
   - This saves to Firebase automatically

2. **Check complementary tasks**:

   - Click any of the 3 complementary task checkboxes
   - They should also turn green when checked

3. **Complete the week**:
   - Make sure the main task is checked
   - Click "Complete Week" button (green button at bottom)
   - You should see: "Week Complete! Great job! Your progress has been saved."
   - Your streak should increase to 1
   - All tasks reset (unchecked) for the new week

### G. TEST LEVEL UP (Optional - Takes 2 weeks)

1. Complete the main task again
2. Click "Complete Week" again
3. After 2 successful weeks, you should see:
   - Alert: "Level Up! 🎉 Congratulations! You've reached Level X!"
   - Your level number increases
   - Tree emoji may change

### H. TEST STRUGGLING DETECTION (Optional)

1. Click "I didn't complete the main task this week" button
2. Do this twice in a row
3. After 2 incomplete weeks, you should see:
   - Alert: "Level Adjusted" (if you're above level 1)
   - Your level decreases (e.g., 3 → 2.5)

## Step 4: Test Persistence (Data Saving)

1. **Close the app** (or refresh if using web browser)
2. **Reopen/reload the app**
3. You should still be logged in
4. Your progress (level, streak, tasks) should be saved
5. You should go directly to Dashboard

## Step 5: Test Logout

1. Click "Logout" button (top right on Dashboard or Habit Selection)
2. You should return to login screen
3. Sign in again with the same credentials
4. Your progress should be restored

## Troubleshooting

### If the app won't start:

- Make sure you're in the project folder: `cd C:\Users\dell\EverGreen`
- Make sure dependencies are installed: `npm install`
- Try: `npx expo start --clear`

### If you see Firebase errors:

- Check that `firebaseConfig.js` has your correct Firebase credentials
- Make sure your Firebase project has Authentication enabled
- Make sure Firestore Database is created in Firebase Console

### If port 8081 is busy:

- The app will automatically use a different port (8082, 8083, etc.)
- Or stop other processes using that port

### If tasks don't save:

- Check your internet connection
- Check Firebase Console > Firestore Database to see if data is being saved
- Check browser console for errors (F12 key in browser)

## What You Should See in Firebase Console

After testing, check Firebase Console (https://console.firebase.google.com):

1. **Authentication > Users**: Should show your registered user
2. **Firestore Database > Users**: Should have a user document
3. **Firestore Database > User_Habits**: Should have `{userId}_Running` document
4. **Firestore Database > Weekly_Progress**: Should have weekly progress documents

---

**Need Help?** Check the browser console (F12) or terminal for error messages.
