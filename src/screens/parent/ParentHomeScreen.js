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

export default function ParentHomeScreen() {
  const { students, buses, addNotification, advanceSimulation } = useSafety();
  const { user } = useAuth();

  const child = students.find((s) => s.id === (user.childId || 'stud-1')) || students[0];
  const bus = buses.find((b) => b.id === child.busId) || buses[0];

  const getStatusBadge = () => {
    switch (child.status) {
      case 'boarded':
        return { label: '🟢 ON BOARD BUS (EN ROUTE)', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' };
      case 'safe_dropped':
        return { label: '🛡️ SAFELY DROPPED OFF', color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'waiting':
        return { label: '⏳ AWAITING BUS PICKUP', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)' };
      case 'absent':
        return { label: '❌ EXCUSED ABSENCE', color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)' };
      default:
        return { label: '🟢 ON BOARD BUS', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.childHeroLeft}>
          <View style={styles.avatarHalo}>
            <Text style={styles.avatarEmoji}>{child.avatar}</Text>
          </View>
          <View>
            <Text style={styles.headerKicker}>PARENT GUARDIAN MONITOR</Text>
            <Text style={styles.childName}>{child.name}</Text>
            <Text style={styles.childMeta}>
              {child.grade} • Roll #{child.rollNo} • Blood: {child.bloodGroup}
            </Text>
          </View>
        </View>

        <View style={[styles.statusHeroPill, { backgroundColor: statusBadge.bg }]}>
          <Text style={[styles.statusHeroPillText, { color: statusBadge.color }]}>
            {statusBadge.label}
          </Text>
        </View>
      </View>

      {/* Real-time Bus ETA Hero */}
      <View style={styles.etaHeroCard}>
        <View style={styles.etaHeroTop}>
          <View>
            <Text style={styles.etaKicker}>LIVE JOURNEY TELEMETRY</Text>
            <Text style={styles.etaTitle}>Next Stop: {bus.nextStop}</Text>
          </View>
          <View style={styles.etaCountPill}>
            <Text style={styles.etaCountNum}>~{bus.etaMins}</Text>
            <Text style={styles.etaCountUnit}>MINS ETA</Text>
          </View>
        </View>

        <View style={styles.telemetryMiniGrid}>
          <View style={styles.miniItem}>
            <Text style={styles.miniKey}>ASSIGNED TRANSIT</Text>
            <Text style={styles.miniVal}>{bus.number}</Text>
            <Text style={styles.miniSub}>{bus.regNo}</Text>
          </View>
          <View style={styles.miniItem}>
            <Text style={styles.miniKey}>LIVE SPEED</Text>
            <Text style={styles.miniVal}>{bus.speed} km/h</Text>
            <Text style={styles.miniSub}>Governed safe pace</Text>
          </View>
          <View style={styles.miniItem}>
            <Text style={styles.miniKey}>DESIGNATED STOP</Text>
            <Text style={styles.miniVal}>{child.stopName.split(' ')[0]}</Text>
            <Text style={styles.miniSub}>100m Geofenced</Text>
          </View>
        </View>
      </View>

      {/* Journey Timeline */}
      <View style={styles.journeyCard}>
        <Text style={styles.journeyTitle}>Today's Morning Journey Milestones</Text>
        <View style={styles.timelineList}>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.dotDone]}><Text style={styles.dotIcon}>✓</Text></View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStepTitle}>Bus Departed Terminal</Text>
              <Text style={styles.timelineStepTime}>07:15 AM • Route 1 North Sector</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, child.boardTime ? styles.dotDone : styles.dotActive]}>
              <Text style={styles.dotIcon}>{child.boardTime ? '✓' : '📶'}</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStepTitle}>RFID Boarding Scan</Text>
              <Text style={styles.timelineStepTime}>
                {child.boardTime ? `${child.boardTime} • Verified at ${child.stopName}` : 'Awaiting boarding tap'}
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.dotActive]}><Text style={styles.dotIcon}>🚌</Text></View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStepTitle}>Transit Corridor to Greenwood Campus</Text>
              <Text style={styles.timelineStepTime}>Current pace: {bus.speed} km/h • No delays reported</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot}><Text style={styles.dotIcon}>🏫</Text></View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStepTitle}>Campus Safe-Drop & Handover</Text>
              <Text style={styles.timelineStepTime}>Scheduled arrival: 08:05 AM</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Verified Bus Crew Contact Card */}
      <View style={styles.crewCard}>
        <Text style={styles.crewCardTitle}>Verified Transit Escort Team</Text>
        <View style={styles.crewMembersRow}>
          <View style={styles.crewMember}>
            <Text style={styles.crewAvatar}>👨‍✈️</Text>
            <View style={styles.crewInfo}>
              <Text style={styles.crewRole}>ASSIGNED PILOT</Text>
              <Text style={styles.crewNameText}>{bus.driver}</Text>
              <Text style={styles.crewPhoneText}>{bus.driverPhone}</Text>
            </View>
            <TouchableOpacity
              style={styles.callCrewBtn}
              onPress={() => addNotification({ title: 'Calling Driver', message: `Calling ${bus.driver}...`, type: 'info' })}
            >
              <Text style={styles.callCrewBtnText}>📞 Call</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.crewMember}>
            <Text style={styles.crewAvatar}>👩‍💼</Text>
            <View style={styles.crewInfo}>
              <Text style={styles.crewRole}>BUS ATTENDANT</Text>
              <Text style={styles.crewNameText}>{bus.attendant}</Text>
              <Text style={styles.crewPhoneText}>{bus.attendantPhone}</Text>
            </View>
            <TouchableOpacity
              style={styles.callCrewBtn}
              onPress={() => addNotification({ title: 'Calling Attendant', message: `Calling ${bus.attendant}...`, type: 'info' })}
            >
              <Text style={styles.callCrewBtnText}>📞 Call</Text>
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
  childHeroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarHalo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#131b2e',
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  headerKicker: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  childName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  childMeta: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  statusHeroPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  statusHeroPillText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  etaHeroCard: {
    backgroundColor: '#0f172a',
    borderWidth: 1.5,
    borderColor: '#2563eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  etaHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  etaKicker: {
    color: '#60a5fa',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  etaTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  etaCountPill: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  etaCountNum: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  etaCountUnit: {
    color: '#bfdbfe',
    fontSize: 9,
    fontWeight: '800',
  },
  telemetryMiniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#131b2e',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  miniItem: {
    width: '45%',
    flexGrow: 1,
  },
  miniKey: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
  },
  miniVal: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },
  miniSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 1,
  },
  journeyCard: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  journeyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  timelineList: {
    gap: 14,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: '#10b981',
  },
  dotActive: {
    backgroundColor: '#2563eb',
  },
  dotIcon: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  timelineContent: {
    flex: 1,
  },
  timelineStepTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  timelineStepTime: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  crewCard: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
  },
  crewCardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  crewMembersRow: {
    gap: 12,
  },
  crewMember: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  crewAvatar: {
    fontSize: 26,
  },
  crewInfo: {
    flex: 1,
  },
  crewRole: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
  },
  crewNameText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  crewPhoneText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 1,
  },
  callCrewBtn: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callCrewBtnText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '700',
  },
});

