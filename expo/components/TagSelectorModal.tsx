import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import TagSelector from './TagSelector';

interface TagSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onTagSelected: () => void;
}

export default function TagSelectorModal({ visible, onClose, onTagSelected }: TagSelectorModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={styles.modalView}>
          <TagSelector 
            onTagSelected={onTagSelected} 
            onCancel={onClose} 
          />
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
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});