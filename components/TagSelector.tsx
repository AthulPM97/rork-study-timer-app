import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Colors from '@/constants/colors';
import { Tag, Plus, X } from 'lucide-react-native';
import useTimerStore from '@/store/timerStore';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface TagSelectorProps {
  onTagSelected: () => void;
  onCancel: () => void;
}

export default function TagSelector({ onTagSelected, onCancel }: TagSelectorProps) {
  const { currentTag, setCurrentTag, recentTags } = useTimerStore();
  const [newTag, setNewTag] = useState('');

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const handleSelectTag = (tag: string) => {
    triggerHaptic();
    setCurrentTag(tag);
    onTagSelected();
  };

  const handleAddNewTag = () => {
    if (newTag.trim()) {
      triggerHaptic();
      setCurrentTag(newTag.trim());
      onTagSelected();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What are you studying?</Text>
        <Text style={styles.subtitle}>Add a tag to track your study subjects</Text>
      </View>

      <View style={styles.inputContainer}>
        <Tag size={20} color={Colors.light.darkGray} />
        <TextInput
          style={styles.input}
          placeholder="Enter subject (e.g., Math, Physics)"
          value={newTag}
          onChangeText={setNewTag}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleAddNewTag}
        />
      </View>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleAddNewTag}
        disabled={!newTag.trim()}
      >
        <Plus size={20} color="#FFF" />
        <Text style={styles.addButtonText}>Add & Start</Text>
      </TouchableOpacity>

      {recentTags.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recent Subjects</Text>
          <FlatList
            data={recentTags}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.tagButton} 
                onPress={() => handleSelectTag(item)}
              >
                <Tag size={16} color={Colors.light.primary} />
                <Text style={styles.tagText}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.tagsList}
          />
        </View>
      )}

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <X size={20} color={Colors.light.darkGray} />
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    padding: 24,
    borderRadius: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.darkGray,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: Colors.light.text,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recentContainer: {
    marginBottom: 24,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.darkGray,
    marginBottom: 12,
  },
  tagsList: {
    gap: 8,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.lightGray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.light.darkGray,
    fontWeight: '500',
  },
});