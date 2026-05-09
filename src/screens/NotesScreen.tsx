// src/screens/NotesScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Share,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, SUBJECTS, GRADES } from '../theme';
import { Card, Button, SectionHeader } from '../components';
import { getNotes, saveNotes } from '../services/api';

export default function NotesScreen({ route }: any) {
  const [subject, setSubject] = useState('math');
  const [grade, setGrade] = useState(12);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  async function load(s = subject, g = grade) {
    try {
      const text = await getNotes(s, g);
      setContent(text);
      setDirty(false);
      countWords(text);
    } catch (_) {}
  }

  useEffect(() => { load(); }, [subject, grade]);

  function countWords(text: string) {
    const words = text.trim().split(/\s+/).filter(w => w).length;
    setWordCount(words);
  }

  function handleChange(text: string) {
    setContent(text);
    setDirty(true);
    countWords(text);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveNotes(subject, grade, content);
      setDirty(false);
      Alert.alert('Saved!', 'Your notes have been saved.');
    } catch (_) {
      Alert.alert('Error', 'Could not save notes. Check connection.');
    }
    setSaving(false);
  }

  async function handleShare() {
    if (!content.trim()) { Alert.alert('Nothing to share', 'Write some notes first.'); return; }
    await Share.share({
      message: `Laurion Notes\nSubject: ${SUBJECTS[subject]?.label} | Grade ${grade}\n\n${content}`,
      title: `Laurion Notes – ${SUBJECTS[subject]?.label} Grade ${grade}`,
    });
  }

  function handleClear() {
    Alert.alert('Clear Editor', 'This only clears the editor — saved notes are untouched.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => { setContent(''); setDirty(false); setWordCount(0); } },
    ]);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>📝 Notes</Text>
          <Text style={styles.pageSub}>Write, save, and export notes per subject & grade</Text>
        </View>

        {/* Subject selector */}
        <Card>
          <SectionHeader title="Subject" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.entries(SUBJECTS).map(([code, info]) => (
              <TouchableOpacity
                key={code}
                style={[styles.chip, subject === code && { borderColor: info.color, backgroundColor: info.color + '20' }]}
                onPress={() => setSubject(code)}
              >
                <Text style={styles.chipIcon}>{info.icon}</Text>
                <Text style={[styles.chipLabel, subject === code && { color: info.color, fontWeight: '700' }]}>{info.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card>

        {/* Grade selector */}
        <Card>
          <SectionHeader title="Grade" />
          <View style={styles.gradeRow}>
            {GRADES.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.gradeBtn, grade === g && styles.gradeBtnActive]}
                onPress={() => setGrade(g)}
              >
                <Text style={[styles.gradeBtnText, grade === g && styles.gradeBtnTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Editor */}
        <Card>
          <View style={styles.editorHeader}>
            <Text style={styles.editorTitle}>{SUBJECTS[subject]?.icon} {SUBJECTS[subject]?.label} · Grade {grade}</Text>
            <View style={[styles.dirtyDot, { backgroundColor: dirty ? Colors.warning : Colors.accent }]} />
          </View>
          <Text style={styles.wordCount}>{wordCount} word{wordCount !== 1 ? 's' : ''} · {content.length} chars · {dirty ? '● Unsaved' : '✓ Saved'}</Text>

          <TextInput
            style={styles.textarea}
            value={content}
            onChangeText={handleChange}
            placeholder={`Start writing your ${SUBJECTS[subject]?.label} notes here...\n\nUse this space to summarise what you've learned.`}
            placeholderTextColor={Colors.muted}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.actions}>
            <Button label="💾 Save" onPress={handleSave} loading={saving} style={styles.actionBtn} />
            <Button label="📤 Share" onPress={handleShare} variant="secondary" style={styles.actionBtn} />
            <Button label="🗑 Clear" onPress={handleClear} variant="ghost" style={styles.actionBtn} />
          </View>
        </Card>

        <Text style={styles.tip}>💡 Notes are automatically stored per subject and grade — switching between them loads different notes.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.md, paddingBottom: 120 },
  pageHeader: { marginBottom: Spacing.md },
  pageTitle: { fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.black, color: Colors.primary, fontFamily: Typography.heading },
  pageSub: { fontSize: Typography.sizes.sm, color: Colors.textSub, marginTop: 4 },
  chip: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8, backgroundColor: Colors.bgSubtle },
  chipIcon: { fontSize: 16 },
  chipLabel: { fontSize: Typography.sizes.sm, color: Colors.textSub },
  gradeRow: { flexDirection: 'row', gap: 8 },
  gradeBtn: { flex: 1, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, paddingVertical: 10, alignItems: 'center', backgroundColor: Colors.bgSubtle },
  gradeBtnActive: { borderColor: Colors.accent, backgroundColor: Colors.accent },
  gradeBtnText: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.muted },
  gradeBtnTextActive: { color: Colors.white },
  editorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  editorTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.text },
  dirtyDot: { width: 8, height: 8, borderRadius: 4 },
  wordCount: { fontSize: Typography.sizes.xs, color: Colors.muted, marginBottom: Spacing.sm },
  textarea: {
    minHeight: 280, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.md, padding: 14, fontSize: Typography.sizes.base,
    color: Colors.text, backgroundColor: Colors.bgSubtle, lineHeight: 24,
  },
  actions: { flexDirection: 'row', gap: 8, marginTop: Spacing.md, flexWrap: 'wrap' },
  actionBtn: { flex: 1, minWidth: 90 },
  tip: { fontSize: Typography.sizes.xs, color: Colors.muted, textAlign: 'center', lineHeight: 18, paddingHorizontal: Spacing.md },
});
