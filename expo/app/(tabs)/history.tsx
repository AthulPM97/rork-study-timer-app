import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';
import SessionHistoryItem from '@/components/SessionHistoryItem';
import DailyProgressBar from '@/components/DailyProgressBar';
import TagStatsChart from '@/components/TagStatsChart';
import useTimerStore from '@/store/timerStore';
import { Clock, Calendar, Target, Tag, BarChart } from 'lucide-react-native';
import { getTodayDateString, formatDisplayDate, isToday } from '@/utils/dateUtils';
import DailyTargetModal from '@/components/DailyTargetModal';

export default function HistoryScreen() {
  const { sessions, dailyTarget, dailyProgress, getTagStats } = useTimerStore();
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'sessions' | 'subjects'>('sessions');
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get tag statistics
  const tagStats = getTagStats();

  // Calculate total study time
  const totalStudyTime = sessions.reduce((total, session) => total + session.duration, 0);
  
  // Get today's progress
  const today = getTodayDateString();
  const todayProgress = dailyProgress.find(p => p.date === today);
  const todaySeconds = todayProgress ? todayProgress.totalSeconds : 0;
  
  // Format total study time
  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) {
      return `${mins} minutes`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMins > 0 ? `${remainingMins} minute${remainingMins !== 1 ? 's' : ''}` : ''}`;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.todayContainer}>
        <View style={styles.todayHeader}>
          <View style={styles.todayTitleContainer}>
            <Calendar size={18} color={Colors.light.primary} />
            <Text style={styles.todayTitle}>{formatDisplayDate(today)}</Text>
          </View>
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
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Study Time</Text>
          <View style={styles.statValueContainer}>
            <Clock size={20} color={Colors.light.primary} />
            <Text style={styles.statValue}>{formatTotalTime(totalStudyTime)}</Text>
          </View>
        </View>
        
        <View style={styles.statRow}>
          <View style={[styles.statCard, styles.smallStatCard]}>
            <Text style={styles.statTitle}>Sessions</Text>
            <Text style={styles.statValue}>{sessions.length}</Text>
          </View>
          
          <View style={[styles.statCard, styles.smallStatCard]}>
            <Text style={styles.statTitle}>Subjects</Text>
            <Text style={[styles.statValue, { color: Colors.light.primary }]}>
              {tagStats.length}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Tab selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'sessions' && styles.activeTabButton]} 
          onPress={() => setActiveTab('sessions')}
        >
          <Clock size={18} color={activeTab === 'sessions' ? Colors.light.primary : Colors.light.darkGray} />
          <Text style={[styles.tabText, activeTab === 'sessions' && styles.activeTabText]}>Sessions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'subjects' && styles.activeTabButton]} 
          onPress={() => setActiveTab('subjects')}
        >
          <Tag size={18} color={activeTab === 'subjects' ? Colors.light.primary : Colors.light.darkGray} />
          <Text style={[styles.tabText, activeTab === 'subjects' && styles.activeTabText]}>Subjects</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'sessions' ? (
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Session History</Text>
          
          {sortedSessions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No study sessions yet</Text>
              <Text style={styles.emptySubtext}>
                Complete your first study session to see it here
              </Text>
            </View>
          ) : (
            <FlatList
              data={sortedSessions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SessionHistoryItem 
                  session={item} 
                  isToday={isToday(item.date.split('T')[0])}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      ) : (
        <View style={styles.historyContainer}>
          <View style={styles.subjectHeaderContainer}>
            <Text style={styles.sectionTitle}>Subject Breakdown</Text>
            <BarChart size={20} color={Colors.light.darkGray} />
          </View>
          
          <TagStatsChart tagStats={tagStats} />
        </View>
      )}
      
      <DailyTargetModal
        visible={showTargetModal}
        onClose={() => setShowTargetModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  todayContainer: {
    backgroundColor: Colors.light.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  todayTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  todayTitle: {
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
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.light.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  smallStatCard: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.light.darkGray,
    marginBottom: 8,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.lightGray,
    borderRadius: 12,
    marginBottom: 20,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: Colors.light.background,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.darkGray,
  },
  activeTabText: {
    color: Colors.light.text,
  },
  historyContainer: {
    flex: 1,
  },
  subjectHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.light.text,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.darkGray,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.darkGray,
    textAlign: 'center',
  },
});