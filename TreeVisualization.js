// Tree Growth Visualization Component
// Visual tree representation based on current level

import { View, Text, StyleSheet } from 'react-native';

export default function TreeVisualization({ currentLevel }) {
  // Map level to tree emoji/stage
  // Tree grows with level, but doesn't shrink visually (only level number changes)
  const getTreeEmoji = (level) => {
    if (level >= 7) return '🌳'; // Mature tree
    if (level >= 6) return '🌲'; // Large tree
    if (level >= 5) return '🌴'; // Palm-like
    if (level >= 4) return '🌿'; // Medium growth
    if (level >= 3) return '🍃'; // Small tree
    if (level >= 2) return '🌱'; // Sprout
    return '🌰'; // Seed
  };

  const treeEmoji = getTreeEmoji(currentLevel);

  return (
    <View style={styles.container}>
      <Text style={styles.treeEmoji}>{treeEmoji}</Text>
      <Text style={styles.label}>Your Tree</Text>
      <Text style={styles.levelText}>Level {currentLevel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#EAF7EA',
    borderRadius: 16,
    marginBottom: 20
  },
  treeEmoji: {
    fontSize: 64,
    marginBottom: 8
  },
  label: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 4
  },
  levelText: {
    fontSize: 18,
    color: '#2E7D32',
    fontWeight: 'bold'
  }
});

