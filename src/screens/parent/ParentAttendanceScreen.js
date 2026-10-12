import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafety } from '../../context/SafetyContext';
import { useAuth } from '../../context/AuthContext';

export default function ParentAttendanceScreen() {
  const { addNotification, markStudentAbsent } = useSafety();
  const { user } = useAuth();
  const [absenceReason, setAbsenceReason] = useState('Medical appointment');
  const [reported, setReported] = useState(false);

  const pastLogs = [
    { date: 'Today (Oct 10, 2026)', morning: '07:25 AM', afternoon: 'Pending', status: 'VERIFIED ON-BOARD', dist: '18m', notes: 'RFID boarded Maple Grove Ave' },
    { date: 'Yesterday (Oct 09, 2026)', morning: '07:24 AM', afternoon: '03:42 PM', status: 'COMPLETED SAFE', dist: '14m', notes: 'Safe-drop confirmed to Mother' },
    { date: 'Wednesday (Oct 08, 2026)', morning: '07:26 AM', afternoon: '03:45 PM', status: 'COMPLETED SAFE', dist: '12m', notes: 'Safe-drop confirmed within 100m' },
    { date: 'Tuesday (Oct 07, 2026)', morning: '07:22 AM', afternoon: '03:40 PM', status: 'COMPLETED SAFE', dist: '20m', notes: 'Normal journey flow' },
    { date: 'Monday (Oct 06, 2026)', morning: 'Excused', afternoon: 'Excused', status: 'EXCUSED ABSENT', dist: '-', notes: 'Parent notified illness' },
  ];

  const handleReportAbsence = () => {
    markStudentAbsent(user.childId || 'stud-1', absenceReason);
    setReported(true);
    addNotification({
      title: 'Absence Notice Dispatched',
      message: `Excused absence registered for tomorrow (${absenceReason}). Driver manifest updated.`,
      type: 'info',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.headerKicker}>ATTENDANCE COMPLIANCE & SAFETY AUDIT</Text>
          <Text style={styles.headerTitle}>Journey History & Absence Desk</Text>
          <Text style={styles.headerSub}>
            Complete cryptographic RFID attendance timeline and pre-departure absence notification.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.certBtn}
          onPress={() => {
            addNotification({
              title: 'Safety Certificate Exported',
              message: 'Monthly School Bus Safety & Transit Pass PDF saved.',
              type: 'info',
            });
          }}
        >
          <Text style={styles.certBtnText}>📜 Export Monthly Safety Record</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Stats */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiBox}>
          <Text style={styles.kpiVal}>98.2%</Text>
          <Text style={styles.kpiLabel}>Monthly Attendance</Text>
        </View>
        <View style={styles.kpiBox}>
          <Text style={[styles.kpiVal, { color: '#34d399' }]}>100%</Text>
          <Text style={styles.kpiLabel}>Safe-Drop Compliance</Text>
        </View>
        <View style={styles.kpiBox}>
          <Text style={[styles.kpiVal, { color: '#38bdf8' }]}>15.2m</Text>
          <Text style={styles.kpiLabel}>Avg Geofence Proximity</Text>
        </View>
      </View>

      {/* Pre-Departure Absence Request Tool */}
      <View style={styles.absenceCard}>
        <Text style={styles.absenceTitle}>⚡ Notify Bus Pilot of Absence for Tomorrow</Text>
        <Text style={styles.absenceSub}>
          Submitting early prevents driver from holding the bus at your stop and triggering false missing alerts:
        </Text>

        <View style={styles.reasonsRow}>
          {['Medical appointment', 'Family travel', 'Personal illness', 'Sports tournament'].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.reasonBtn, absenceReason === r && styles.reasonBtnActive]}
              onPress={() => setAbsenceReason(r)}
            >
              <Text style={[styles.reasonText, absenceReason === r && styles.reasonTextActive]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitAbsenceBtn, reported && { backgroundColor: '#10b981' }]}
          onPress={handleReportAbsence}
          activeOpacity={0.8}
        >
          <Text style={styles.submitAbsenceBtnText}>
            {reported ? '✅ Absence Confirmed With School & Driver' : 'Submit Absence Notice'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Past Journey Logs */}
      <View style={styles.logsCard}>
        <Text style={styles.logsCardTitle}>Verified Transit History (Last 5 Days)</Text>
        <View style={styles.logsList}>
          {pastLogs.map((log, i) => (
            <View key={i} style={styles.logRow}>
              <View style={styles.logRowTop}>
                <Text style={styles.logDate}>{log.date}</Text>
                <View
                  style={[
                    styles.logStatusPill,
                    log.status.includes('SAFE') && { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                    log.status.includes('BOARD') && { backgroundColor: 'rgba(56, 189, 248, 0.2)' },
                    log.status.includes('ABSENT') && { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                  ]}
                >
                  <Text style={styles.logStatusText}>{log.status}</Text>
                </View>
              </View>

              <View style={styles.logMetaRow}>
                <Text style={styles.logMetaItem}>Morning Pickup: <Text style={styles.metaHighlight}>{log.morning}</Text></Text>
                <Text style={styles.logMetaItem}>Afternoon Drop: <Text style={styles.metaHighlight}>{log.afternoon}</Text></Text>
                <Text style={styles.logMetaItem}>Geofence Delta: <Text style={{ color: '#34d399', fontWeight: '700' }}>{log.dist}</Text></Text>
              </View>

              <Text style={styles.logNotes}>Sensor Record: {log.notes}</Text>
            </View>
          ))}
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
    color: '#34d399',
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
  certBtn: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  certBtnText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
  },
  kpiBox: {
    flex: 1,
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  kpiVal: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  kpiLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  absenceCard: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },
  absenceTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  absenceSub: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 14,
  },
  reasonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  reasonBtn: {
    backgroundColor: '#131b2e',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reasonBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  reasonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  reasonTextActive: {
    color: '#ffffff',
  },
  submitAbsenceBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitAbsenceBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  logsCard: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 18,
    padding: 20,
  },
  logsCardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  logsList: {
    gap: 12,
  },
  logRow: {
    backgroundColor: '#131b2e',
    borderRadius: 12,
    padding: 14,
  },
  logRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logDate: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  logStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  logStatusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  logMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 6,
  },
  logMetaItem: {
    color: '#94a3b8',
    fontSize: 12,
  },
  metaHighlight: {
    color: '#ffffff',
    fontWeight: '600',
  },
  logNotes: {
    color: '#64748b',
    fontSize: 11,
  },
});

