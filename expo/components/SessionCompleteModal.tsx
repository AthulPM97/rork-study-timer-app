import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { CheckCircle } from 'lucide-react-native';

interface SessionCompleteModalProps {
  visible: boolean;
  onClose: () => void;
  duration: number;
}

export default function SessionCompleteModal({ visible, onClose, duration }: SessionCompleteModalProps) {
  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins < 60) {
      return `${mins} minute${mins !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMins > 0 ? `${remainingMins} minute${remainingMins !== 1 ? 's' : ''}` : ''}`;
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <CheckCircle color={Colors.light.success} size={60} />
          <Text style={styles.modalTitle}>Session Complete!</Text>
          <Text style={styles.modalText}>
            You've completed a {formatDuration(duration)} study session.
          </Text>
          <Text style={styles.modalSubtext}>
            Great job! Take a short break before starting another session.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    color: Colors.light.text,
  },
  modalSubtext: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: Colors.light.darkGray,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});