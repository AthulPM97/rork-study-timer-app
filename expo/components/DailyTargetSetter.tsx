import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Check, Minus, Plus } from 'lucide-react-native';
import useTimerStore from '@/store/timerStore';

interface DailyTargetSetterProps {
  onClose?: () => void;
}

export default function DailyTargetSetter({ onClose }: DailyTargetSetterProps) {
  const { dailyTarget, setDailyTarget } = useTimerStore();
  
  // Convert seconds to hours for display
  const initialHours = Math.floor(dailyTarget / 3600);
  const [hours, setHours] = useState(initialHours.toString());
  
  const MIN_HOURS = 4;
  const MAX_HOURS = 9;

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const decreaseHours = () => {
    triggerHaptic();
    const currentHours = parseInt(hours);
    if (!isNaN(currentHours) && currentHours > MIN_HOURS) {
      setHours((currentHours - 1).toString());
    }
  };

  const increaseHours = () => {
    triggerHaptic();
    const currentHours = parseInt(hours);
    if (!isNaN(currentHours) && currentHours < MAX_HOURS) {
      setHours((currentHours + 1).toString());
    }
  };

  const handleInputChange = (text: string) => {
    // Only allow numbers
    if (/^\d*$/.test(text)) {
      setHours(text);
    }
  };

  const handleSave = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    let hoursValue = parseInt(hours);
    
    // Validate input
    if (isNaN(hoursValue)) {
      hoursValue = MIN_HOURS;
    } else {
      hoursValue = Math.max(MIN_HOURS, Math.min(hoursValue, MAX_HOURS));
    }
    
    setDailyTarget(hoursValue);
    if (onClose) onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Daily Study Target</Text>
      <Text style={styles.description}>
        Set your daily study goal between 4-9 hours
      </Text>
      
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={decreaseHours}
          disabled={parseInt(hours) <= MIN_HOURS}
        >
          <Minus 
            size={20} 
            color={parseInt(hours) <= MIN_HOURS ? Colors.light.gray : Colors.light.text} 
          />
        </TouchableOpacity>
        
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={hours}
            onChangeText={handleInputChange}
            keyboardType="number-pad"
            maxLength={1}
          />
          <Text style={styles.hoursLabel}>hours</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={increaseHours}
          disabled={parseInt(hours) >= MAX_HOURS}
        >
          <Plus 
            size={20} 
            color={parseInt(hours) >= MAX_HOURS ? Colors.light.gray : Colors.light.text} 
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Check size={20} color="#FFF" />
        <Text style={styles.saveButtonText}>Save Target</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.light.darkGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  input: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    minWidth: 50,
  },
  hoursLabel: {
    fontSize: 18,
    color: Colors.light.darkGray,
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});