import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafety } from '../../context/SafetyContext';
import { useAuth } from '../../context/AuthContext';

export default function StudentHomeScreen() {
  const { students, buses, addNotification } = useSafety();
  const { user } = useAuth();
  const [bufferRequested, setBufferRequested] = useState(false);

  const me = students.find((s) => s.id === (user.id || 'stud-1')) || students[0];
  const bus = buses.find((b) => b.id === me.busId) || buses[0];

  const handleRunningLate = () => {
    setBufferRequested(true);
    addNotification({
      title: 'Running Late Buffer Dispatched',
      message: `Driver ${bus.driver} alerted: ${me.name} requested 2-minute buffer at ${me.stopName}.`,
      type: 'info',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.headerKicker}>STUDENT TRANSIT COMPANION & PASS</Text>
          <Text style={styles.headerTitle}>Welcome, {me.name}!</Text>
          <Text style={styles.headerSub}>
            Your active digital school bus pass and morning route tracker.
          </Text>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>PASS ACTIVE 2026-27</Text>
        </View>
      </View>

      {/* Digital Holographic RFID Bus Pass */}
      <View style={styles.passCard}>
        <View style={styles.passHeader}>
          <View style={styles.passSchoolRow}>
            <Text style={styles.schoolLogo}>🏫</Text>
            <View>
              <Text style={styles.schoolName}>GREENWOOD INTERNATIONAL SCHOOL</Text>
              <Text style={styles.passType}>Official Digital Bus Transit ID</Text>
            </View>
          </View>
          <View style={styles.chipGraphic}>
            <Text style={styles.chipText}>💳 RFID</Text>
          </View>
        </View>

        <View style={styles.passBody}>
          <View style={styles.passAvatarBox}>
            <Text style={styles.passAvatarEmoji}>{me.avatar}</Text>
          </View>

          <View style={styles.passInfoCol}>
            <Text style={styles.passStudentName}>{me.name}</Text>
            <Text style={styles.passStudentGrade}>{me.grade} • Roll No: {me.rollNo}</Text>
            <View style={styles.passBadgeRow}>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeKey}>BUS UNIT</Text>
                <Text style={styles.badgeVal}>{me.busNumber}</Text>
              </View>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeKey}>BLOOD</Text>
                <Text style={[styles.badgeVal, { color: '#f87171' }]}>{me.bloodGroup}</Text>
              </View>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeKey}>STOP</Text>
                <Text style={styles.badgeVal}>{me.stopName.split(' ')[0]}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.passFooter}>
          <View>
            <Text style={styles.passCodeLabel}>ENCRYPTED RFID TRANSPONDER</Text>
            <Text style={styles.passCodeVal}>{me.rfidTag}</Text>
          </View>
          <View style={styles.qrSimulation}>
            <Text style={styles.qrText}>[ ▚▞ 13.56MHz ]</Text>
          </View>
        </View>
      </View>

      {/* Live Route Telemetry Status */}
      <View style={styles.journeyBox}>
        <View style={styles.journeyHeader}>
          <Text style={styles.journeyTitle}>Today's Bus Ride: {bus.name}</Text>
          <View style={styles.etaTag}>
            <Text style={styles.etaTagText}>ETA: ~{bus.etaMins} mins</Text>
          </View>
        </View>

        <Text style={styles.journeyDesc}>
          Currently approaching <Text style={{ color: '#ffffff', fontWeight: '700' }}>{bus.nextStop}</Text> at {bus.speed} km/h.
        </Text>

        <TouchableOpacity
          style={[styles.lateBtn, bufferRequested && styles.lateBtnDone]}
          onPress={handleRunningLate}
          activeOpacity={0.8}
        >
          <Text style={styles.lateBtnText}>
            {bufferRequested
              ? '✅ Driver Notified: 2 Min Buffer Approved'
              : '🏃 Running a little late? Request 2 Min Stop Buffer'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Safety Guidelines Card */}
      <View style={styles.safetyCard}>
        <Text style={styles.safetyCardTitle}>SafeRide Golden Safety Rules</Text>
        <View style={styles.rulesList}>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleEmoji}>🪑</Text>
            <Text style={styles.ruleText}>Always remain seated with seatbelts fastened while the bus is moving.</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleEmoji}>🚪</Text>
            <Text style={styles.ruleText}>Wait for the bus to come to a complete stop before scanning your RFID pass.</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleEmoji}>🆘</Text>
            <Text style={styles.ruleText}>In case of an emergency, notify Bus Attendant {bus.attendant} immediately.</Text>
          </View>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  headerCard: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
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
  statusPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusPillText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  passCard: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    paddingBottom: 14,
    marginBottom: 16,
  },
  passSchoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  schoolLogo: {
    fontSize: 24,
  },
  schoolName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  passType: {
    color: '#9ca3af',
    fontSize: 10,
  },
  chipGraphic: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#38bdf8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '900',
  },
  passBody: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  passAvatarBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  passAvatarEmoji: {
    fontSize: 34,
  },
  passInfoCol: {
    flex: 1,
  },
  passStudentName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  passStudentGrade: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  passBadgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badgeItem: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeKey: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: '800',
  },
  badgeVal: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  passFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingTop: 14,
  },
  passCodeLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  passCodeVal: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  qrSimulation: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qrText: {
    color: '#94a3b8',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  journeyBox: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  journeyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  etaTag: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  etaTagText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  journeyDesc: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 14,
  },
  lateBtn: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  lateBtnDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  lateBtnText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '800',
  },
  safetyCard: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
  },
  safetyCardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  rulesList: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#131b2e',
    borderRadius: 10,
    padding: 12,
  },
  ruleEmoji: {
    fontSize: 20,
  },
  ruleText: {
    color: '#cbd5e1',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
});

