import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafety } from '../../context/SafetyContext';

export default function EmergencyScreen() {
  const { emergencies, activeSOS, triggerSOS, resolveSOS, buses, addNotification } = useSafety();
  const [selectedIncidentType, setSelectedIncidentType] = useState('Medical Emergency');

  const emergencyTypes = [
    { label: '🚑 Medical Emergency', type: 'Medical Distress (Severe Allergy/Asthma)' },
    { label: '💥 Traffic Collision', type: 'Road Accident (Minor Impact / Fender)' },
    { label: '🔥 Engine Smoke / Fire', type: 'Thermal Hazard / Coolant Explosion' },
    { label: '⚠️ Mechanical Breakdown', type: 'Transmission / Axle Failure' },
    { label: '🚨 Driver Distress Panic', type: 'Driver Security Distress Beacon' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Banner */}
      <View style={[styles.headerCard, activeSOS && styles.headerCardAlert]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerKicker, activeSOS && { color: '#ffffff' }]}>
            CENTRAL CRISIS COMMAND & SOS WAR ROOM
          </Text>
          <Text style={styles.headerTitle}>
            {activeSOS ? '🚨 CRITICAL EMERGENCY BROADCAST IN PROGRESS' : 'Emergency & Incident Operations'}
          </Text>
          <Text style={[styles.headerSub, activeSOS && { color: '#DCFCE7' }]}>
            Real-time multi-agency coordination with EMS, Police dispatch, and parent SMS broadcasts.
          </Text>
        </View>
      </View>

      {/* Incident Launchpad Card */}
      <View style={styles.launchpadCard}>
        <Text style={styles.launchpadKicker}>INSTANT CRISIS DISPATCH LAUNCHPAD</Text>
        <Text style={styles.launchpadTitle}>Broadcast Immediate Emergency SOS</Text>
        <Text style={styles.launchpadSub}>
          Select incident classification to trigger automated sirens, GPS lockdown, and emergency dispatch:
        </Text>

        <View style={styles.typeButtonsGrid}>
          {emergencyTypes.map((et) => {
            const isSelected = selectedIncidentType === et.type;
            return (
              <TouchableOpacity
                key={et.type}
                style={[styles.typeBtn, isSelected && styles.typeBtnActive]}
                onPress={() => setSelectedIncidentType(et.type)}
                activeOpacity={0.8}
              >
                <Text style={[styles.typeBtnText, isSelected && styles.typeBtnTextActive]}>
                  {et.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.triggerSosBigBtn}
          onPress={() => triggerSOS(selectedIncidentType, 'bus-1')}
          activeOpacity={0.85}
        >
          <Text style={styles.triggerSosBigBtnText}>
            ⚡ BROADCAST FLEET SOS DISPATCH ({selectedIncidentType.split(' ')[0]})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Incidents War Room */}
      <View style={styles.incidentsSection}>
        <Text style={styles.sectionHeaderTitle}>Active Incident Rooms ({emergencies.length})</Text>

        {emergencies.map((em) => {
          const isResolved = em.status === 'RESOLVED & SECURED';
          const bus = buses.find((b) => b.id === em.busId) || buses[0];

          return (
            <View key={em.id} style={[styles.incidentCard, isResolved && styles.incidentCardResolved]}>
              <View style={styles.incidentTop}>
                <View>
                  <View style={styles.incidentBadgeRow}>
                    <Text
                      style={[
                        styles.incidentStatusBadge,
                        isResolved ? styles.badgeResolved : styles.badgeActive,
                      ]}
                    >
                      {em.status}
                    </Text>
                    <Text style={styles.incidentTimeText}>{em.timestamp}</Text>
                  </View>
                  <Text style={styles.incidentTypeName}>{em.type}</Text>
                </View>

                {!isResolved && (
                  <TouchableOpacity
                    style={styles.resolveBtn}
                    onPress={() => resolveSOS(em.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.resolveBtnText}>✅ Close & Secure Incident</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Telemetry info */}
              <View style={styles.incidentMetaGrid}>
                <View style={styles.incidentMetaBox}>
                  <Text style={styles.metaKey}>IMPACTED TRANSIT UNIT</Text>
                  <Text style={styles.metaVal}>{em.busNumber}</Text>
                  <Text style={styles.metaSub}>Pilot: {em.driverName} ({em.driverPhone})</Text>
                </View>
                <View style={styles.incidentMetaBox}>
                  <Text style={styles.metaKey}>INCIDENT LOCATION</Text>
                  <Text style={styles.metaVal}>{em.location}</Text>
                  <Text style={styles.metaSub}>GPS: {em.coordinates}</Text>
                </View>
                <View style={styles.incidentMetaBox}>
                  <Text style={styles.metaKey}>PASSENGERS ABOARD</Text>
                  <Text style={[styles.metaVal, { color: '#38bdf8' }]}>
                    {em.studentsOnboard} Students
                  </Text>
                  <Text style={styles.metaSub}>All RFID tags tracked</Text>
                </View>
              </View>

              {/* Dispatched Units Log */}
              <View style={styles.dispatchLogCard}>
                <Text style={styles.dispatchLogTitle}>DISPATCHED FIRST RESPONDERS & UNITS:</Text>
                {em.dispatchedUnits.map((unit, idx) => (
                  <View key={idx} style={styles.unitRow}>
                    <Text style={styles.unitBullet}>🚨</Text>
                    <Text style={styles.unitText}>{unit}</Text>
                  </View>
                ))}
              </View>

              {/* Quick Communication Actions */}
              <View style={styles.actionLinksRow}>
                <TouchableOpacity
                  style={styles.commActionBtn}
                  onPress={() => {
                    addNotification({
                      title: 'Audio Line Connected',
                      message: `Direct 2-way radio patch opened to ${em.driverName} on Bus #101.`,
                      type: 'info',
                    });
                  }}
                >
                  <Text style={styles.commActionText}>📻 Radio Driver Console</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.commActionBtn}
                  onPress={() => {
                    addNotification({
                      title: 'Police & EMS Re-Pinged',
                      message: 'GPS telemetry push resent to District Dispatch Control.',
                      type: 'info',
                    });
                  }}
                >
                  <Text style={styles.commActionText}>🚓 Ping District Emergency EMS</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
    padding: 20,
    maxWidth: 1200,
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
    shadowColor: '#FF6B00',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  headerCardAlert: {
    backgroundColor: '#16A34A',
    borderColor: '#15803D',
  },
  headerLeft: {
    gap: 4,
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
  },
  headerSub: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
  },
  launchpadCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF6B00',
    borderRadius: 18,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  launchpadKicker: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  launchpadTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  launchpadSub: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
    fontWeight: '500',
  },
  typeButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  typeBtn: {
    flex: 1,
    minWidth: 170,
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#FF6B00',
    borderColor: '#EA580C',
    shadowColor: '#FF6B00',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  typeBtnText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
  },
  triggerSosBigBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  triggerSosBigBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  incidentsSection: {
    gap: 16,
  },
  sectionHeaderTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  incidentCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#16A34A',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#16A34A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  incidentCardResolved: {
    borderColor: '#FED7AA',
    opacity: 0.85,
  },
  incidentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  incidentBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  incidentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  badgeActive: {
    backgroundColor: '#DCFCE7',
    color: '#16A34A',
  },
  badgeResolved: {
    backgroundColor: '#FFEDD5',
    color: '#EA580C',
  },
  incidentTimeText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  incidentTypeName: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
  },
  resolveBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  resolveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  incidentMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  incidentMetaBox: {
    flex: 1,
    minWidth: 180,
  },
  metaKey: {
    color: '#EA580C',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  metaVal: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  metaSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  dispatchLogCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  dispatchLogTitle: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  unitBullet: {
    fontSize: 12,
  },
  unitText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '600',
  },
  actionLinksRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  commActionBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#16A34A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  commActionText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '800',
  },
});

