import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StudySession } from '@/types/timer';
import Colors from '@/constants/colors';
import { CheckCircle, XCircle, Clock, Tag } from 'lucide-react-native';

interface SessionHistoryItemProps {
  session: StudySession;
  isToday?: boolean;
}

export default function SessionHistoryItem({ session, isToday = false }: SessionHistoryItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) {
      return `${mins} min`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins > 0 ? `${remainingMins}m` : ''}`;
    }
  };

  return (
    <View style={[styles.container, isToday && styles.todayContainer]}>
      <View style={styles.iconContainer}>
        {session.completed ? (
          <CheckCircle color={Colors.light.success} size={24} />
        ) : (
          <XCircle color={Colors.light.error} size={24} />
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.dateText}>
          {isToday ? "Today" : formatDate(session.date)}
        </Text>
        <View style={styles.detailsRow}>
          <View style={styles.timeContainer}>
            <Clock size={14} color={Colors.light.darkGray} />
            <Text style={styles.timeText}>{formatTime(session.date)}</Text>
          </View>
          <Text style={styles.durationText}>{formatDuration(session.duration)}</Text>
        </View>
        {session.tag && (
          <View style={styles.tagContainer}>
            <Tag size={14} color={Colors.light.primary} />
            <Text style={styles.tagText}>{session.tag}</Text>
          </View>
        )}
      </View>
      <View style={styles.statusContainer}>
        <Text style={[
          styles.statusText,
          session.completed ? styles.completedText : styles.incompleteText
        ]}>
          {session.completed ? 'Completed' : 'Stopped'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.light.lightGray,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  todayContainer: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  timeText: {
    fontSize: 14,
    color: Colors.light.darkGray,
    marginLeft: 4,
  },
  durationText: {
    fontSize: 14,
    color: Colors.light.darkGray,
    fontWeight: '500',
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  completedText: {
    color: Colors.light.success,
  },
  incompleteText: {
    color: Colors.light.error,
  },
});