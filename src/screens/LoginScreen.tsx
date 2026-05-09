// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';
import { Button } from '../components';
import { login } from '../services/api';

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password) {
      Alert.alert('Required', 'Please enter username and password.');
      return;
    }
    setLoading(true);
    try {
      const session = await login(username.trim(), password);
      navigation.replace('Main', { session });
    } catch (err: any) {
      Alert.alert('Login failed', err?.response?.status === 401 || err?.response?.status === 302
        ? 'Incorrect username or password.'
        : 'Could not connect. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Laurion</Text>
          <Text style={styles.tagline}>Smart Learning Platform</Text>
          <Text style={styles.sub}>Grades 8–12 • Study Materials, Planner & Notes</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Your username"
              placeholderTextColor={Colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor={Colors.muted}
              secureTextEntry
            />
          </View>

          <Button label="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? <Text style={styles.switchLink}>Register</Text></Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>© 2025 Laurion Education</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: Colors.primary, padding: Spacing.lg, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: Spacing.xl },
  logoImage: { width: 110, height: 110, marginBottom: Spacing.md },
  appName: { fontSize: Typography.sizes.xxxl, color: Colors.white, fontFamily: Typography.heading, fontWeight: '900', letterSpacing: -1 },
  tagline: { fontSize: Typography.sizes.base, color: Colors.accentLight, marginTop: 4, fontWeight: Typography.weights.semibold },
  sub: { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.5)', marginTop: 6, textAlign: 'center' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.lg,
  },
  cardTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.black, color: Colors.primary, fontFamily: Typography.heading, marginBottom: Spacing.md },
  fieldWrap: { marginBottom: Spacing.md },
  label: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.textSub, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 13,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    backgroundColor: Colors.bgSubtle,
  },
  switchRow: { alignItems: 'center', marginTop: Spacing.md },
  switchText: { fontSize: Typography.sizes.sm, color: Colors.muted },
  switchLink: { color: Colors.accent, fontWeight: Typography.weights.bold },
  footer: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: Typography.sizes.xs, marginTop: Spacing.lg },
});
