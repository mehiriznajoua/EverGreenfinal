import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

export default function RunningQuizScreen({ onBack, onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState(null);

  const questions = [
    {
      id: 0,
      text: 'Can you currently run for 5 minutes, twice a week?',
      yesNext: 1,
      noLevel: 1
    },
    {
      id: 1,
      text: 'Can you currently run for 10 minutes, twice a week?',
      yesNext: 2,
      noLevel: 2
    },
    {
      id: 2,
      text: 'Can you currently run for 15 minutes, twice a week?',
      yesNext: 3,
      noLevel: 3
    },
    {
      id: 3,
      text: 'Can you currently run for 20 minutes, twice a week?',
      yesNext: 4,
      noLevel: 4
    },
    {
      id: 4,
      text: 'Can you currently run for 30 minutes, three times a week?',
      yesNext: 5,
      noLevel: 5
    },
    {
      id: 5,
      text: 'Can you currently run for 40 minutes, three times a week?',
      yesNext: 6,
      noLevel: 6
    },
    {
      id: 6,
      text: 'Can you currently run for 45 minutes, three times a week?',
      yesLevel: 7,
      noLevel: 6.5
    }
  ];

  const handleAnswer = (isYes) => {
    setAnswer(isYes);
  };

  const handleContinue = () => {
    const question = questions[currentQuestion];

    if (answer === false) {
      onQuizComplete(question.noLevel);
    } else if (answer === true) {
      if (question.yesNext !== undefined) {
        setCurrentQuestion(question.yesNext);
        setAnswer(null);
      } else {
        onQuizComplete(question.yesLevel);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Running Assessment 🏃</Text>
        <Text style={styles.subtitle}>Let's find your perfect starting level</Text>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            {questions[currentQuestion].text}
          </Text>
        </View>

        <View style={styles.answersContainer}>
          <Pressable
            style={[
              styles.answerButton,
              answer === true && styles.answerButtonSelected
            ]}
            onPress={() => handleAnswer(true)}
          >
            <Text
              style={[
                styles.answerText,
                answer === true && styles.answerTextSelected
              ]}
            >
              Yes, I can
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.answerButton,
              answer === false && styles.answerButtonSelected
            ]}
            onPress={() => handleAnswer(false)}
          >
            <Text
              style={[
                styles.answerText,
                answer === false && styles.answerTextSelected
              ]}
            >
              Not quite yet
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={[
            styles.continueButton,
            answer === null && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={answer === null}
        >
          <Text
            style={[
              styles.continueText,
              answer === null && styles.continueTextDisabled
            ]}
          >
            Next
          </Text>
        </Pressable>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f4',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backText: {
    color: '#4CAF50',
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 30,
  },
  progressContainer: {
    marginBottom: 28,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E1E8ED',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    lineHeight: 28,
  },
  answersContainer: {
    marginBottom: 24,
  },
  answerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E1E8ED',
  },
  answerButtonSelected: {
    backgroundColor: '#EAF7EA',
    borderColor: '#4CAF50',
  },
  answerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  answerTextSelected: {
    color: '#2E7D32',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  continueTextDisabled: {
    color: '#ECF0F1',
  },
  spacer: {
    height: 40,
  },
});
