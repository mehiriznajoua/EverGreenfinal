// Firestore Helper Functions
// Handles all Firestore operations for the EverGreen app

import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';

/* --------------------------------------------------
   USERS COLLECTION
-------------------------------------------------- */

/**
 * Create a user document in Users collection
 * @param {string} userId - Firebase Auth UID
 * @param {string} username - User's username
 * @param {string} email - User's email
 */
export async function createUserDocument(userId, username, email) {
  try {
    await setDoc(doc(db, 'Users', userId), {
      username,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

/**
 * Get user document
 * @param {string} userId - Firebase Auth UID
 */
export async function getUserDocument(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'Users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user document:', error);
    throw error;
  }
}

/* --------------------------------------------------
   USER_HABITS COLLECTION
-------------------------------------------------- */

/**
 * Create a User_Habits document for Running habit
 * @param {string} userId - Firebase Auth UID
 * @param {number} startingLevel - Starting level from quiz
 */
export async function createUserHabitDocument(userId, startingLevel) {
  try {
    const habitDocId = `${userId}_Running`;
    await setDoc(doc(db, 'User_Habits', habitDocId), {
      userID: userId,
      habitID: 'Running',
      currentLevel: startingLevel,
      currentStreak: 0,
      weeksAtCurrentLevel: 0,
      consecutiveMissedWeeks: 0,
      lastCompletedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating user habit document:', error);
    throw error;
  }
}

/**
 * Get User_Habits document
 * @param {string} userId - Firebase Auth UID
 */
export async function getUserHabitDocument(userId) {
  try {
    const habitDocId = `${userId}_Running`;
    const habitDoc = await getDoc(doc(db, 'User_Habits', habitDocId));
    if (habitDoc.exists()) {
      return { id: habitDoc.id, ...habitDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user habit document:', error);
    throw error;
  }
}

/**
 * Update User_Habits document (creates if doesn't exist)
 * @param {string} userId - Firebase Auth UID
 * @param {object} updates - Fields to update
 */
export async function updateUserHabitDocument(userId, updates) {
  try {
    const habitDocId = `${userId}_Running`;
    const habitDocRef = doc(db, 'User_Habits', habitDocId);
    
    // Check if document exists
    const habitDoc = await getDoc(habitDocRef);
    
    if (habitDoc.exists()) {
      // Update existing document
      await updateDoc(habitDocRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new document with default values + updates
      await setDoc(habitDocRef, {
        userID: userId,
        habitID: 'Running',
        currentLevel: updates.currentLevel || 1,
        currentStreak: updates.currentStreak || 0,
        weeksAtCurrentLevel: updates.weeksAtCurrentLevel || 0,
        consecutiveZeroStreakWeeks: updates.consecutiveZeroStreakWeeks || 0,
        lastCompletedAt: updates.lastCompletedAt || null,
        ...updates,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating user habit document:', error);
    throw error;
  }
}

/* --------------------------------------------------
   WEEKLY_PROGRESS COLLECTION
-------------------------------------------------- */

/**
 * Get the start of the current week (Monday)
 */
function getWeekStartDate() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(monday);
}

/**
 * Get or create current week's progress document
 * @param {string} userId - Firebase Auth UID
 * @param {number} levelNumber - Current level
 */
export async function getOrCreateWeeklyProgress(userId, levelNumber) {
  try {
    const weekStart = getWeekStartDate();
    const weekDocId = `${userId}_${weekStart.toMillis()}`;

    const weekDocRef = doc(db, 'Weekly_Progress', weekDocId);
    const weekDoc = await getDoc(weekDocRef);

    if (weekDoc.exists()) {
      return { id: weekDoc.id, ...weekDoc.data() };
    }

    // Create new weekly progress document
    await setDoc(weekDocRef, {
      userID: userId,
      habitID: 'Running',
      levelNumber,
      weekStartDate: weekStart,
      mainTaskCompleted: false,
      complementaryTasksCompleted: [false, false, false],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const newWeekDoc = await getDoc(weekDocRef);
    return { id: newWeekDoc.id, ...newWeekDoc.data() };
  } catch (error) {
    console.error('Error getting/creating weekly progress:', error);
    throw error;
  }
}

/**
 * Update weekly progress document
 * @param {string} weekDocId - Weekly progress document ID
 * @param {object} updates - Fields to update
 */
export async function updateWeeklyProgress(weekDocId, updates) {
  try {
    await updateDoc(doc(db, 'Weekly_Progress', weekDocId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating weekly progress:', error);
    throw error;
  }
}

/**
 * Get all weekly progress documents for a user (for debugging/history)
 * @param {string} userId - Firebase Auth UID
 */
export async function getUserWeeklyProgress(userId) {
  try {
    const q = query(
      collection(db, 'Weekly_Progress'),
      where('userID', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const progress = [];
    querySnapshot.forEach((doc) => {
      progress.push({ id: doc.id, ...doc.data() });
    });
    return progress;
  } catch (error) {
    console.error('Error getting user weekly progress:', error);
    throw error;
  }
}

