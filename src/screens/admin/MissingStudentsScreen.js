import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafety } from '../../context/SafetyContext';

export default function MissingStudentsScreen() {
  const { missingAlerts, resolveMissingAlert, addNotification, students } = useSafety();
  const [activeAlerts, setActiveAlerts] = useState(missingAlerts);

  const handleSimulateNewAlert = () => {
    const candidate = students.find((s) => s.status === 'waiting') || students[1];
    const newAlert = {
      id: `miss-${Date.now()}`,
      studentId: candidate.id,
      studentName: candidate.name,
      grade: candidate.grade,
      busNumber: candidate.busNumber,
      stopName: candidate.stopName,
      scheduledTime: '07:35 AM',
      severity: 'Critical',
      timestamp: 'Just now',
      guardianPhone: candidate.guardianPhone,
      guardianName: candidate.guardianName,
      status: 'Escalation Level 2: Parent Dial In Progress',
      actionTaken: 'Automated AI Voice Call Dispatched',
    };
    setActiveAlerts((prev) => [newAlert, ...prev]);
    addNotification({
      title: `🚨 MISSING STUDENT ALERT: ${candidate.name}`,
      message: `${candidate.name} did not tap RFID at ${candidate.stopName}. Automated escalation protocol triggered.`,
      type: 'sos',
    });
  };

  const handleResolve = (alertId) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== alertId));
    resolveMissingAlert(alertId);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Banner */}
      <View style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerKicker}>CRITICAL GUARDIAN SAFEGUARD ENGINE</Text>
          <Text style={styles.headerTitle}>Missing / Delayed Student Console</Text>
          <Text style={styles.headerSub}>
            Autonomous detection when students fail to tap RFID within 180s of bus departure from designated stops.
          </Text>
        </View>
        <TouchableOpacity style={styles.testAlertBtn} onPress={handleSimulateNewAlert}>
          <Text style={styles.testAlertBtnText}>⚠️ Simulate Missing Detection</Text>
        </TouchableOpacity>
      </View>

      {/* Escalation Status Summary */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{activeAlerts.length}</Text>
          <Text style={styles.summaryLabel}>Active Escalations</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: '#34d399' }]}>100%</Text>
          <Text style={styles.summaryLabel}>SMS Delivery Rate</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: '#38bdf8' }]}>&lt; 90s</Text>
          <Text style={styles.summaryLabel}>Avg Response Time</Text>
        </View>
      </View>

      {/* Alerts Stream */}
      {activeAlerts.length === 0 ? (
        <View style={styles.zeroStateCard}>
          <Text style={styles.zeroStateEmoji}>🛡️</Text>
          <Text style={styles.zeroStateTitle}>Zero Active Missing Student Alerts</Text>
          <Text style={styles.zeroStateSub}>
            All students are confirmed either aboard designated transit, safely dropped off, or logged with excused parental absences.
          </Text>
          <TouchableOpacity style={styles.zeroStateBtn} onPress={handleSimulateNewAlert}>
            <Text style={styles.zeroStateBtnText}>Test Detection Pipeline →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.alertsList}>
          {activeAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <View style={styles.alertTop}>
                <View style={styles.alertHeaderRow}>
                  <Text style={styles.alertTitleBadge}>CRITICAL PROTOCOL</Text>
                  <Text style={styles.alertTimeText}>{alert.timestamp}</Text>
                </View>
                <View style={styles.severityPill}>
                  <Text style={styles.severityText}>{alert.severity}</Text>
                </View>
              </View>

              <View style={styles.studentInfoRow}>
                <Text style={styles.studentAvatar}>🎒</Text>
                <View>
                  <Text style={styles.studentNameText}>{alert.studentName}</Text>
                  <Text style={styles.studentSubText}>
                    {alert.grade} • Assigned: {alert.busNumber}
                  </Text>
                </View>
              </View>

              <View style={styles.alertDetailsGrid}>
                <View style={styles.detailBox}>
                  <Text style={styles.detailBoxLabel}>MISSED DESIGNATED STOP</Text>
                  <Text style={styles.detailBoxVal}>{alert.stopName}</Text>
                  <Text style={styles.detailBoxSub}>Scheduled at: {alert.scheduledTime}</Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailBoxLabel}>GUARDIAN CONTACT</Text>
                  <Text style={styles.detailBoxVal}>{alert.guardianName}</Text>
                  <Text style={[styles.detailBoxSub, { color: '#38bdf8' }]}>{alert.guardianPhone}</Text>
                </View>
              </View>

              {/* Protocol Escalation Steps */}
              <View style={styles.protocolBox}>
                <Text style={styles.protocolLabel}>AUTOMATED INCIDENT PROGRESSION:</Text>
                <View style={styles.stepsRow}>
                  <View style={styles.stepItemActive}>
                    <Text style={styles.stepText}>1. Automated SMS Dispatched (Sent)</Text>
                  </View>
                  <View style={styles.stepItemActive}>
                    <Text style={styles.stepText}>2. Driver Hold Checked (No Scan)</Text>
                  </View>
                  <View style={styles.stepItemPending}>
                    <Text style={styles.stepTextPending}>3. Campus Security Call (In Progress)</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.alertActionButtons}>
                <TouchableOpacity
                  style={styles.resolvePrimaryBtn}
                  onPress={() => handleResolve(alert.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.resolvePrimaryBtnText}>
                    ✅ Confirm Safe / Mark Resolved
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.callGuardianBtn}
                  onPress={() => {
                    addNotification({
                      title: `Dialing Guardian`,
                      message: `Initiating high-priority line to ${alert.guardianName} (${alert.guardianPhone})...`,
                      type: 'info',
                    });
                  }}
                >
                  <Text style={styles.callGuardianBtnText}>📞 Call Guardian Direct</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
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
    maxWidth: 1200,
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
  headerLeft: {
    flex: 1,
    minWidth: 280,
  },
  headerKicker: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  testAlertBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  testAlertBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryVal: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  summaryLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#1e293b',
  },
  zeroStateCard: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 18,
    padding: 40,
    alignItems: 'center',
  },
  zeroStateEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  zeroStateTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  zeroStateSub: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 500,
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 20,
  },
  zeroStateBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  zeroStateBtnText: {
    color: '#60a5fa',
    fontSize: 13,
    fontWeight: '700',
  },
  alertsList: {
    gap: 16,
  },
  alertCard: {
    backgroundColor: '#120f1e',
    borderWidth: 1.5,
    borderColor: '#14532D',
    borderRadius: 18,
    padding: 20,
  },
  alertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitleBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  alertTimeText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  severityPill: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  severityText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  studentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  studentAvatar: {
    fontSize: 28,
  },
  studentNameText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  studentSubText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  alertDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#0a0814',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  detailBox: {
    flex: 1,
    minWidth: 200,
  },
  detailBoxLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  detailBoxVal: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },
  detailBoxSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  protocolBox: {
    marginBottom: 18,
  },
  protocolLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  stepsRow: {
    gap: 4,
  },
  stepItemActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  stepText: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '600',
  },
  stepItemPending: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  stepTextPending: {
    color: '#facc15',
    fontSize: 11,
    fontWeight: '600',
  },
  alertActionButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  resolvePrimaryBtn: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  resolvePrimaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  callGuardianBtn: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  callGuardianBtnText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '700',
  },
});

