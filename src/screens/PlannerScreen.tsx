// src/screens/PlannerScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  Alert, RefreshControl, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, SUBJECTS } from '../theme';
import { Card, Button, TaskCard, EmptyState, SectionHeader, Badge } from '../components';
import { getTasks, addTask, deleteTask, Task } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function PlannerScreen({ route }: any) {
  const session = route?.params?.session || {};
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [subject, setSubject] = useState('math');
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try { setTasks(await getTasks()); } catch (_) {}
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function handleAdd() {
    if (!title.trim() || !dateStr.trim()) {
      Alert.alert('Required', 'Title and date are required.');
      return;
    }
    setAdding(true);
    try {
      await addTask({ title: title.trim(), description: desc.trim(), date: dateStr, subject });
      setTitle(''); setDesc(''); setDateStr('');
      await load();
    } catch (_) { Alert.alert('Error', 'Could not add task.'); }
    setAdding(false);
  }

  async function handleDelete(id: number) {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await deleteTask(id); await load(); } catch (_) {}
      }},
    ]);
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcoming = tasks.filter(t => new Date(t.date) >= today);
  const overdue  = tasks.filter(t => new Date(t.date) < today);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={Colors.accent} />}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>📅 Planner</Text>
          <Text style={styles.pageSub}>Manage your study tasks and deadlines</Text>
        </View>

        {/* Add task card */}
        <Card>
          <Text style={styles.cardHeading}>+ Add New Task</Text>

          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Task title *" placeholderTextColor={Colors.muted} />
          <TextInput style={[styles.input, { height: 70, textAlignVertical: 'top' }]} value={desc} onChangeText={setDesc}
            placeholder="Description (optional)" placeholderTextColor={Colors.muted} multiline />
          <TextInput style={styles.input} value={dateStr} onChangeText={setDateStr}
            placeholder="Date & time (YYYY-MM-DDTHH:MM)" placeholderTextColor={Colors.muted} />

          {/* Subject picker */}
          <Text style={styles.label}>Subject</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
            {Object.entries(SUBJECTS).map(([code, info]) => (
              <TouchableChip
                key={code}
                label={`${info.icon} ${info.label}`}
                active={subject === code}
                color={info.color}
                onPress={() => setSubject(code)}
              />
            ))}
          </ScrollView>

          <Button label="Add Task" onPress={handleAdd} loading={adding} icon="✅" />
        </Card>

        {/* Upcoming */}
        <Card>
          <SectionHeader title={`📅 Upcoming (${upcoming.length})`} />
          {upcoming.length > 0
            ? upcoming.map(t => <TaskCard key={t.id} task={t} onDelete={handleDelete} />)
            : <EmptyState icon="🎉" title="No upcoming tasks!" subtitle="Add one above to get started." />}
        </Card>

        {/* Overdue */}
        {overdue.length > 0 && (
          <Card>
            <SectionHeader title={`🔴 Overdue (${overdue.length})`} />
            {overdue.map(t => <TaskCard key={t.id} task={t} overdue onDelete={handleDelete} />)}
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function TouchableChip({ label, active, color, onPress }: { label: string; active: boolean; color: string; onPress: () => void }) {
  const { TouchableOpacity } = require('react-native');
  return (
    <TouchableOpacity
      style={[chipStyles.chip, active && { borderColor: color, backgroundColor: color + '20' }]}
      onPress={onPress}
    >
      <Text style={[chipStyles.label, active && { color, fontWeight: '700' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const chipStyles = StyleSheet.create({
  chip: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.full, paddingVertical: 7, paddingHorizontal: 14, marginRight: 8, backgroundColor: Colors.bgSubtle },
  label: { fontSize: Typography.sizes.sm, color: Colors.textSub },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.md, paddingBottom: 100 },
  pageHeader: { marginBottom: Spacing.md },
  pageTitle: { fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.black, color: Colors.primary, fontFamily: Typography.heading },
  pageSub: { fontSize: Typography.sizes.sm, color: Colors.textSub, marginTop: 4 },
  cardHeading: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.text, marginBottom: Spacing.sm },
  label: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.textSub, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, padding: 12, fontSize: Typography.sizes.base, color: Colors.text, backgroundColor: Colors.bgSubtle, marginBottom: Spacing.sm },
});
