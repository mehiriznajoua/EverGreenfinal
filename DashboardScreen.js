import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { levelsData } from './levelsData';
import TreeVisualization from './TreeVisualization';
import {
  getUserHabitDocument,
  updateUserHabitDocument,
  getOrCreateWeeklyProgress,
  updateWeeklyProgress
} from './firestoreHelpers';

export default function DashboardScreen({ userId, habit, level, onBack, onLogout, onFinishAllLevels }) {
  // STATE
  const [currentLevel, setCurrentLevel] = useState(level);
  const [streak, setStreak] = useState(0);
  const [mainTaskCompleted, setMainTaskCompleted] = useState(false);
  const [complementaryTasksCompleted, setComplementaryTasksCompleted] = useState([false, false, false]);
  const [weeksAtCurrentLevel, setWeeksAtCurrentLevel] = useState(0);
  const [consecutiveMissedWeeks, setConsecutiveMissedWeeks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weekDocId, setWeekDocId] = useState(null);

  const levelInfo = levelsData[currentLevel];

  // Load user data and weekly progress on mount
  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  // Reload when level changes AND reset task checkboxes
  useEffect(() => {
    if (userId && currentLevel) {
      // Reset all task checkboxes when level changes
      setMainTaskCompleted(false);
      setComplementaryTasksCompleted([false, false, false]);
      loadWeeklyProgress();
    }
  }, [currentLevel, userId]);

  const loadDashboardData = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Load User_Habits data
      const habitData = await getUserHabitDocument(userId);
      if (habitData) {
        setCurrentLevel(habitData.currentLevel || level);
        setStreak(habitData.currentStreak || 0);
        setWeeksAtCurrentLevel(habitData.weeksAtCurrentLevel || 0);
        setConsecutiveMissedWeeks(habitData.consecutiveMissedWeeks || 0);
      }

      // Load weekly progress
      await loadWeeklyProgress();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load your progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadWeeklyProgress = async () => {
    if (!userId || !currentLevel) return;

    try {
      const weeklyProgress = await getOrCreateWeeklyProgress(userId, currentLevel);
      setWeekDocId(weeklyProgress.id);
      // Always reset checkboxes when loading progress (ensures clean state)
      setMainTaskCompleted(weeklyProgress.mainTaskCompleted || false);
      setComplementaryTasksCompleted(weeklyProgress.complementaryTasksCompleted || [false, false, false]);
    } catch (error) {
      console.error('Error loading weekly progress:', error);
    }
  };

  // Toggle main task completion
  const toggleMainTask = async () => {
    const newValue = !mainTaskCompleted;
    setMainTaskCompleted(newValue);
    
    if (weekDocId) {
      try {
        await updateWeeklyProgress(weekDocId, {
          mainTaskCompleted: newValue
        });
      } catch (error) {
        console.error('Error updating main task:', error);
        setMainTaskCompleted(!newValue); // Revert on error
      }
    }
  };

  // Toggle complementary task completion
  const toggleComplementaryTask = async (index) => {
    const newComplementary = [...complementaryTasksCompleted];
    newComplementary[index] = !newComplementary[index];
    setComplementaryTasksCompleted(newComplementary);

    if (weekDocId) {
      try {
        await updateWeeklyProgress(weekDocId, {
          complementaryTasksCompleted: newComplementary
        });
      } catch (error) {
        console.error('Error updating complementary task:', error);
        setComplementaryTasksCompleted(complementaryTasksCompleted); // Revert on error
      }
    }
  };

  // Complete week logic
  const completeWeek = async () => {
    if (!mainTaskCompleted) {
      Alert.alert('Incomplete', 'You must complete the main task to finish the week.');
      return;
    }

    setSaving(true);
    try {
      // ✅ Normal progression: Main task completed → streak + 1 (max 2 per level)
      const newStreak = Math.min(streak + 1, 2);
      const newWeeksAtCurrentLevel = weeksAtCurrentLevel + 1;
      
      setStreak(newStreak);
      setWeeksAtCurrentLevel(newWeeksAtCurrentLevel);
      setConsecutiveMissedWeeks(0); // Reset missed weeks counter on success

      // Update User_Habits
      let updatedLevel = currentLevel;
      let updatedWeeksAtCurrentLevel = newWeeksAtCurrentLevel;
      let updatedStreak = newStreak;

      // ✅ Case A: Level successfully completed (streak === 2)
      // level i → level i+1 (always whole numbers, never half levels)
      if (newStreak === 2) {
        // Calculate next level: floor(currentLevel) + 1
        // This ensures we always go to whole numbers (1, 2, 3, 4...)
        const nextLevel = Math.floor(currentLevel) + 1;
        
        // Check if this level exists in levelsData
        if (levelsData[nextLevel]) {
          updatedLevel = nextLevel;
          updatedStreak = 0; // Reset streak after level up
          updatedWeeksAtCurrentLevel = 0; // Reset weeks at new level
          setStreak(0);
          setWeeksAtCurrentLevel(0);
        } else {
          // If next level doesn't exist, we're at max level - completed all levels!
          console.log('Completed all levels!');
          Alert.alert('Congratulations! 🎉', 'You have completed all levels!', [
            {
              text: 'OK',
              onPress: () => {
                if (onFinishAllLevels) {
                  onFinishAllLevels();
                }
              }
            }
          ]);
          // Don't continue execution after max level
          setSaving(false);
          return;
        }
      }
      
      await updateUserHabitDocument(userId, {
        currentLevel: updatedLevel,
        currentStreak: updatedStreak,
        weeksAtCurrentLevel: updatedWeeksAtCurrentLevel,
        consecutiveMissedWeeks: 0,
        lastCompletedAt: new Date().toISOString()
      });

      // Reset tasks IMMEDIATELY in state
      setMainTaskCompleted(false);
      setComplementaryTasksCompleted([false, false, false]);

      // Update weekly progress document to reset tasks
      if (weekDocId) {
        await updateWeeklyProgress(weekDocId, {
          mainTaskCompleted: false,
          complementaryTasksCompleted: [false, false, false]
        });
      }

      if (updatedLevel !== currentLevel) {
        setCurrentLevel(updatedLevel);
        Alert.alert('Level Up! 🎉', `Congratulations! You've reached Level ${updatedLevel}!`);
      } else {
        // Create new weekly progress for the new week
        await loadWeeklyProgress();
        Alert.alert('Week Complete!', 'Great job! Your progress has been saved.');
      }
    } catch (error) {
      console.error('Error completing week:', error);
      Alert.alert('Error', 'Failed to save progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle week incomplete (main task not done)
  const handleWeekIncomplete = async () => {
    setSaving(true);
    try {
      // ❌ Main task NOT completed → streak resets to 0
      const newStreak = 0;
      const newWeeksAtCurrentLevel = weeksAtCurrentLevel + 1;
      const newConsecutiveMissedWeeks = consecutiveMissedWeeks + 1;
      
      setStreak(newStreak);
      setWeeksAtCurrentLevel(newWeeksAtCurrentLevel);
      setConsecutiveMissedWeeks(newConsecutiveMissedWeeks);

      // Update User_Habits
      let updatedLevel = currentLevel;
      let updatedWeeksAtCurrentLevel = newWeeksAtCurrentLevel;
      let updatedStreak = newStreak;
      let updatedConsecutiveMissedWeeks = newConsecutiveMissedWeeks;

      // ❌ Case B: Struggling detection
      // User is struggling if: streak resets to 0 two times (two missed weeks)
      // OR streak stays at 0 for two consecutive weeks
      // When struggling: level i → level i - 0.5 (half levels only for struggling)
      if (newConsecutiveMissedWeeks >= 2 && currentLevel > 1) {
        // Calculate downgraded level: max(currentLevel - 0.5, 1)
        // Half levels (1.5, 2.5, 3.5...) only appear when struggling
        let downgradedLevel = Math.max(currentLevel - 0.5, 1);
        
        // Ensure we don't go below level 1
        if (downgradedLevel < 1) {
          downgradedLevel = 1;
        }
        
        // Check if the intermediate level exists in levelsData
        if (levelsData[downgradedLevel]) {
          updatedLevel = downgradedLevel;
          updatedStreak = 0; // Reset streak after level down
          updatedWeeksAtCurrentLevel = 0; // Reset weeks at new level
          updatedConsecutiveMissedWeeks = 0; // Reset missed weeks counter
          setStreak(0);
          setWeeksAtCurrentLevel(0);
          setConsecutiveMissedWeeks(0);
          setCurrentLevel(downgradedLevel);
        } else {
          // If intermediate level doesn't exist, try the previous whole number
          const prevWholeLevel = Math.floor(currentLevel) - 1;
          if (prevWholeLevel >= 1 && levelsData[prevWholeLevel]) {
            updatedLevel = prevWholeLevel;
            updatedStreak = 0;
            updatedWeeksAtCurrentLevel = 0;
            updatedConsecutiveMissedWeeks = 0;
            setStreak(0);
            setWeeksAtCurrentLevel(0);
            setConsecutiveMissedWeeks(0);
            setCurrentLevel(prevWholeLevel);
          }
        }
      }

      // Reset tasks IMMEDIATELY in state
      setMainTaskCompleted(false);
      setComplementaryTasksCompleted([false, false, false]);

      // Update weekly progress document to reset tasks
      if (weekDocId) {
        await updateWeeklyProgress(weekDocId, {
          mainTaskCompleted: false,
          complementaryTasksCompleted: [false, false, false]
        });
      }

      await updateUserHabitDocument(userId, {
        currentLevel: updatedLevel,
        currentStreak: updatedStreak,
        weeksAtCurrentLevel: updatedWeeksAtCurrentLevel,
        consecutiveMissedWeeks: updatedConsecutiveMissedWeeks
      });

      if (updatedLevel !== currentLevel) {
        Alert.alert('Level Adjusted', `Your level has been adjusted to ${updatedLevel} to better match your current progress.`);
      } else {
        // Create new weekly progress for the new week
        await loadWeeklyProgress();
        Alert.alert('Week Reset', 'Your week has been reset. Keep trying!');
      }
    } catch (error) {
      console.error('Error handling incomplete week:', error);
      Alert.alert('Error', 'Failed to save progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        {onLogout && (
          <Pressable onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.title}>Your Weekly Tasks 📋</Text>
      <Text style={styles.subtitle}>{habit} • Level {currentLevel}</Text>

      {/* Tree Visualization */}
      <TreeVisualization currentLevel={currentLevel} />

      {/* Streak Card */}
      <View style={styles.streakCard}>
        <Text style={styles.streakLabel}>Current Streak (Max: 2)</Text>
        <Text style={styles.streakValue}>{streak} / 2</Text>
        <Text style={styles.streakSubtext}>
          {streak === 2 ? 'Ready to level up! 🚀' : streak === 1 ? 'One more week! 💪' : 'Start your streak!'}
        </Text>
        <Text style={styles.weeksText}>Weeks at this level: {weeksAtCurrentLevel}</Text>
      </View>

      {/* Main Task */}
      <Text style={styles.sectionTitle}>Main Task</Text>
      <Pressable style={styles.mainTaskCard} onPress={toggleMainTask}>
        <View
          style={[
            styles.checkbox,
            styles.checkboxLarge,
            mainTaskCompleted && styles.checkboxChecked
          ]}
        >
          {mainTaskCompleted && <Text style={styles.check}>✓</Text>}
        </View>
        <Text style={styles.mainTaskText}>{levelInfo.main}</Text>
      </Pressable>

      {/* Complementary Tasks */}
      <Text style={styles.sectionTitle}>Supporting Tasks</Text>
      {levelInfo.complementary.map((task, index) => (
        <Pressable
          key={index}
          style={styles.taskCard}
          onPress={() => toggleComplementaryTask(index)}
        >
          <View
            style={[
              styles.checkbox,
              complementaryTasksCompleted[index] && styles.checkboxChecked
            ]}
          >
            {complementaryTasksCompleted[index] && (
              <Text style={styles.check}>✓</Text>
            )}
          </View>
          <Text style={styles.taskText}>{task}</Text>
        </Pressable>
      ))}

      {/* Complete Week Button */}
      <Pressable
        style={[styles.completeButton, saving && styles.buttonDisabled]}
        onPress={completeWeek}
        disabled={saving || !mainTaskCompleted}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.completeButtonText}>Complete Week</Text>
        )}
      </Pressable>

      {/* Week Incomplete Button */}
      <Pressable
        style={[styles.incompleteButton, saving && styles.buttonDisabled]}
        onPress={handleWeekIncomplete}
        disabled={saving}
      >
        <Text style={styles.incompleteButtonText}>
          I didn't complete the main task this week
        </Text>
      </Pressable>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f7f4'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7f4'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7F8C8D'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  backText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600'
  },
  logoutText: {
    color: '#E65100',
    fontSize: 16,
    fontWeight: '600'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2C3E50'
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20
  },
  streakCard: {
    backgroundColor: '#EAF7EA',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center'
  },
  streakLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 8
  },
  streakValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4
  },
  streakSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4
  },
  weeksText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontStyle: 'italic'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12
  },
  mainTaskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    marginBottom: 24
  },
  mainTaskText: {
    flex: 1,
    fontSize: 18,
    color: '#2E7D32',
    fontWeight: '700',
    lineHeight: 28,
    marginLeft: 16
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  checkboxLarge: {
    width: 32,
    height: 32
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50'
  },
  check: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
    lineHeight: 22,
    fontWeight: '500',
    marginLeft: 12
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 50
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  incompleteButton: {
    marginTop: 12,
    padding: 12,
    alignItems: 'center'
  },
  incompleteButtonText: {
    color: '#E65100',
    fontSize: 14,
    fontWeight: '600'
  },
  buttonDisabled: {
    opacity: 0.6
  },
  footer: {
    height: 40
  }
});