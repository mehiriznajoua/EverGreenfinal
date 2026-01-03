import { StatusBar } from 'expo-status-bar';
import FinalCongratsScreen from './FinalCongratsScreen';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { getUserHabitDocument, updateUserHabitDocument } from './firestoreHelpers';
import SignUpScreen from './SignUpScreen';
import RunningQuizScreen from './RunningQuizScreen';
import { levelsData } from './levelsData';
import DashboardScreen from './DashboardScreen';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [level, setLevel] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signInLoading, setSignInLoading] = useState(false);
  

  // Check auth state on app start
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // User is signed in - ALWAYS go to habit selection first
        // Flow must be: Login → Habit Selection → Quiz → Result → Dashboard
        setScreen('habit');
      } else {
        setScreen('login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSignIn = async () => {
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setSignInLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set current user - navigation flow is always: Login → Habit Selection → Quiz → Result → Dashboard
      setCurrentUser(user);
      setScreen('habit'); // Always go to habit selection after sign in (strict flow requirement)
      // Auth state listener will also run, but we've already navigated
    } catch (error) {
      console.error('Sign in error:', error);
      console.error('Sign in error code:', error.code);
      console.error('Sign in error message:', error.message);

      // Show more specific message to help debugging
      if (error.code === 'auth/invalid-email') {
        alert('Invalid email address.');
      } else if (error.code === 'auth/user-not-found') {
        alert('No account found for this email. Please sign up.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password.');
      } else if (error.code === 'auth/too-many-requests') {
        alert('Too many attempts. Try again later.');
      } else {
        alert(`Failed to sign in: ${error.message || 'Please try again.'}`);
      }
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = () => setScreen('signup');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setEmail('');
      setPassword('');
      setSelectedHabit(null);
      setLevel(null);
      setScreen('login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to sign out');
    }
  };

  const handleQuizComplete = async (computedLevel) => {
    setLevel(computedLevel);
    
    // Update User_Habits with the new level from quiz
    if (currentUser) {
      try {
        await updateUserHabitDocument(currentUser.uid, {
          currentLevel: computedLevel,
          weeksAtCurrentLevel: 0 // Reset weeks at level when quiz is taken
        });
      } catch (error) {
        console.error('Error updating user habit after quiz:', error);
      }
    }
    
    setScreen('result');
  };

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (screen === 'signup') {
    return <SignUpScreen onSignUpComplete={() => setScreen('login')} />;
  }

  if (screen === 'habit') {
    return (
      <HabitSelectionScreen
        selectedHabit={selectedHabit}
        onSelectHabit={(habit) => setSelectedHabit(habit)}
        onContinue={() => {
          if (!selectedHabit) {
            alert('Please select ONE habit to continue');
            return;
          }
          if (selectedHabit !== 'Running') {
            alert('For this prototype, only Running is implemented');
            return;
          }
          setScreen('quiz');
        }}
        onLogout={handleLogout}
      />
    );
  }

  if (screen === 'quiz') {
    return (
      <RunningQuizScreen
        onBack={() => setScreen('habit')}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  if (screen === 'result') {
    return (
      <LevelResultScreen
        habit={selectedHabit}
        level={level}
        onGoToDashboard={() => {
          setScreen('dashboard');
        }}
        onRetakeQuiz={() => {
          setLevel(null);
          setScreen('quiz');
        }}
        onBack={() => setScreen('habit')}
      />
    );
  }

  if (screen === 'dashboard') {
  return (
    <DashboardScreen
      userId={currentUser.uid}
      habit={selectedHabit}
      level={level}
      onBack={() => setScreen('habit')}
      onLogout={handleLogout}
      onFinishAllLevels={() => setScreen('finalCongrats')}
    />
  );
  }
  if (screen === 'finalCongrats') {
  return (
    <FinalCongratsScreen
      habit={selectedHabit}
      onRestart={() => {
        setSelectedHabit(null);
        setLevel(null);
        setScreen('habit');
      }}
    />
  );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to EverGreen 🌱</Text>
      <Text style={styles.subtitle}>
        Grow your habits, one small step at a time
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#999"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
        />

        <Pressable onPress={() => setShowPassword((prev) => !prev)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#4CAF50"
          />
        </Pressable>
      </View>

      <Pressable
        style={[styles.button, signInLoading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={signInLoading}
      >
        {signInLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </Pressable>

      <Pressable onPress={handleSignUp}>
        <Text style={styles.secondaryButtonText}>
          Don't have an account? Sign Up
        </Text>
      </Pressable>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

function HabitSelectionScreen({
  selectedHabit,
  onSelectHabit,
  onContinue,
  onLogout
}) {
  const habits = [
    'Running',
    'Eating Healthy',
    'Studying (No Scrolling)',
    'Praying 5 Times',
    'Reading'
  ];

  return (
    <View style={hs.container}>
      <View style={hs.header}>
        <Pressable onPress={onLogout}>
          <Text style={hs.backText}>← Log out</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={hs.scrollContent}>
        <Text style={hs.title}>Choose your habit 🌿</Text>
        <Text style={hs.subtitle}>
          For this prototype, Running is available
        </Text>

        <View style={hs.listContainer}>
          {habits.map((item) => {
            const isSelected = selectedHabit === item;
            return (
              <Pressable
                key={item}
                onPress={() => onSelectHabit(item)}
                style={[hs.card, isSelected && hs.cardSelected]}
              >
                <Text style={[hs.cardText, isSelected && hs.cardTextSelected]}>
                  {item}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable style={hs.button} onPress={onContinue}>
          <Text style={hs.buttonText}>Continue</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function LevelResultScreen({
  habit,
  level,
  onGoToDashboard,
  onRetakeQuiz,
  onBack
}) {
  const levelInfo = levelsData[level];

  return (
    <ScrollView contentContainerStyle={rs.container}>
      <Pressable onPress={onBack} style={rs.backButton}>
        <Text style={rs.backText}>← Back</Text>
      </Pressable>

      <Text style={rs.title}>You're all set! 🎯</Text>
      <Text style={rs.subtitle}>Your {habit} starting level</Text>

      <View style={rs.card}>
        <Text style={rs.levelText}>Level {level}</Text>
        <Text style={rs.levelLabel}>{levelInfo.label}</Text>
      </View>

      <View style={rs.infoCard}>
        <Text style={rs.infoTitle}>Your main task this week:</Text>
        <Text style={rs.mainTask}>{levelInfo.main}</Text>
      </View>

      <Pressable style={rs.button} onPress={onGoToDashboard}>
        <Text style={rs.buttonText}>Start Your Journey</Text>
      </Pressable>

      <Pressable onPress={onRetakeQuiz}>
        <Text style={rs.secondaryButtonText}>Retake Assessment</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2C3E50'
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    marginBottom: 15
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  secondaryButtonText: {
    marginTop: 15,
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center'
  }
});

const hs = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f4'
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8
  },
  backText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500'
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20
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
    marginBottom: 24
  },
  listContainer: {
    marginBottom: 24
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  cardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#EAF7EA'
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  cardTextSelected: {
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

const rs = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f7f4'
  },
  backButton: {
    marginBottom: 16
  },
  backText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500'
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
    marginBottom: 28
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    marginBottom: 24,
    alignItems: 'center'
  },
  levelText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32'
  },
  levelLabel: {
    fontSize: 18,
    color: '#7F8C8D',
    marginTop: 8,
    fontWeight: '600'
  },
  infoCard: {
    backgroundColor: '#EAF7EA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50'
  },
  infoTitle: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 8
  },
  mainTask: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
    lineHeight: 24
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8
  }
});
