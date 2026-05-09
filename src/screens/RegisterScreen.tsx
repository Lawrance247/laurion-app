// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { Button } from '../components';
import { register } from '../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!username.trim() || !password) {
      Alert.alert('Required', 'Please fill in all fields.');
      return;
    }
    if (password.length < 4) {
      Alert.alert('Password too short', 'Password must be at least 4 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(username.trim(), password, role);
      Alert.alert('Account Created!', 'You can now sign in.', [
        { text: 'Sign In', onPress: () => navigation.replace('Login') },
      ]);
    } catch (err: any) {
      Alert.alert('Registration failed', 'That username may already be taken.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.hero}>
          <Image source={require('../../assets/images/icon.png')} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.appName}>Laurion</Text>
          <Text style={styles.tagline}>Create your account</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Register</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Username</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername}
              placeholder="Choose a username" placeholderTextColor={Colors.muted}
              autoCapitalize="none" autoCorrect={false} />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword}
              placeholder="Create a password" placeholderTextColor={Colors.muted} secureTextEntry />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>I am a...</Text>
            <View style={styles.roleRow}>
              {(['student', 'teacher'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                  onPress={() => setRole(r)}
                >
                  <Text style={styles.roleIcon}>{r === 'student' ? '🎓' : '📋'}</Text>
                  <Text style={[styles.roleLabel, role === r && styles.roleLabelActive]}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button label="Create Account" onPress={handleRegister} loading={loading} style={{ marginTop: 8 }} />

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? <Text style={styles.switchLink}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: Colors.primary, padding: Spacing.lg, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: Spacing.xl },
  logoImage: { width: 90, height: 90, marginBottom: Spacing.sm },
  appName: { fontSize: Typography.sizes.xxl, color: Colors.white, fontFamily: Typography.heading, fontWeight: '900' },
  tagline: { fontSize: Typography.sizes.sm, color: Colors.accentLight, marginTop: 4 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.lg },
  cardTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.black, color: Colors.primary, fontFamily: Typography.heading, marginBottom: Spacing.md },
  fieldWrap: { marginBottom: Spacing.md },
  label: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.textSub, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, padding: 13, fontSize: Typography.sizes.base, color: Colors.text, backgroundColor: Colors.bgSubtle },
  roleRow: { flexDirection: 'row', gap: 12 },
  roleBtn: { flex: 1, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, padding: 14, alignItems: 'center', backgroundColor: Colors.bgSubtle },
  roleBtnActive: { borderColor: Colors.accent, backgroundColor: Colors.accent + '15' },
  roleIcon: { fontSize: 26, marginBottom: 4 },
  roleLabel: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.muted },
  roleLabelActive: { color: Colors.accent },
  switchRow: { alignItems: 'center', marginTop: Spacing.md },
  switchText: { fontSize: Typography.sizes.sm, color: Colors.muted },
  switchLink: { color: Colors.accent, fontWeight: Typography.weights.bold },
});
