import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafety } from '../../context/SafetyContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardScreen({ onNavigate }) {
  const {
    buses,
    students,
    routes,
    safeDropLogs,
    missingAlerts,
    emergencies,
    activeSOS,
    advanceSimulation,
    triggerSOS,
    simulationTick,
    resolveMissingAlert,
  } = useSafety();
  const { user } = useAuth();

  const totalCapacity = buses.reduce((acc, b) => acc + b.capacity, 0);
  const totalOccupancy = buses.reduce((acc, b) => acc + b.currentOccupancy, 0);
  const boardedCount = students.filter((s) => s.status === 'boarded').length;
  const safeDroppedCount = students.filter((s) => s.status === 'safe_dropped').length;
  const waitingCount = students.filter((s) => s.status === 'waiting').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome & Command Center Header */}
      <View style={styles.heroBanner}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroKicker}>MISSION CONTROL COMMAND CENTER</Text>
          <Text style={styles.heroTitle}>Autonomous Fleet & Safe-Drop Grid</Text>
          <Text style={styles.heroSubtitle}>
            Live monitoring for {buses.length} active routes across Greenwood District.
            GPS telemetry synchronized.
          </Text>
        </View>
        <View style={styles.heroActions}>
          <TouchableOpacity
            style={styles.simStepButton}
            onPress={advanceSimulation}
            activeOpacity={0.8}
          >
            <Text style={styles.simStepButtonIcon}>⏩</Text>
            <View>
              <Text style={styles.simStepButtonTitle}>Advance Route Sim</Text>
              <Text style={styles.simStepButtonSub}>Cycle #{simulationTick}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sosQuickBtn, activeSOS && styles.sosQuickBtnActive]}
            onPress={() => triggerSOS('System Test Panic Dispatch', 'bus-1')}
            activeOpacity={0.8}
          >
            <Text style={styles.sosQuickBtnText}>
              {activeSOS ? '🚨 SOS ACTIVE' : '⚠️ Test SOS Trigger'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* KPI Stats Grid */}
      <View style={styles.kpiGrid}>
        <View style={[styles.kpiCard, { borderColor: '#16A34A' }]}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiLabel}>ACTIVE FLEET</Text>
            <Text style={[styles.kpiBadge, { backgroundColor: '#DCFCE7', color: '#16A34A' }]}>100% ONLINE</Text>
          </View>
          <Text style={styles.kpiValue}>{buses.length} <Text style={styles.kpiUnit}>Buses</Text></Text>
          <Text style={styles.kpiSub}>All GPS transponders reporting</Text>
          <View style={styles.kpiProgressTrack}>
            <View style={[styles.kpiProgressBar, { width: '100%', backgroundColor: '#16A34A' }]} />
          </View>
        </View>

        <View style={[styles.kpiCard, { borderColor: '#FF6B00' }]}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiLabel}>PASSENGERS EN ROUTE</Text>
            <Text style={[styles.kpiBadge, { backgroundColor: '#FFEDD5', color: '#EA580C' }]}>
              {boardedCount} Boarded
            </Text>
          </View>
          <Text style={styles.kpiValue}>
            {totalOccupancy} <Text style={styles.kpiUnit}>/ {totalCapacity} Seats</Text>
          </Text>
          <Text style={styles.kpiSub}>{safeDroppedCount} Verified Dropped • {waitingCount} Waiting</Text>
          <View style={styles.kpiProgressTrack}>
            <View
              style={[
                styles.kpiProgressBar,
                { width: `${Math.round((totalOccupancy / totalCapacity) * 100)}%`, backgroundColor: '#FF6B00' },
              ]}
            />
          </View>
        </View>

        <View style={[styles.kpiCard, { borderColor: '#EA580C' }]}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiLabel}>SAFE-DROP INTEGRITY</Text>
            <Text style={[styles.kpiBadge, { backgroundColor: '#FFEDD5', color: '#C2410C' }]}>
              99.8% GEOFENCE
            </Text>
          </View>
          <Text style={styles.kpiValue}>{safeDropLogs.length} <Text style={styles.kpiUnit}>Audits</Text></Text>
          <Text style={styles.kpiSub}>Haversine perimeter verification active</Text>
          <View style={styles.kpiProgressTrack}>
            <View style={[styles.kpiProgressBar, { width: '99%', backgroundColor: '#EA580C' }]} />
          </View>
        </View>

        <View style={[styles.kpiCard, { borderColor: activeSOS ? '#16A34A' : '#FF6B00' }]}>
          <View style={styles.kpiTop}>
            <Text style={styles.kpiLabel}>EMERGENCY MATRIX</Text>
            <Text
              style={[
                styles.kpiBadge,
                {
                  backgroundColor: activeSOS ? '#DCFCE7' : '#FFEDD5',
                  color: activeSOS ? '#16A34A' : '#EA580C',
                },
              ]}
            >
              {activeSOS ? 'DISPATCH ON' : 'STANDBY'}
            </Text>
          </View>
          <Text style={styles.kpiValue}>
            {emergencies.filter((e) => e.status !== 'RESOLVED & SECURED').length}{' '}
            <Text style={styles.kpiUnit}>Active</Text>
          </Text>
          <Text style={styles.kpiSub}>
            {missingAlerts.length} Missing Student alerts pending
          </Text>
          <View style={styles.kpiProgressTrack}>
            <View
              style={[
                styles.kpiProgressBar,
                {
                  width: activeSOS ? '100%' : '20%',
                  backgroundColor: activeSOS ? '#16A34A' : '#FF6B00',
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Main Grid: Left Fleet Telemetry & Right Live Action Alerts */}
      <View style={styles.dualSection}>
        {/* Left Column: Real-Time Fleet Matrix */}
        <View style={styles.leftColumn}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Real-Time Fleet Telemetry</Text>
              <Text style={styles.sectionDesc}>Active transit corridors and vehicle health</Text>
            </View>
            <TouchableOpacity
              style={styles.actionLinkBtn}
              onPress={() => onNavigate && onNavigate('tracking')}
            >
              <Text style={styles.actionLinkText}>Launch Live Radar Map →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.busCardsList}>
            {buses.map((bus) => {
              const route = routes.find((r) => r.id === bus.routeId);
              const occPercent = Math.round((bus.currentOccupancy / bus.capacity) * 100);
              return (
                <View key={bus.id} style={styles.busTelemetryCard}>
                  <View style={styles.busCardTop}>
                    <View style={styles.busNameCol}>
                      <View style={styles.busPlateBadge}>
                        <Text style={styles.busPlateText}>{bus.number}</Text>
                      </View>
                      <Text style={styles.busNickName}>{bus.name} ({bus.regNo})</Text>
                    </View>
                    <View style={styles.busStatusPill}>
                      <View style={styles.greenPulse} />
                      <Text style={styles.busStatusText}>{bus.status}</Text>
                    </View>
                  </View>

                  <View style={styles.busMetricsRow}>
                    <View style={styles.busMetricItem}>
                      <Text style={styles.busMetricLabel}>CURRENT SPEED</Text>
                      <Text style={styles.busMetricVal}>{bus.speed} km/h</Text>
                    </View>
                    <View style={styles.busMetricItem}>
                      <Text style={styles.busMetricLabel}>NEXT DESIGNATED STOP</Text>
                      <Text style={styles.busMetricVal} numberOfLines={1}>{bus.nextStop}</Text>
                    </View>
                    <View style={styles.busMetricItem}>
                      <Text style={styles.busMetricLabel}>STOP ETA</Text>
                      <Text style={[styles.busMetricVal, { color: '#38bdf8' }]}>
                        {bus.etaMins} mins
                      </Text>
                    </View>
                    <View style={styles.busMetricItem}>
                      <Text style={styles.busMetricLabel}>FUEL / BATT</Text>
                      <Text style={styles.busMetricVal}>{bus.fuel}% / {bus.battery}%</Text>
                    </View>
                  </View>

                  {/* Route progress */}
                  <View style={styles.busProgressContainer}>
                    <View style={styles.busProgressLabelRow}>
                      <Text style={styles.busRouteName}>{route?.name} • Stop {bus.currentStopIndex + 1} of {route?.stops.length}</Text>
                      <Text style={styles.busOccupancyText}>Occupancy: {bus.currentOccupancy}/{bus.capacity} ({occPercent}%)</Text>
                    </View>
                    <View style={styles.busProgressBarBg}>
                      <View
                        style={[
                          styles.busProgressBarFill,
                          {
                            width: `${Math.min(100, occPercent)}%`,
                            backgroundColor: occPercent > 85 ? '#f59e0b' : '#3b82f6',
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Crew row & quick actions */}
                  <View style={styles.busFooterRow}>
                    <Text style={styles.driverText}>
                      Pilot: <Text style={{ color: '#ffffff', fontWeight: '700' }}>{bus.driver}</Text> ({bus.driverPhone})
                    </Text>
                    <TouchableOpacity
                      style={styles.busTrackBtn}
                      onPress={() => onNavigate && onNavigate('tracking')}
                    >
                      <Text style={styles.busTrackBtnText}>Track Bus 📡</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Right Column: Mission Alerts & Safe-Drop Feed */}
        <View style={styles.rightColumn}>
          {/* Missing Student Alerts Card */}
          <View style={styles.panelCard}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>⚠️ Missing / Delayed Boarding</Text>
              <Text style={styles.panelCount}>{missingAlerts.length} Active</Text>
            </View>

            {missingAlerts.length === 0 ? (
              <View style={styles.emptyNotice}>
                <Text style={styles.emptyNoticeText}>✅ All students accounted for on designated routes.</Text>
              </View>
            ) : (
              missingAlerts.map((alert) => (
                <View key={alert.id} style={styles.alertCard}>
                  <View style={styles.alertTop}>
                    <Text style={styles.alertStudent}>{alert.studentName}</Text>
                    <Text style={styles.alertSeverityBadge}>{alert.severity}</Text>
                  </View>
                  <Text style={styles.alertDetails}>
                    Scheduled stop: <Text style={{ color: '#f8fafc' }}>{alert.stopName}</Text>
                  </Text>
                  <Text style={styles.alertDetails}>
                    Guardian: {alert.guardianName} ({alert.guardianPhone})
                  </Text>
                  <View style={styles.alertActionRow}>
                    <TouchableOpacity
                      style={styles.resolveAlertBtn}
                      onPress={() => resolveMissingAlert(alert.id)}
                    >
                      <Text style={styles.resolveAlertBtnText}>Mark Verified / Resolve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Safe-Drop Verification Stream */}
          <View style={styles.panelCard}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>🛡️ Recent Safe-Drop Audits</Text>
              <TouchableOpacity onPress={() => onNavigate && onNavigate('safedrop')}>
                <Text style={styles.panelLink}>View All Logs →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.logsList}>
              {safeDropLogs.slice(0, 3).map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logTop}>
                    <Text style={styles.logStudent}>{log.studentName}</Text>
                    <Text
                      style={[
                        styles.logStatus,
                        log.status === 'VERIFIED' ? styles.logStatusGood : styles.logStatusWarn,
                      ]}
                    >
                      {log.status} ({log.distanceMeters}m)
                    </Text>
                  </View>
                  <Text style={styles.logStop}>{log.stopName} • {log.timestamp}</Text>
                  <Text style={styles.logNotes}>{log.notes}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Hub Navigation Tiles */}
          <View style={styles.quickNavGrid}>
            <TouchableOpacity
              style={styles.quickTile}
              onPress={() => onNavigate && onNavigate('students')}
            >
              <Text style={styles.quickTileEmoji}>🎓</Text>
              <Text style={styles.quickTileLabel}>Students ({students.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickTile}
              onPress={() => onNavigate && onNavigate('fleet')}
            >
              <Text style={styles.quickTileEmoji}>🚌</Text>
              <Text style={styles.quickTileLabel}>Fleet Health</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickTile}
              onPress={() => onNavigate && onNavigate('routes')}
            >
              <Text style={styles.quickTileEmoji}>🗺️</Text>
              <Text style={styles.quickTileLabel}>Routes ({routes.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickTile}
              onPress={() => onNavigate && onNavigate('emergency')}
            >
              <Text style={styles.quickTileEmoji}>🚨</Text>
              <Text style={styles.quickTileLabel}>SOS Room</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F5',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  heroBanner: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  heroLeft: {
    flex: 1,
    minWidth: 280,
  },
  heroKicker: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroTitle: {
    color: '#0F172A',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
    fontWeight: '500',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  simStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FF6B00',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  simStepButtonIcon: {
    fontSize: 18,
  },
  simStepButtonTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  simStepButtonSub: {
    color: '#FFEDD5',
    fontSize: 11,
    fontWeight: '600',
  },
  sosQuickBtn: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  sosQuickBtnActive: {
    backgroundColor: '#16A34A',
    borderColor: '#15803D',
  },
  sosQuickBtnText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '900',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  kpiCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  kpiLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  kpiBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 9,
    fontWeight: '900',
  },
  kpiValue: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '900',
  },
  kpiUnit: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
  },
  kpiSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  kpiProgressTrack: {
    height: 6,
    backgroundColor: '#FFF7ED',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  kpiProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  dualSection: {
    flexDirection: 'column',
    gap: 18,
  },
  leftColumn: {
    width: '100%',
  },
  rightColumn: {
    width: '100%',
    gap: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
  },
  sectionDesc: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  actionLinkBtn: {
    paddingVertical: 4,
  },
  actionLinkText: {
    color: '#FF6B00',
    fontSize: 13,
    fontWeight: '800',
  },
  busCardsList: {
    gap: 14,
  },
  busTelemetryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  busCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  busNameCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  busPlateBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  busPlateText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  busNickName: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
  busStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FF6B00',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B00',
  },
  busStatusText: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: '800',
  },
  busMetricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  busMetricItem: {
    flex: 1,
    minWidth: 100,
  },
  busMetricLabel: {
    color: '#EA580C',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  busMetricVal: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  busProgressContainer: {
    marginBottom: 12,
  },
  busProgressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  busRouteName: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  busOccupancyText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700',
  },
  busProgressBarBg: {
    height: 6,
    backgroundColor: '#FFF7ED',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  busProgressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#FF6B00',
  },
  busFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FFEDD5',
    paddingTop: 10,
  },
  driverText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  busTrackBtn: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FF6B00',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  busTrackBtnText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '800',
  },
  panelCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  panelTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '900',
  },
  panelCount: {
    color: '#FFFFFF',
    backgroundColor: '#FF6B00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '900',
  },
  panelLink: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyNotice: {
    padding: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 8,
  },
  emptyNoticeText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '700',
  },
  alertCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  alertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  alertStudent: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
  alertSeverityBadge: {
    color: '#FFFFFF',
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '900',
  },
  alertDetails: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  alertActionRow: {
    marginTop: 10,
  },
  resolveAlertBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 7,
    borderRadius: 6,
    alignItems: 'center',
  },
  resolveAlertBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  logsList: {
    gap: 10,
  },
  logItem: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 10,
    padding: 10,
  },
  logTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logStudent: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
  },
  logStatus: {
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logStatusGood: {
    color: '#FFFFFF',
    backgroundColor: '#EA580C',
  },
  logStatusWarn: {
    color: '#FFFFFF',
    backgroundColor: '#16A34A',
  },
  logStop: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 3,
  },
  logNotes: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  quickNavGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickTile: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  quickTileEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  quickTileLabel: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: '800',
  },
});

