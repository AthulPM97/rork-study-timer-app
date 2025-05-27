import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import Colors from '@/constants/colors';

interface TimerDisplayProps {
  timeRemaining: number;
  duration: number;
}

export default function TimerDisplay({ timeRemaining, duration }: TimerDisplayProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress for the circle
  const progress = 1 - (timeRemaining / duration);
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <Svg width={280} height={280} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx="140"
          cy="140"
          r={radius}
          stroke={Colors.light.gray}
          strokeWidth="12"
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx="140"
          cy="140"
          r={radius}
          stroke={Colors.light.primary}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform="rotate(-90, 140, 140)"
        />
      </Svg>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(timeRemaining)}</Text>
        <Text style={styles.labelText}>
          {timeRemaining === 0 ? "Time's up!" : "remaining"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 56,
    fontWeight: '300',
    color: Colors.light.text,
  },
  labelText: {
    fontSize: 16,
    color: Colors.light.darkGray,
    marginTop: 8,
  },
});