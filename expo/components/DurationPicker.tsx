import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface DurationPickerProps {
  onSelectDuration: (duration: number) => void;
  selectedDuration: number;
}

const DURATIONS = [
  { label: '25m', value: 25 * 60 },
  { label: '45m', value: 45 * 60 },
  { label: '60m', value: 60 * 60 },
  { label: '90m', value: 90 * 60 },
  { label: '120m', value: 120 * 60 },
];

export default function DurationPicker({ onSelectDuration, selectedDuration }: DurationPickerProps) {
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Session Duration</Text>
      <View style={styles.buttonsContainer}>
        {DURATIONS.map((duration) => (
          <TouchableOpacity
            key={duration.value}
            style={[
              styles.durationButton,
              selectedDuration === duration.value && styles.selectedButton,
            ]}
            onPress={() => {
              triggerHaptic();
              onSelectDuration(duration.value);
            }}
          >
            <Text
              style={[
                styles.durationText,
                selectedDuration === duration.value && styles.selectedText,
              ]}
            >
              {duration.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.darkGray,
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  durationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.light.lightGray,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: Colors.light.primary,
  },
  durationText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFF',
  },
});