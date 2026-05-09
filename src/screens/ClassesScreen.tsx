// src/screens/ClassesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Linking, Alert, RefreshControl,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow, SUBJECTS, GRADES } from '../theme';
import { Card, EmptyState, MaterialRow, SectionHeader } from '../components';
import { getMaterials, getDownloadUrl, Material } from '../services/api';

export default function ClassesScreen({ route }: any) {
  const session = route?.params?.session || {};
  const [selectedGrade, setSelectedGrade] = useState<number>(12);
  const [selectedSubject, setSelectedSubject] = useState<string>('math');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const mats = await getMaterials(selectedGrade, selectedSubject);
      setMaterials(mats);
    } catch (_) {}
    setLoading(false);
  }

  useEffect(() => { load(); }, [selectedGrade, selectedSubject]);

  function handleOpen(item: Material) {
    const url = getDownloadUrl(item.id);
    Alert.alert(item.title, `Open this ${item.filename.split('.').pop()?.toUpperCase()} file?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open', onPress: () => Linking.openURL(url) },
    ]);
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={Colors.accent} />}
    >

      {/* Page header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>📚 Classes</Text>
        <Text style={styles.pageSub}>Browse study materials by grade & subject</Text>
      </View>

      {/* Grade selector */}
      <Card>
        <SectionHeader title="Select Grade" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
          {GRADES.map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.gradeChip, selectedGrade === g && styles.gradeChipActive]}
              onPress={() => setSelectedGrade(g)}
            >
              <Text style={[styles.gradeChipText, selectedGrade === g && styles.gradeChipTextActive]}>
                Grade {g}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Card>

      {/* Subject grid */}
      <Card>
        <SectionHeader title="Select Subject" />
        <View style={styles.subjectGrid}>
          {Object.entries(SUBJECTS).map(([code, info]) => (
            <TouchableOpacity
              key={code}
              style={[styles.subjectCard, selectedSubject === code && { borderColor: info.color, backgroundColor: info.color + '15' }]}
              onPress={() => setSelectedSubject(code)}
            >
              <Text style={styles.subjectIcon}>{info.icon}</Text>
              <Text style={[styles.subjectLabel, selectedSubject === code && { color: info.color, fontWeight: Typography.weights.bold }]}>
                {info.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Materials */}
      <Card>
        <SectionHeader
          title={`${SUBJECTS[selectedSubject]?.icon} Grade ${selectedGrade} — ${SUBJECTS[selectedSubject]?.label}`}
        />
        {loading ? (
          <Text style={styles.loadingText}>Loading materials...</Text>
        ) : materials.length > 0 ? (
          materials.map(m => <MaterialRow key={m.id} item={m} onPress={() => handleOpen(m)} />)
        ) : (
          <EmptyState icon="📭" title="No materials yet" subtitle="Check back later — teachers upload regularly." />
        )}
      </Card>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: Spacing.md, paddingBottom: 100 },
  pageHeader: { marginBottom: Spacing.md },
  pageTitle: { fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.black, color: Colors.primary, fontFamily: Typography.heading },
  pageSub: { fontSize: Typography.sizes.sm, color: Colors.textSub, marginTop: 4 },
  gradeChip: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.full,
    paddingVertical: 8, paddingHorizontal: 18, marginHorizontal: 4,
    backgroundColor: Colors.bgSubtle,
  },
  gradeChipActive: { borderColor: Colors.accent, backgroundColor: Colors.accent },
  gradeChipText: { fontSize: Typography.sizes.base, color: Colors.textSub, fontWeight: Typography.weights.medium },
  gradeChipTextActive: { color: Colors.white, fontWeight: Typography.weights.bold },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  subjectCard: {
    width: '46%', borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.md, padding: 14, alignItems: 'center',
    backgroundColor: Colors.bgSubtle,
  },
  subjectIcon: { fontSize: 28, marginBottom: 6 },
  subjectLabel: { fontSize: Typography.sizes.sm, color: Colors.textSub, textAlign: 'center', fontWeight: Typography.weights.medium },
  loadingText: { textAlign: 'center', color: Colors.muted, padding: Spacing.md },
});
