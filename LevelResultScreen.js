import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function LevelResultScreen({ level, onContinue }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Running Level 🌱</Text>
      <Text style={styles.level}>Level {level}</Text>

      <Pressable style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Start My Plan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  level: { fontSize: 40, fontWeight: 'bold', marginBottom: 30 },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
