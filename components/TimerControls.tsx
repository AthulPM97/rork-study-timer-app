import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Play, Pause, RotateCcw, Square } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onStop: () => void;
}

export default function TimerControls({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
  onStop,
}: TimerControlsProps) {
  
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <View style={styles.container}>
      {!isRunning && !isPaused ? (
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={() => {
            triggerHaptic();
            onStart();
          }}
        >
          <Play color="#FFF" size={24} />
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.controlsRow}>
          {isRunning ? (
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={() => {
                triggerHaptic();
                onPause();
              }}
            >
              <Pause color={Colors.light.text} size={24} />
              <Text style={styles.secondaryButtonText}>Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={() => {
                triggerHaptic();
                onResume();
              }}
            >
              <Play color="#FFF" size={24} />
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => {
              triggerHaptic();
              onReset();
            }}
          >
            <RotateCcw color={Colors.light.text} size={24} />
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.dangerButton]} 
            onPress={() => {
              triggerHaptic();
              onStop();
            }}
          >
            <Square color="#FFF" size={24} />
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    minWidth: 120,
  },
  secondaryButton: {
    backgroundColor: Colors.light.lightGray,
    borderWidth: 1,
    borderColor: Colors.light.gray,
  },
  dangerButton: {
    backgroundColor: Colors.light.error,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: Colors.light.text,
    fontWeight: '600',
    fontSize: 16,
  },
});