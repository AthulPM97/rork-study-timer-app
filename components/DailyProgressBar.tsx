import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface DailyProgressBarProps {
  currentSeconds: number;
  targetSeconds: number;
}

export default function DailyProgressBar({ currentSeconds, targetSeconds }: DailyProgressBarProps) {
  // Calculate progress percentage (capped at 100%)
  const progressPercentage = Math.min(100, (currentSeconds / targetSeconds) * 100);
  
  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    const remainingSeconds = Math.max(0, targetSeconds - seconds);
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    
    if (hours === 0 && minutes === 0) {
      return "Target reached!";
    }
    
    return `${hours}h ${minutes}m remaining`;
  };

  // Format current progress
  const formatProgress = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.progressLabel}>
          {formatProgress(currentSeconds)} of {formatProgress(targetSeconds)}
        </Text>
        <Text style={styles.remainingLabel}>
          {formatTimeRemaining(currentSeconds)}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${progressPercentage}%` },
            progressPercentage >= 100 ? styles.completedBar : null
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  remainingLabel: {
    fontSize: 14,
    color: Colors.light.darkGray,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: Colors.light.lightGray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 5,
  },
  completedBar: {
    backgroundColor: Colors.light.success,
  },
});