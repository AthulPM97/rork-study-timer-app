import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '@/constants/colors';
import { TagStats } from '@/types/timer';

interface TagStatsChartProps {
  tagStats: TagStats[];
}

export default function TagStatsChart({ tagStats }: TagStatsChartProps) {
  if (tagStats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No subject data yet</Text>
      </View>
    );
  }

  // Find the tag with the most time (for calculating relative bar widths)
  const maxSeconds = Math.max(...tagStats.map(stat => stat.totalSeconds));

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {tagStats.map((stat, index) => (
        <View key={stat.tag} style={styles.statItem}>
          <View style={styles.tagHeader}>
            <Text style={styles.tagName}>{stat.tag}</Text>
            <Text style={styles.sessionCount}>{stat.sessionCount} session{stat.sessionCount !== 1 ? 's' : ''}</Text>
          </View>
          
          <View style={styles.barContainer}>
            <View 
              style={[
                styles.bar, 
                { width: `${(stat.totalSeconds / maxSeconds) * 100}%` },
                index === 0 ? styles.topBar : null
              ]} 
            />
            <Text style={styles.timeLabel}>{formatTime(stat.totalSeconds)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.darkGray,
    textAlign: 'center',
  },
  statItem: {
    marginBottom: 16,
  },
  tagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tagName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  sessionCount: {
    fontSize: 14,
    color: Colors.light.darkGray,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  bar: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
    marginRight: 8,
  },
  topBar: {
    backgroundColor: Colors.light.secondary,
  },
  timeLabel: {
    fontSize: 14,
    color: Colors.light.darkGray,
    fontWeight: '500',
  },
});