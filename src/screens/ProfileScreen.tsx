// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { Card, Avatar, Badge, Button } from '../components';
import { logout } from '../services/api';

export default function ProfileScreen({ route, navigation }: any) {
  const session = route?.params?.session || {};
  const username: string = session.username || 'User';
  const role: string = session.role || 'student';
  const isAdmin = session.isAdmin || false;

  async function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await logout();
        navigation.replace('Auth', { screen: 'Login' });
      }},
    ]);
  }

  const roleLabel = role === 'teacher' ? '📋 Teacher' : role === 'admin' ? '⚙ Admin' : '🎓 Student';
  const roleDesc = role === 'teacher'
    ? 'You can upload and manage study materials.'
    : role === 'admin'
    ? 'You have full admin access.'
    : 'You can browse materials, write notes, and manage your planner.';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>

      {/* Profile hero */}
      <View style={styles.hero}>
        <Avatar name={username} size={80} />
        <Text style={styles.name}>{username}</Text>
        <Badge label={roleLabel} color={role === 'teacher' ? Colors.gold : role === 'admin' ? '#805ad5' : Colors.accent} />
        <Text style={styles.roleDesc}>{roleDesc}</Text>
      </View>

      {/* Menu items */}
      <Card>
        <Text style={styles.sectionTitle}>My Account</Text>

        {(role === 'teacher' || role === 'admin') && (
          <MenuItem icon="📤" label="Upload Material" onPress={() => navigation.navigate('Upload', { session })} />
        )}
        {isAdmin && (
          <MenuItem icon="⚙" label="Admin Panel" onPress={() => navigation.navigate('Admin', { session })} accent />
        )}
        <MenuItem icon="📅" label="Planner" onPress={() => navigation.navigate('Planner', { session })} />
        <MenuItem icon="📝" label="Notes" onPress={() => navigation.navigate('Notes', { session })} />
        <MenuItem icon="📚" label="Classes" onPress={() => navigation.navigate('Classes', { session })} />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>About</Text>
        <MenuItem icon="🌐" label="Visit Laurion Web" onPress={() => Linking.openURL('https://YOUR-LAURION-BACKEND.onrender.com')} />
        <MenuItem icon="ℹ️" label="Version 1.0.0" onPress={() => {}} />
      </Card>

      <Button label="Sign Out" onPress={handleLogout} variant="danger" icon="👋" style={{ marginTop: Spacing.sm }} />

      <Text style={styles.footer}>Laurion Education © 2025{'\n'}Grades 8–12 Smart Learning Platform</Text>
    </ScrollView>
  );
}

function MenuItem({ icon, label, onPress, accent }: { icon: string; label: string; onPress: () => void; accent?: boolean }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.75}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={[styles.menuLabel, accent && { color: '#805ad5', fontWeight: Typography.weights.bold }]}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.md, paddingBottom: 100 },
  hero: { alignItems: 'center', marginBottom: Spacing.lg, paddingTop: Spacing.md },
  name: { fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.black, color: Colors.primary, fontFamily: Typography.heading, marginTop: Spacing.md, marginBottom: 6 },
  roleDesc: { fontSize: Typography.sizes.sm, color: Colors.textSub, textAlign: 'center', marginTop: 8, lineHeight: 20, paddingHorizontal: Spacing.lg },
  sectionTitle: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { fontSize: 20, width: 32 },
  menuLabel: { flex: 1, fontSize: Typography.sizes.base, color: Colors.text, fontWeight: Typography.weights.medium },
  menuArrow: { fontSize: 20, color: Colors.muted },
  footer: { textAlign: 'center', color: Colors.muted, fontSize: Typography.sizes.xs, marginTop: Spacing.lg, lineHeight: 18 },
});
