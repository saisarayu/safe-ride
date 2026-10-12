import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafety } from '../../context/SafetyContext';
import { useAuth } from '../../context/AuthContext';

export default function DriverHomeScreen({ onNavigate }) {
  const { buses, advanceSimulation, triggerSOS, students } = useSafety();
  const { user } = useAuth();

  const driverBus = buses.find((b) => b.id === (user.busId || 'bus-1')) || buses[0];
  const busStudents = students.filter((s) => s.busId === driverBus.id);
  const onBoardCount = busStudents.filter((s) => s.status === 'boarded').length;
  const waitingCount = busStudents.filter((s) => s.status === 'waiting').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Driver Console Header */}
      <View style={styles.headerCard}>
        <View style={styles.driverProfileCol}>
          <Text style={styles.profileRoleBadge}>PILOT COCKPIT TERMINAL</Text>
          <Text style={styles.driverName}>{user.name}</Text>
          <Text style={styles.vehicleInfo}>
            {driverBus.number} • {driverBus.regNo} • Attendant: {driverBus.attendant}
          </Text>
        </View>

        <View style={styles.statusPill}>
          <View style={styles.greenPulseDot} />
          <Text style={styles.statusPillText}>TRIP ACTIVE • ON SCHEDULE</Text>
        </View>
      </View>

      {/* Hero Next Stop Card */}
      <View style={styles.heroStopCard}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroStopKicker}>NEXT DESIGNATED GEOFENCED STOP</Text>
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>ETA ~{driverBus.etaMins} MINS</Text>
          </View>
        </View>

        <Text style={styles.heroStopName}>{driverBus.nextStop}</Text>
        <Text style={styles.heroStopSub}>
          Stop Milestone #{driverBus.currentStopIndex + 1} • Geofence threshold: 100 meters
        </Text>

        {/* Speedometer & Gauge row */}
        <View style={styles.gaugeRow}>
          <View style={styles.gaugeItem}>
            <Text style={styles.gaugeLabel}>CURRENT SPEED</Text>
            <Text style={styles.gaugeVal}>{driverBus.speed} <Text style={styles.gaugeUnit}>km/h</Text></Text>
            <Text style={styles.gaugeSub}>Speed Limit: 45 km/h (Governed)</Text>
          </View>
          <View style={styles.gaugeDivider} />
          <View style={styles.gaugeItem}>
            <Text style={styles.gaugeLabel}>OCCUPANCY LOAD</Text>
            <Text style={[styles.gaugeVal, { color: '#38bdf8' }]}>
              {driverBus.currentOccupancy} / {driverBus.capacity}
            </Text>
            <Text style={styles.gaugeSub}>{onBoardCount} Boarded • {waitingCount} Waiting</Text>
          </View>
        </View>

        {/* Big Action Buttons for Driver Hands */}
        <View style={styles.driverActionButtons}>
          <TouchableOpacity
            style={styles.arriveStopBtn}
            onPress={advanceSimulation}
            activeOpacity={0.85}
          >
            <Text style={styles.arriveStopBtnText}>
              ✅ Arrived & Step to Next Stop
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manifestBtn}
            onPress={() => onNavigate && onNavigate('manifest')}
            activeOpacity={0.85}
          >
            <Text style={styles.manifestBtnText}>
              📋 Open Passenger Manifest & Scanner ({busStudents.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Red Panic SOS Emergency Banner */}
      <View style={styles.sosCard}>
        <View style={styles.sosLeft}>
          <Text style={styles.sosTitle}>1-TOUCH EMERGENCY PANIC TRIGGER</Text>
          <Text style={styles.sosSub}>
            Instant priority broadcast to School Principal, Campus Security, and Emergency EMS #108.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.sosTriggerBtn}
          onPress={() => triggerSOS('Driver Panic Console Button', driverBus.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.sosTriggerBtnText}>🚨 PANIC SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Students Preview */}
      <View style={styles.upcomingStudentsCard}>
        <Text style={styles.upcomingTitle}>Students Scheduled on Route 1</Text>
        <View style={styles.studentsRow}>
          {busStudents.slice(0, 4).map((s) => (
            <View key={s.id} style={styles.studentItem}>
              <Text style={styles.studentEmoji}>{s.avatar}</Text>
              <Text style={styles.studentName}>{s.name}</Text>
              <Text style={styles.studentStop}>{s.stopName.split(' ')[0]}</Text>
              <View
                style={[
                  styles.statusTag,
                  s.status === 'boarded' && { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
                  s.status === 'waiting' && { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
                  s.status === 'safe_dropped' && { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                ]}
              >
                <Text style={styles.statusTagText}>{s.status.toUpperCase()}</Text>
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
    backgroundColor: '#FFF9F5',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  driverProfileCol: {
    gap: 4,
  },
  profileRoleBadge: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  driverName: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '900',
  },
  vehicleInfo: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FF6B00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B00',
  },
  statusPillText: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: '900',
  },
  heroStopCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#16A34A',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#16A34A',
    shadowOpacity: 0.15,
    shadowRadius: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  heroStopKicker: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  etaBadge: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  etaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  heroStopName: {
    color: '#0F172A',
    fontSize: 26,
    fontWeight: '900',
  },
  heroStopSub: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '500',
  },
  gaugeRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 16,
  },
  gaugeItem: {
    flex: 1,
    minWidth: 150,
  },
  gaugeDivider: {
    width: 1.5,
    backgroundColor: '#FED7AA',
  },
  gaugeLabel: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  gaugeVal: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },
  gaugeUnit: {
    fontSize: 14,
    color: '#94A3B8',
  },
  gaugeSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  driverActionButtons: {
    gap: 12,
  },
  arriveStopBtn: {
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#FF6B00',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  arriveStopBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  manifestBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  manifestBtnText: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '900',
  },
  sosCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#16A34A',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 14,
  },
  sosLeft: {
    flex: 1,
    minWidth: 240,
  },
  sosTitle: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sosSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  sosTriggerBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#16A34A',
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  sosTriggerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  upcomingStudentsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  upcomingTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 14,
  },
  studentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  studentItem: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  studentEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  studentName: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
  },
  studentStop: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 6,
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#FFEDD5',
  },
  statusTagText: {
    color: '#16A34A',
    fontSize: 9,
    fontWeight: '900',
  },
});

