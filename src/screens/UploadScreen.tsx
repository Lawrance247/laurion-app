// src/screens/UploadScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  Alert, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { Colors, Typography, Spacing, Radius, SUBJECTS, GRADES } from '../theme';
import { Card, Button, SectionHeader } from '../components';
import { uploadMaterial } from '../services/api';

export default function UploadScreen({ route, navigation }: any) {
  const session = route?.params?.session || {};

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('math');
  const [grade, setGrade] = useState(12);
  const [file, setFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  async function pickFile() {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx, DocumentPicker.types.ppt, DocumentPicker.types.pptx],
      });
      setFile({ uri: result.uri, name: result.name || 'file', type: result.type || 'application/octet-stream' });
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) Alert.alert('Error', 'Could not pick file.');
    }
  }

  async function handleUpload() {
    if (!title.trim() || !file) {
      Alert.alert('Required', 'Please enter a title and select a file.');
      return;
    }
    setUploading(true);
    try {
      await uploadMaterial(title.trim(), subject, grade, file);
      Alert.alert('Uploaded!', 'Your material has been uploaded successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (_) {
      Alert.alert('Upload failed', 'Could not upload. Please try again.');
    }
    setUploading(false);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>📤 Upload Material</Text>
          <Text style={styles.pageSub}>Share study resources with your students</Text>
        </View>

        <Card>
          <Text style={styles.label}>Material Title *</Text>
          <TextInput
            style={styles.input} value={title} onChangeText={setTitle}
            placeholder="e.g. Grade 12 Maths Exam Notes" placeholderTextColor={Colors.muted}
          />

          <SectionHeader title="Subject" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
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

          <Text style={[styles.label, { marginTop: Spacing.md }]}>File *</Text>
          <Text style={styles.hint}>Accepted formats: PDF, DOC, DOCX, PPT, PPTX</Text>

          <TouchableOpacity style={styles.filePicker} onPress={pickFile}>
            {file ? (
              <>
                <Text style={styles.fileIcon}>✅</Text>
                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              </>
            ) : (
              <>
                <Text style={styles.fileIcon}>📁</Text>
                <Text style={styles.filePlaceholder}>Tap to select a file</Text>
              </>
            )}
          </TouchableOpacity>

          <Button label="Upload Material" onPress={handleUpload} loading={uploading} icon="📤" style={{ marginTop: Spacing.md }} />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.md, paddingBottom: 100 },
  pageHeader: { marginBottom: Spacing.md },
  pageTitle: { fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.black, color: Colors.primary, fontFamily: Typography.heading },
  pageSub: { fontSize: Typography.sizes.sm, color: Colors.textSub, marginTop: 4 },
  label: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.textSub, marginBottom: 6 },
  hint: { fontSize: Typography.sizes.xs, color: Colors.muted, marginBottom: 8 },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, padding: 12, fontSize: Typography.sizes.base, color: Colors.text, backgroundColor: Colors.bgSubtle, marginBottom: Spacing.md },
  chip: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8, backgroundColor: Colors.bgSubtle },
  chipIcon: { fontSize: 16 },
  chipLabel: { fontSize: Typography.sizes.sm, color: Colors.textSub },
  gradeRow: { flexDirection: 'row', gap: 8 },
  gradeBtn: { flex: 1, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, paddingVertical: 10, alignItems: 'center', backgroundColor: Colors.bgSubtle },
  gradeBtnActive: { borderColor: Colors.accent, backgroundColor: Colors.accent },
  gradeBtnText: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.muted },
  gradeBtnTextActive: { color: Colors.white },
  filePicker: {
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: Radius.md, padding: Spacing.lg, alignItems: 'center',
    backgroundColor: Colors.bgSubtle,
  },
  fileIcon: { fontSize: 32, marginBottom: 8 },
  fileName: { fontSize: Typography.sizes.base, color: Colors.text, fontWeight: Typography.weights.semibold, textAlign: 'center' },
  filePlaceholder: { fontSize: Typography.sizes.base, color: Colors.muted },
});
