import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafety } from '../../context/SafetyContext';

export default function NotificationsScreen() {
  const { notifications, markAllNotificationsRead, addNotification } = useSafety();
  const [filterType, setFilterType] = useState('all');

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getEmoji = (type) => {
    switch (type) {
      case 'sos': return '🚨';
      case 'safe_drop': return '🛡️';
      case 'boarding': return '📶';
      default: return '📡';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.headerKicker}>REAL-TIME EVENT LOGS & DISPATCH AUDIT</Text>
          <Text style={styles.headerTitle}>Safety Notification Center</Text>
          <Text style={styles.headerSub}>
            Autonomous telemetry updates, RFID gate logs, geofence audits, and panic broadcasts.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.markReadBtn}
          onPress={markAllNotificationsRead}
          activeOpacity={0.8}
        >
          <Text style={styles.markReadBtnText}>✓ Mark All Read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {[
          { key: 'all', label: `All (${notifications.length})` },
          { key: 'sos', label: 'Critical SOS' },
          { key: 'safe_drop', label: 'Safe-Drop Audits' },
          { key: 'boarding', label: 'RFID Boardings' },
          { key: 'system', label: 'Telemetry Grid' },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filterType === f.key && styles.filterChipActive]}
            onPress={() => setFilterType(f.key)}
          >
            <Text style={[styles.filterChipText, filterType === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications List */}
      <View style={styles.notifList}>
        {filtered.map((item) => (
          <View key={item.id} style={[styles.notifCard, item.unread && styles.notifCardUnread]}>
            <View style={styles.notifEmojiBox}>
              <Text style={styles.notifEmoji}>{getEmoji(item.type)}</Text>
            </View>

            <View style={styles.notifContent}>
              <View style={styles.notifTopRow}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              <Text style={styles.notifMessage}>{item.message}</Text>
            </View>

            {item.unread && <View style={styles.unreadDot} />}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b13',
  },
  content: {
    padding: 20,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  headerCard: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  headerKicker: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  markReadBtn: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  markReadBtnText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  notifList: {
    gap: 12,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  notifCardUnread: {
    borderColor: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  notifEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#131b2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifEmoji: {
    fontSize: 22,
  },
  notifContent: {
    flex: 1,
  },
  notifTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  notifTime: {
    color: '#64748b',
    fontSize: 11,
  },
  notifMessage: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38bdf8',
  },
});

