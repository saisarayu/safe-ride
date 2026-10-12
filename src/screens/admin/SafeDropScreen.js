import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafety, calculateHaversineDistance } from '../../context/SafetyContext';

export default function SafeDropScreen() {
  const { safeDropLogs, overrideSafeDrop, addNotification } = useSafety();

  // Interactive Live Haversine Test Calculator
  const [testLat1, setTestLat1] = useState('12.9716');
  const [testLon1, setTestLon1] = useState('77.5946');
  const [testLat2, setTestLat2] = useState('12.9718');
  const [testLon2, setTestLon2] = useState('77.5948');

  const calcDist = calculateHaversineDistance(
    parseFloat(testLat1) || 0,
    parseFloat(testLon1) || 0,
    parseFloat(testLat2) || 0,
    parseFloat(testLon2) || 0
  );

  const isSafe = calcDist <= 100;

  const handleSimulateBreach = () => {
    setTestLat2('12.9735');
    setTestLon2('77.5969');
    addNotification({
      title: '⚠️ Geofence Deviation Flagged',
      message: 'Drop coordinates exceeded 100m perimeter safety radius. Incident logged for supervisor override.',
      type: 'sos',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerKicker}>ALGORITHMIC GEOFENCE VERIFICATION MATRIX</Text>
          <Text style={styles.headerTitle}>Safe-Drop Verification Engine</Text>
          <Text style={styles.headerSub}>
            Hardware-enforced student de-boarding verification using the Haversine great-circle distance algorithm.
            Threshold: ≤ 100 meters.
          </Text>
        </View>
        <TouchableOpacity style={styles.breachBtn} onPress={handleSimulateBreach}>
          <Text style={styles.breachBtnText}>⚠️ Test 185m Deviation Alert</Text>
        </TouchableOpacity>
      </View>

      {/* Interactive Haversine Calculator Cockpit */}
      <View style={styles.engineCard}>
        <View style={styles.engineHeader}>
          <View>
            <Text style={styles.engineTitle}>⚡ Real-Time Haversine Distance Engine</Text>
            <Text style={styles.engineSub}>
              d = 2R × arcsin(√[sin²(Δφ/2) + cos φ₁ · cos φ₂ · sin²(Δλ/2)])
            </Text>
          </View>
          <View
            style={[
              styles.verificationResultBadge,
              isSafe ? styles.badgeSafe : styles.badgeBreach,
            ]}
          >
            <Text style={styles.verificationResultText}>
              {isSafe ? '✅ WITHIN SAFE 100M PERIMETER' : '🚨 GEOFENCE BREACH DETECTED'}
            </Text>
          </View>
        </View>

        {/* Coordinate Inputs */}
        <View style={styles.coordsGrid}>
          <View style={styles.coordBox}>
            <Text style={styles.coordLabel}>POINT A: DESIGNATED STOP (LAT, LNG)</Text>
            <View style={styles.inputsRow}>
              <TextInput
                style={styles.coordInput}
                value={testLat1}
                onChangeText={setTestLat1}
                placeholder="Latitude"
                placeholderTextColor="#64748b"
              />
              <TextInput
                style={styles.coordInput}
                value={testLon1}
                onChangeText={setTestLon1}
                placeholder="Longitude"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>

          <View style={styles.coordBox}>
            <Text style={styles.coordLabel}>POINT B: ACTUAL BUS GPS TELEMETRY (LAT, LNG)</Text>
            <View style={styles.inputsRow}>
              <TextInput
                style={styles.coordInput}
                value={testLat2}
                onChangeText={setTestLat2}
                placeholder="Latitude"
                placeholderTextColor="#64748b"
              />
              <TextInput
                style={styles.coordInput}
                value={testLon2}
                onChangeText={setTestLon2}
                placeholder="Longitude"
                placeholderTextColor="#64748b"
              />
            </View>
          </View>
        </View>

        {/* Distance Gauge Meter */}
        <View style={styles.meterContainer}>
          <View style={styles.meterHeader}>
            <Text style={styles.meterLabel}>CALCULATED HAVERSINE DELTA:</Text>
            <Text style={[styles.meterVal, { color: isSafe ? '#34d399' : '#f87171' }]}>
              {calcDist} meters <Text style={styles.meterThreshold}>/ 100m threshold</Text>
            </Text>
          </View>
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(100, Math.round((calcDist / 200) * 100))}%`,
                  backgroundColor: isSafe ? '#10b981' : '#ef4444',
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Safe-Drop Verification Audit Logs Table */}
      <View style={styles.logsCard}>
        <View style={styles.logsHeader}>
          <View>
            <Text style={styles.logsTitle}>Historical Safe-Drop Audit Logs</Text>
            <Text style={styles.logsSub}>Cryptographically timestamped biometric and RFID handovers</Text>
          </View>
          <Text style={styles.logsCount}>{safeDropLogs.length} Verified Records</Text>
        </View>

        <View style={styles.logsTable}>
          {safeDropLogs.map((log) => (
            <View key={log.id} style={styles.logRow}>
              <View style={styles.logRowTop}>
                <View style={styles.studentCol}>
                  <Text style={styles.studentName}>{log.studentName}</Text>
                  <Text style={styles.studentMeta}>
                    {log.grade} • {log.busNumber} • {log.stopName}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    log.status === 'VERIFIED'
                      ? styles.statusVerified
                      : styles.statusOverridden,
                  ]}
                >
                  <Text style={styles.statusPillText}>{log.status}</Text>
                </View>
              </View>

              <View style={styles.logTelemetryRow}>
                <View style={styles.telemetryItem}>
                  <Text style={styles.telemetryKey}>HAVERSINE DELTA</Text>
                  <Text style={[styles.telemetryVal, { color: log.distanceMeters <= 100 ? '#34d399' : '#f87171' }]}>
                    {log.distanceMeters} meters
                  </Text>
                </View>
                <View style={styles.telemetryItem}>
                  <Text style={styles.telemetryKey}>TIME OF DROP</Text>
                  <Text style={styles.telemetryVal}>{log.timestamp}</Text>
                </View>
                <View style={styles.telemetryItem}>
                  <Text style={styles.telemetryKey}>GUARDIAN HANDOVER</Text>
                  <Text style={styles.telemetryVal}>{log.guardianName}</Text>
                </View>
                <View style={styles.telemetryItem}>
                  <Text style={styles.telemetryKey}>VERIFIED PROTOCOL</Text>
                  <Text style={styles.telemetryVal}>{log.verifiedBy}</Text>
                </View>
              </View>

              <View style={styles.logFooterRow}>
                <Text style={styles.logNotesText}>Audit Notes: {log.notes}</Text>
                {log.status !== 'VERIFIED' && (
                  <TouchableOpacity
                    style={styles.overrideBtn}
                    onPress={() => overrideSafeDrop(log.id, 'Principal Sharma authorized deviation')}
                  >
                    <Text style={styles.overrideBtnText}>Re-Authorize Override</Text>
                  </TouchableOpacity>
                )}
              </View>
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
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  headerLeft: {
    flex: 1,
    minWidth: 280,
  },
  headerKicker: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  headerTitle: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },
  headerSub: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  breachBtn: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  breachBtnText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '800',
  },
  engineCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 18,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  engineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    flexWrap: 'wrap',
    gap: 12,
  },
  engineTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
  },
  engineSub: {
    color: '#EA580C',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
    fontWeight: '700',
  },
  verificationResultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeSafe: {
    backgroundColor: '#FFEDD5',
  },
  badgeBreach: {
    backgroundColor: '#DCFCE7',
  },
  verificationResultText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  coordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 18,
  },
  coordBox: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 14,
  },
  coordLabel: {
    color: '#EA580C',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  coordInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  meterContainer: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 14,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  meterLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
  },
  meterVal: {
    fontSize: 15,
    fontWeight: '900',
  },
  meterThreshold: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  meterTrack: {
    height: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  logsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  logsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFEDD5',
    paddingBottom: 14,
  },
  logsTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
  },
  logsSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  logsCount: {
    color: '#FFFFFF',
    backgroundColor: '#FF6B00',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: '900',
  },
  logsTable: {
    gap: 12,
  },
  logRow: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 16,
  },
  logRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentCol: {
    flex: 1,
  },
  studentName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  studentMeta: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusVerified: {
    backgroundColor: '#FFEDD5',
  },
  statusOverridden: {
    backgroundColor: '#DCFCE7',
  },
  statusPillText: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  logTelemetryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  telemetryItem: {
    flex: 1,
    minWidth: 120,
  },
  telemetryKey: {
    color: '#EA580C',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  telemetryVal: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  logFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  logNotesText: {
    color: '#64748B',
    fontSize: 12,
    flex: 1,
    fontWeight: '600',
  },
  overrideBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  overrideBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
});

