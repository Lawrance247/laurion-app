// src/screens/DashboardScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl,
  TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { Card, StatCard, SectionHeader, MaterialRow, TaskCard, EmptyState, Avatar, Badge, Button } from '../components';
import { getMaterials, getTasks, addTask, deleteTask, Material, Task } from '../services/api';

export default function DashboardScreen({ route, navigation }: any) {
  const session = route?.params?.session || {};
  const username: string = session.username || 'User';
  const role: string = session.role || 'student';
  const isAdmin = session.isAdmin || false;

  const [materials, setMaterials] = useState<Material[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Quick-add task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  const load = useCallback(async () => {
    try {
      const [mats, tks] = await Promise.all([getMaterials(), getTasks()]);
      setMaterials(mats.slice(0, 5));
      setTasks(tks);
    } catch (_) {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTasks = tasks.filter(t => {
    const d = new Date(t.date);
    return d >= today && d < new Date(today.getTime() + 86400000);
  });
  const overdueTasks = tasks.filter(t => new Date(t.date) < today);

  async function handleAddTask() {
    if (!taskTitle.trim() || !taskDate.trim()) {
      Alert.alert('Required', 'Task title and date are required.');
      return;
    }
    setAddingTask(true);
    try {
      await addTask({ title: taskTitle.trim(), description: taskDesc.trim(), date: taskDate });
      setTaskTitle(''); setTaskDesc(''); setTaskDate('');
      await load();
    } catch (_) {
      Alert.alert('Error', 'Could not add task. Please try again.');
    }
    setAddingTask(false);
  }

  async function handleDeleteTask(id: number) {
    try { await deleteTask(id); await load(); } catch (_) {}
  }

  const greet = role === 'teacher' ? 'Ready to guide your students? 📋' : 'Ready to level up? 🚀';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />}
    >

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Hey {username} 👋</Text>
          <Text style={styles.subGreet}>{greet}</Text>
        </View>
        <Avatar name={username} size={52} />
      </View>

      {/* Role badge */}
      <Badge label={role.toUpperCase()} color={role === 'teacher' ? Colors.gold : Colors.accent} />

      {/* Stat cards */}
      <View style={styles.statsRow}>
        {role === 'teacher' ? (
          <>
            <StatCard icon="📤" title="Upload" subtitle="Share material" onPress={() => navigation.navigate('Upload', { session })} />
            <StatCard icon="📁" title="My Files" subtitle="Manage uploads" onPress={() => navigation.navigate('Classes', { screen: 'Classes', params: { session } })} />
          </>
        ) : (
          <>
            <StatCard icon="📚" title="Classes" subtitle="Study materials" onPress={() => navigation.navigate('Classes', { session })} />
            <StatCard icon="📝" title="Notes" subtitle="Write & export" onPress={() => navigation.navigate('Notes', { session })} />
            <StatCard icon="📅" title="Planner" subtitle="Manage tasks" onPress={() => navigation.navigate('Planner', { session })} />
          </>
        )}
      </View>

      {/* Admin shortcut */}
      {isAdmin && (
        <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('Admin', { session })} activeOpacity={0.85}>
          <Text style={styles.adminIcon}>⚙</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminTitle}>Developer Admin Panel</Text>
            <Text style={styles.adminSub}>Manage users, view stats, change roles</Text>
          </View>
          <Text style={styles.adminArrow}>→</Text>
        </TouchableOpacity>
      )}

      {/* Popular materials */}
      <Card>
        <SectionHeader title="🔥 Popular Materials" action="All Classes" onAction={() => navigation.navigate('Classes', { session })} />
        {materials.length > 0 ? (
          materials.map((m, i) => (
            <MaterialRow key={m.id} item={m} rank={i + 1} onPress={() => {}} />
          ))
        ) : (
          <EmptyState icon="📭" title="No materials yet" subtitle="Teachers will upload soon." />
        )}
      </Card>

      {/* Quick add task */}
      <Card>
        <Text style={styles.sectionTitleText}>⚡ Quick Add Task</Text>
        <TextInput style={styles.input} value={taskTitle} onChangeText={setTaskTitle} placeholder="Task title *" placeholderTextColor={Colors.muted} />
        <TextInput style={styles.input} value={taskDesc} onChangeText={setTaskDesc} placeholder="Description (optional)" placeholderTextColor={Colors.muted} />
        <TextInput style={styles.input} value={taskDate} onChangeText={setTaskDate} placeholder="Date (YYYY-MM-DDTHH:MM)" placeholderTextColor={Colors.muted} />
        <Button label="Add Task" onPress={handleAddTask} loading={addingTask} />
      </Card>

      {/* Today's tasks */}
      <Card>
        <SectionHeader title="📅 Today's Tasks" action="All" onAction={() => navigation.navigate('Planner', { session })} />
        {todayTasks.length > 0
          ? todayTasks.map(t => <TaskCard key={t.id} task={t} onDelete={handleDeleteTask} />)
          : <EmptyState icon="🎉" title="No tasks for today!" />}
      </Card>

      {/* Overdue */}
      {overdueTasks.length > 0 && (
        <Card>
          <SectionHeader title="🔴 Overdue Tasks" />
          {overdueTasks.map(t => <TaskCard key={t.id} task={t} overdue onDelete={handleDeleteTask} />)}
        </Card>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.md, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  greeting: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.black, color: Colors.primary, fontFamily: Typography.heading },
  subGreet: { fontSize: Typography.sizes.sm, color: Colors.textSub, marginTop: 2 },
  statsRow: { flexDirection: 'row', marginBottom: Spacing.md, marginHorizontal: -4 },
  adminBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1a0533', borderRadius: Radius.md, padding: 16,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: 'rgba(167,139,250,0.25)',
    ...Shadow.md,
  },
  adminIcon: { fontSize: 24 },
  adminTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: '#c4b5fd' },
  adminSub: { fontSize: Typography.sizes.xs, color: 'rgba(196,181,253,0.6)', marginTop: 2 },
  adminArrow: { color: 'rgba(196,181,253,0.5)', fontSize: 18 },
  sectionTitleText: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.text, marginBottom: Spacing.sm },
  input: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md,
    padding: 12, fontSize: Typography.sizes.base, color: Colors.text,
    backgroundColor: Colors.bgSubtle, marginBottom: Spacing.sm,
  },
});
