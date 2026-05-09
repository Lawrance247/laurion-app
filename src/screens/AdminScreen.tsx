// src/screens/AdminScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { Card, Button, EmptyState, SectionHeader } from '../components';
import api from '../services/api';

interface UserRow { id: number; username: string; role: string; }
interface Stats { user_count: number; student_count: number; teacher_count: number; mat_count: number; total_downloads: number; }

export default function AdminScreen({ route }: any) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      // Scrape the admin page HTML
      const res = await api.get('/admin');
      const html: string = res.data;

      // Parse very basic stats from page (a real app would use API endpoints)
      const userMatch = html.match(/(\d+)\s*Total Users?/i);
      const stuMatch = html.match(/(\d+)\s*Students?/i);
      const teachMatch = html.match(/(\d+)\s*Teachers?/i);
      const matMatch = html.match(/(\d+)\s*Materials?/i);
      const dlMatch = html.match(/(\d+)\s*downloads/i);

      setStats({
        user_count: parseInt(userMatch?.[1] || '0'),
        student_count: parseInt(stuMatch?.[1] || '0'),
        teacher_count: parseInt(teachMatch?.[1] || '0'),
        mat_count: parseInt(matMatch?.[1] || '0'),
        total_downloads: parseInt(dlMatch?.[1] || '0'),
      });
    } catch (_) {}
  }

  useEffect(() => { load(); }, []);

  async function onRefresh() { setRefreshing(true); await load(); setRefreshing(false); }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />}
    >
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>⚙ Admin Panel</Text>
        <Text style={styles.pageSub}>Developer tools — manage users and content</Text>
      </View>

      {/* Stats */}
      {stats && (
        <Card>
          <SectionHeader title="📊 Platform Stats" />
          <View style={styles.statsGrid}>
            <StatBox icon="👥" value={stats.user_count} label="Total Users" />
            <StatBox icon="🎓" value={stats.student_count} label="Students" />
            <StatBox icon="📋" value={stats.teacher_count} label="Teachers" />
            <StatBox icon="📚" value={stats.mat_count} label="Materials" />
            <StatBox icon="⬇️" value={stats.total_downloads} label="Downloads" />
          </View>
        </Card>
      )}

      <Card>
        <SectionHeader title="🔧 Admin Actions" />
        <Text style={styles.note}>
          For full user management (delete users, change roles), open the admin panel in your browser at your backend URL + /admin
        </Text>
        <Text style={styles.url}>YOUR-LAURION-BACKEND.onrender.com/admin</Text>
      </Card>

      <Card>
        <Text style={styles.infoTitle}>ℹ️ About This Panel</Text>
        <Text style={styles.infoText}>
          The native admin panel shows live statistics pulled from your Flask backend. Full user management is best done through the web admin panel which has a complete interface for role changes and deletions.
        </Text>
      </Card>
    </ScrollView>
  );
}

function StatBox({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <View style={statStyles.box}>
      <Text style={statStyles.icon}>{icon}</Text>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  box: { width: '30%', alignItems: 'center', padding: 12, margin: '1.5%', backgroundColor: Colors.bgSubtle, borderRadius: Radius.md },
  icon: { fontSize: 22 },
  value: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.black, color: Colors.primary, marginTop: 4 },
  label: { fontSize: Typography.sizes.xs, color: Colors.muted, textAlign: 'center', marginTop: 2 },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.md, paddingBottom: 100 },
  pageHeader: { marginBottom: Spacing.md },
  pageTitle: { fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.black, color: Colors.primary, fontFamily: Typography.heading },
  pageSub: { fontSize: Typography.sizes.sm, color: Colors.textSub, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  note: { fontSize: Typography.sizes.sm, color: Colors.textSub, lineHeight: 20, marginBottom: Spacing.sm },
  url: { fontSize: Typography.sizes.sm, color: Colors.accent, fontWeight: Typography.weights.bold, fontFamily: 'Courier New' },
  infoTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text, marginBottom: 8 },
  infoText: { fontSize: Typography.sizes.sm, color: Colors.textSub, lineHeight: 20 },
});
