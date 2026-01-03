import { View, Text, StyleSheet, Pressable } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function FinalCongratsScreen({ onRestart }) {
  return (
    <View style={styles.container}>
      {/* Confetti */}
      <ConfettiCannon
        count={180}
        origin={{ x: -10, y: 0 }}
        fadeOut
      />

      <Text style={styles.title}>🎉 Congratulations! 🎉</Text>

      <Text style={styles.subtitle}>
        You’ve completed all levels and stayed consistent.
      </Text>

      <Text style={styles.message}>
        This isn’t just about running.
        You proved to yourself that discipline is something you can build.
        One small step at a time. 🌱
      </Text>

      <Text style={styles.quote}>
        “We are what we repeatedly do. Excellence, then, is not an act, but a habit.”
      </Text>

      <Pressable style={styles.button} onPress={onRestart}>
        <Text style={styles.buttonText}>Start a New Journey 🔁</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1FAF4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#388E3C',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#607D8B',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
