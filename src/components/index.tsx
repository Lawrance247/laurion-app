// src/components/index.tsx
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ViewStyle, TextStyle,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../theme';

// ── CARD ─────────────────────────────────────────────────────────────────────
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ── BUTTON ───────────────────────────────────────────────────────────────────
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}
export function Button({ label, onPress, variant = 'primary', loading, disabled, style, textStyle, icon }: ButtonProps) {
  const bg = variant === 'primary' ? Colors.accent
    : variant === 'secondary' ? Colors.primary
    : variant === 'danger' ? Colors.error
    : 'transparent';
  const border = variant === 'ghost' ? Colors.border : undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.btn, { backgroundColor: bg, borderColor: border, borderWidth: variant === 'ghost' ? 1.5 : 0, opacity: disabled ? 0.5 : 1 }, style]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? Colors.text : Colors.white} size="small" />
      ) : (
        <Text style={[styles.btnText, { color: variant === 'ghost' ? Colors.text : Colors.white }, textStyle]}>
          {icon ? `${icon}  ` : ''}{label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ── BADGE ────────────────────────────────────────────────────────────────────
export function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: (color || Colors.accent) + '22' }]}>
      <Text style={[styles.badgeText, { color: color || Colors.accent }]}>{label}</Text>
    </View>
  );
}

// ── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({ icon, title, subtitle, onPress }: {
  icon: string; title: string; subtitle?: string; onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.statCard} activeOpacity={0.85}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle ? <Text style={styles.statSub}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySub}>{subtitle}</Text> : null}
    </View>
  );
}

// ── SECTION HEADER ─────────────────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }: {
  title: string; action?: string; onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ── AVATAR ───────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{name[0]?.toUpperCase()}</Text>
    </View>
  );
}

// ── TASK CARD ────────────────────────────────────────────────────────────────
export function TaskCard({ task, overdue, onDelete }: {
  task: { id: number; title: string; description?: string; date: string };
  overdue?: boolean;
  onDelete?: (id: number) => void;
}) {
  const d = new Date(task.date);
  const dateStr = isNaN(d.getTime()) ? task.date : d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.taskCard, overdue && styles.taskOverdue]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        {task.description ? <Text style={styles.taskDesc}>{task.description}</Text> : null}
        <Text style={[styles.taskTime, overdue && { color: Colors.error }]}>{overdue ? '⏰ ' : '📅 '}{dateStr}</Text>
      </View>
      {onDelete ? (
        <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteBtn}>
          <Text style={{ color: Colors.error, fontSize: 16 }}>🗑</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ── MATERIAL ROW ──────────────────────────────────────────────────────────────
export function MaterialRow({ item, rank, onPress }: {
  item: { id: number; title: string; downloads: number; filename: string };
  rank?: number;
  onPress: () => void;
}) {
  const ext = item.filename?.split('.').pop()?.toLowerCase() || '';
  const icon = ext === 'pdf' ? '📕' : ['doc', 'docx'].includes(ext) ? '📄' : ['ppt', 'pptx'].includes(ext) ? '📊' : '📁';

  return (
    <TouchableOpacity style={styles.matRow} onPress={onPress} activeOpacity={0.8}>
      {rank !== undefined ? (
        <View style={styles.matRank}><Text style={styles.matRankText}>{rank}</Text></View>
      ) : (
        <Text style={{ fontSize: 22 }}>{icon}</Text>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.matTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.matMeta}>⬇ {item.downloads} downloads</Text>
      </View>
      <Text style={styles.matAction}>View →</Text>
    </TouchableOpacity>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  btn: {
    borderRadius: Radius.md,
    paddingVertical: 13,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnText: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 0.3,
  },
  badge: {
    borderRadius: Radius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    flex: 1,
    margin: 4,
    ...Shadow.sm,
  },
  statIcon: { fontSize: 28, marginBottom: 6 },
  statTitle: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.text, textAlign: 'center' },
  statSub: { fontSize: Typography.sizes.xs, color: Colors.muted, textAlign: 'center', marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyTitle: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.semibold, color: Colors.text },
  emptySub: { fontSize: Typography.sizes.sm, color: Colors.muted, marginTop: 4, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.text },
  sectionAction: { fontSize: Typography.sizes.sm, color: Colors.accent, fontWeight: Typography.weights.semibold },
  avatar: {
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Colors.white, fontWeight: Typography.weights.black },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSubtle,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
    alignItems: 'flex-start',
  },
  taskOverdue: { borderLeftColor: Colors.error, backgroundColor: '#fff5f5' },
  taskTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.text },
  taskDesc: { fontSize: Typography.sizes.sm, color: Colors.textSub, marginTop: 2 },
  taskTime: { fontSize: Typography.sizes.xs, color: Colors.muted, marginTop: 4 },
  deleteBtn: { padding: 4, marginLeft: 8 },
  matRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: Spacing.md,
    backgroundColor: Colors.bgSubtle,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  matRank: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  matRankText: { color: Colors.white, fontSize: 12, fontWeight: Typography.weights.black },
  matTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.text },
  matMeta: { fontSize: Typography.sizes.xs, color: Colors.muted, marginTop: 2 },
  matAction: { fontSize: Typography.sizes.sm, color: Colors.accent, fontWeight: Typography.weights.semibold },
});
