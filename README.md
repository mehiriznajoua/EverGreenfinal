# EverGreen 🌱

A mobile habit-building app that helps users develop healthy habits through progressive leveling and weekly task tracking. Built with React Native and Firebase.

## 📱 Features

- **Progressive Leveling System**: Start at your current ability level (Levels 1-7) and progress gradually
- **Weekly Task Tracking**: Complete main tasks and supporting tasks to build sustainable habits
- **Visual Progress Tree**: Watch your habit tree grow as you level up
- **Smart Streak System**: 2-week streak requirement to advance levels
- **Adaptive Difficulty**: Automatically adjusts levels based on performance
  - Complete main task 2 weeks in a row → Level up
  - Miss main task 2 weeks in a row → Level adjusts down to better match your pace
- **User Authentication**: Secure Firebase authentication
- **Real-time Data**: Firestore database for instant progress syncing

## 🎯 How It Works

1. **Sign Up/Login**: Create an account or sign in with email/password
2. **Select Habit**: Choose a habit to work on (Running available in current version)
3. **Take Assessment Quiz**: Complete a short quiz to determine your starting level
4. **View Your Level**: See your personalized starting point and tasks
5. **Weekly Tasks**:
   - Complete 1 main task (required)
   - Complete 3 supporting tasks (optional but recommended)
6. **Progress**:
   - Complete main task 2 weeks → Advance to next level 🎉
   - Miss main task 2 weeks → Adjust to easier level for better success
7. **Reach Level 7**: Complete all levels and celebrate your achievement!

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Navigation**: Screen-based navigation
- **UI Components**: React Native core components
- **Icons**: Expo Vector Icons

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/slmxx/EverGreenfinal.git
cd EverGreenfinal
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase**
   - Create a project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password method)
   - Create a Firestore Database
   - Copy `firebaseConfig.example.js` to `firebaseConfig.js`
   - Add your Firebase credentials to `firebaseConfig.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

4. **Start the development server**

```bash
npx expo start
```

5. **Run on your device**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator (Mac only)

## 📂 Project Structure

```
EverGreenfinal/
├── App.js                      # Main application entry point
├── DashboardScreen.js          # Weekly tasks dashboard
├── SignUpScreen.js             # User registration screen
├── RunningQuizScreen.js        # Assessment quiz for level placement
├── TreeVisualization.js        # Visual progress tree component
├── FinalCongratsScreen.js      # Completion celebration screen
├── firebaseConfig.js           # Firebase configuration (not in repo)
├── firestoreHelpers.js         # Database helper functions
├── levelsData.js               # Level definitions and tasks
├── package.json                # Dependencies
├── README.md                   # This file
└── assets/                     # Images and icons
```

## 🎮 Usage

### First Time Users

1. Sign up with email and password
2. Select "Running" habit
3. Answer 7 quiz questions honestly
4. View your calculated starting level
5. Start completing weekly tasks!

### Returning Users

1. Sign in with your credentials
2. View your current level and tasks
3. Check off completed tasks
4. Click "Complete Week" when main task is done
5. Or click "I didn't complete the main task" if you missed it

## 🔥 Firebase Collections Structure

### User_Habits Collection

```javascript
{
  userId: "user_id",
  habit: "Running",
  currentLevel: 3,
  currentStreak: 1,
  weeksAtCurrentLevel: 2,
  consecutiveMissedWeeks: 0,
  lastCompletedAt: "2025-01-03T10:30:00Z"
}
```

### Weekly_Progress Collection

```javascript
{
  userId: "user_id",
  level: 3,
  weekStart: "2025-01-01",
  mainTaskCompleted: true,
  complementaryTasksCompleted: [true, false, true]
}
```

## 🎯 Level System

- **Level 1**: Foundation level for beginners
- **Level 1.5**: Intermediate support level (appears only if struggling)
- **Level 2-6**: Progressive difficulty increase
- **Level 2.5-6.5**: Support levels (appear when user needs help)
- **Level 7**: Expert level - final achievement!

**Note**: Half levels (1.5, 2.5, etc.) only appear when the system detects a user is struggling, providing a gentler progression path.

## 🚀 Future Enhancements

- [ ] Additional habit categories (Healthy Eating, Reading, Prayer, Studying)
- [ ] Social features and accountability partners
- [ ] Push notifications for reminders
- [ ] Advanced analytics and progress charts
- [ ] Achievement badges and rewards
- [ ] Weekly insights and motivational messages
- [ ] Habit streaks visualization
- [ ] Export progress reports

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Salma** - [slmxx](https://github.com/slmxx)
- **Najoua** - [mehiriznajoua](https://github.com/mehiriznajoua)

## 🙏 Acknowledgments

- Inspired by James Clear's "Atomic Habits"
- Built with React Native and Expo
- Firebase for backend services
- Tree visualization concept for habit growth

## 📧 Contact

For questions or feedback, please open an issue on GitHub or contact the repository owner.

---

**Happy Habit Building! 🌱✨**
