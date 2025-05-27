import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerState, StudySession, DailyProgress, TagStats } from '@/types/timer';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Platform } from 'react-native';

const MAX_DURATION = 7200; // 2 hours in seconds
const MIN_DAILY_TARGET = 4 * 60 * 60; // 4 hours in seconds
const MAX_DAILY_TARGET = 9 * 60 * 60; // 9 hours in seconds
const MAX_RECENT_TAGS = 5; // Maximum number of recent tags to store
const BACKGROUND_TIMER_TASK = 'BACKGROUND_TIMER_TASK';

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Define the background task
if (Platform.OS !== 'web') {
  TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
    try {
      const store = useTimerStore.getState();
      
      if (store.isRunning && !store.isPaused) {
        const newTimeRemaining = Math.max(0, store.timeRemaining - 1);
        
        // Check if timer has reached zero
        if (newTimeRemaining === 0 && store.timeRemaining > 0) {
          // Timer completed in background
          store.completeSession(true);
          return BackgroundFetch.BackgroundFetchResult.NewData;
        }
        
        useTimerStore.setState({ timeRemaining: newTimeRemaining });
        return BackgroundFetch.BackgroundFetchResult.NewData;
      }
      
      return BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (error) {
      console.error("Background task error:", error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
}

// Register the background task
export const registerBackgroundTask = async () => {
  if (Platform.OS === 'web') return;
  
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TIMER_TASK, {
      minimumInterval: 1, // 1 second
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Background task registered');
  } catch (err) {
    console.error('Background task registration failed:', err);
  }
};

// Unregister the background task
export const unregisterBackgroundTask = async () => {
  if (Platform.OS === 'web') return;
  
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TIMER_TASK);
    console.log('Background task unregistered');
  } catch (err) {
    console.error('Background task unregistration failed:', err);
  }
};

const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      duration: 1500, // Default 25 minutes
      timeRemaining: 1500,
      isRunning: false,
      isPaused: false,
      sessions: [],
      dailyTarget: 4 * 60 * 60, // Default 4 hours
      dailyProgress: [],
      currentTag: '',
      recentTags: [],
      isBackgroundMode: false,
      lastUpdatedTime: Date.now(),

      setDuration: (duration) => {
        const validDuration = Math.min(duration, MAX_DURATION);
        set({ 
          duration: validDuration,
          timeRemaining: validDuration
        });
      },

      startTimer: async () => {
        // Register background task when timer starts
        if (Platform.OS !== 'web') {
          await registerBackgroundTask();
        }
        
        set({ 
          isRunning: true,
          isPaused: false,
          lastUpdatedTime: Date.now()
        });
      },

      pauseTimer: async () => {
        // Unregister background task when timer pauses
        if (Platform.OS !== 'web') {
          await unregisterBackgroundTask();
        }
        
        set({ 
          isRunning: false,
          isPaused: true
        });
      },

      resumeTimer: async () => {
        // Re-register background task when timer resumes
        if (Platform.OS !== 'web') {
          await registerBackgroundTask();
        }
        
        set({ 
          isRunning: true,
          isPaused: false,
          lastUpdatedTime: Date.now()
        });
      },

      resetTimer: async () => {
        // Unregister background task when timer resets
        if (Platform.OS !== 'web') {
          await unregisterBackgroundTask();
        }
        
        set({ 
          timeRemaining: get().duration,
          isRunning: false,
          isPaused: false,
          isBackgroundMode: false
        });
      },

      completeSession: async (completed) => {
        // Unregister background task when session completes
        if (Platform.OS !== 'web') {
          await unregisterBackgroundTask();
        }
        
        const sessionDuration = get().duration - get().timeRemaining;
        const currentTag = get().currentTag || 'Untagged';
        
        const newSession: StudySession = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          duration: sessionDuration,
          completed,
          tag: currentTag,
        };

        // Update daily progress
        const today = getTodayDateString();
        const currentProgress = get().dailyProgress;
        const todayProgressIndex = currentProgress.findIndex(p => p.date === today);
        
        let updatedProgress = [...currentProgress];
        
        if (todayProgressIndex >= 0) {
          // Update existing progress for today
          updatedProgress[todayProgressIndex] = {
            ...updatedProgress[todayProgressIndex],
            totalSeconds: updatedProgress[todayProgressIndex].totalSeconds + sessionDuration
          };
        } else {
          // Add new progress entry for today
          updatedProgress.push({
            date: today,
            totalSeconds: sessionDuration
          });
        }

        // Update recent tags
        const recentTags = get().recentTags;
        let updatedRecentTags = recentTags.filter(tag => tag !== currentTag); // Remove current tag if exists
        updatedRecentTags.unshift(currentTag); // Add current tag to the beginning
        updatedRecentTags = updatedRecentTags.slice(0, MAX_RECENT_TAGS); // Keep only the most recent tags

        set(state => ({
          sessions: [...state.sessions, newSession],
          dailyProgress: updatedProgress,
          timeRemaining: state.duration,
          isRunning: false,
          isPaused: false,
          recentTags: updatedRecentTags,
          currentTag: '', // Reset current tag
          isBackgroundMode: false
        }));
      },

      setDailyTarget: (hours) => {
        // Convert hours to seconds and validate
        const targetInSeconds = Math.max(
          MIN_DAILY_TARGET,
          Math.min(hours * 60 * 60, MAX_DAILY_TARGET)
        );
        
        set({ dailyTarget: targetInSeconds });
      },

      setCurrentTag: (tag) => {
        set({ currentTag: tag });
      },

      getTagStats: () => {
        const sessions = get().sessions;
        const tagMap = new Map<string, { totalSeconds: number; sessionCount: number }>();
        
        sessions.forEach(session => {
          const tag = session.tag || 'Untagged';
          const current = tagMap.get(tag) || { totalSeconds: 0, sessionCount: 0 };
          
          tagMap.set(tag, {
            totalSeconds: current.totalSeconds + session.duration,
            sessionCount: current.sessionCount + 1
          });
        });
        
        const tagStats: TagStats[] = Array.from(tagMap.entries()).map(([tag, stats]) => ({
          tag,
          totalSeconds: stats.totalSeconds,
          sessionCount: stats.sessionCount
        }));
        
        // Sort by total time (descending)
        return tagStats.sort((a, b) => b.totalSeconds - a.totalSeconds);
      },

      setBackgroundMode: (isBackground) => {
        set({ isBackgroundMode: isBackground });
      },

      // Method to sync timer with real time when app comes back from background
      syncTimerWithRealTime: () => {
        const state = get();
        if (state.isRunning && !state.isPaused) {
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - state.lastUpdatedTime) / 1000);
          
          if (elapsedSeconds > 0) {
            const newTimeRemaining = Math.max(0, state.timeRemaining - elapsedSeconds);
            
            // Check if timer should have completed while in background
            if (newTimeRemaining === 0 && state.timeRemaining > 0) {
              // Timer completed while in background
              set({ 
                timeRemaining: 0,
                lastUpdatedTime: now
              });
              
              // Complete the session
              get().completeSession(true);
            } else {
              // Just update the time
              set({ 
                timeRemaining: newTimeRemaining,
                lastUpdatedTime: now
              });
            }
          }
        }
      }
    }),
    {
      name: 'study-timer-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useTimerStore;