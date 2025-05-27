import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';
import TimerDisplay from '@/components/TimerDisplay';
import TimerControls from '@/components/TimerControls';
import DurationPicker from '@/components/DurationPicker';
import SessionCompleteModal from '@/components/SessionCompleteModal';
import DailyTargetModal from '@/components/DailyTargetModal';
import TagSelectorModal from '@/components/TagSelectorModal';
import DailyProgressBar from '@/components/DailyProgressBar';
import useTimerStore from '@/store/timerStore';
import { Platform } from 'react-native';
import { getTodayDateString } from '@/utils/dateUtils';
import { Target, Tag } from 'lucide-react-native';

export default function TimerScreen() {
  const { 
    duration, 
    timeRemaining, 
    isRunning, 
    isPaused,
    dailyTarget,
    dailyProgress,
    currentTag,
    setDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    completeSession
  } = useTimerStore();
  
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Get today's progress
  const today = getTodayDateString();
  const todayProgress = dailyProgress.find(p => p.date === today);
  const todaySeconds = todayProgress ? todayProgress.totalSeconds : 0;

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        useTimerStore.setState(state => {
          const newTimeRemaining = Math.max(0, state.timeRemaining - 1);
          
          // Check if timer has reached zero
          if (newTimeRemaining === 0 && state.timeRemaining > 0) {
            clearInterval(timerRef.current!);
            setShowCompletionModal(true);
            completeSession(true);
            return { timeRemaining: 0, isRunning: false };
          }
          
          return { timeRemaining: newTimeRemaining };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleDurationChange = (newDuration: number) => {
    if (!isRunning && !isPaused) {
      setDuration(newDuration);
    }
  };

  const handleStop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    completeSession(false);
  };

  const handleStartTimer = () => {
    setShowTagModal(true);
  };

  const handleTagSelected = () => {
    setShowTagModal(false);
    startTimer();
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Focus Time</Text>
        <Text style={styles.headerSubtitle}>Stay productive and focused</Text>
      </View>
      
      {/* Daily Target Progress */}
      <View style={styles.targetContainer}>
        <View style={styles.targetHeader}>
          <Text style={styles.targetTitle}>Daily Target</Text>
          <TouchableOpacity 
            style={styles.targetButton}
            onPress={() => setShowTargetModal(true)}
          >
            <Target size={16} color={Colors.light.primary} />
            <Text style={styles.targetButtonText}>Set Target</Text>
          </TouchableOpacity>
        </View>
        <DailyProgressBar 
          currentSeconds={todaySeconds} 
          targetSeconds={dailyTarget} 
        />
      </View>
      
      {!isRunning && !isPaused && (
        <DurationPicker 
          onSelectDuration={handleDurationChange}
          selectedDuration={duration}
        />
      )}
      
      {/* Current subject tag display */}
      {currentTag && (isRunning || isPaused) && (
        <View style={styles.currentTagContainer}>
          <Tag size={16} color={Colors.light.primary} />
          <Text style={styles.currentTagText}>Studying: {currentTag}</Text>
        </View>
      )}
      
      <View style={styles.timerContainer}>
        <TimerDisplay 
          timeRemaining={timeRemaining}
          duration={duration}
        />
      </View>
      
      <TimerControls 
        isRunning={isRunning}
        isPaused={isPaused}
        onStart={handleStartTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onReset={resetTimer}
        onStop={handleStop}
      />
      
      <SessionCompleteModal 
        visible={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        duration={duration}
      />
      
      <DailyTargetModal
        visible={showTargetModal}
        onClose={() => setShowTargetModal(false)}
      />

      <TagSelectorModal
        visible={showTagModal}
        onClose={() => setShowTagModal(false)}
        onTagSelected={handleTagSelected}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.darkGray,
  },
  targetContainer: {
    backgroundColor: Colors.light.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  targetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  targetButtonText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  currentTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
    gap: 6,
  },
  currentTagText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
});