import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';

const HABITS = [
  'Running',
  'Reading',
  'Eating healthy',
  'focused studying',
  'reading the quran consistently'
];

export default function HabitSelectionScreen({ onHabitSelected }) {
  const [selectedHabit, setSelectedHabit] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose one habit 🌱</Text>

      {HABITS.map((habit) => (
        <Pressable
          key={habit}
          style={[
            styles.habitButton,
            selectedHabit === habit && styles.selectedHabit
          ]}
          onPress={() => setSelectedHabit(habit)}
        >
          <Text style={styles.habitText}>{habit}</Text>
        </Pressable>
      ))}

      <Pressable
        style={[
          styles.continueButton,
          !selectedHabit && { opacity: 0.5 }
        ]}
        disabled={!selectedHabit}
        onPress={() => onHabitSelected(selectedHabit)}
      >
        <Text style={styles.continueText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  habitButton: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#ccc',
  },
  selectedHabit: {
    backgroundColor: '#4CAF50',
  },
  habitText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
  },
  continueText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
