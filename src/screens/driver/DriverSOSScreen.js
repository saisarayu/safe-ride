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

export default function DriverSOSScreen() {
  const { triggerSOS, activeSOS, resolveSOS, buses, addNotification } = useSafety();
  const { user } = useAuth();
  const driverBus = buses.find((b) => b.id === (user.busId || 'bus-1')) || buses[0];

  const sosCategories = [
    { title: '💥 ROAD COLLISION', desc: 'Accident impact or fender hazard', type: 'Road Accident Panic' },
    { title: '🚑 STUDENT MEDICAL', desc: 'Severe illness, seizure, or injury', type: 'Medical Distress Panic' },
    { title: '🔥 FIRE / SMOKE', desc: 'Engine fire or electrical smoke detected', type: 'Fire Emergency Panic' },
    { title: '🛑 BUS BREAKDOWN', desc: 'Engine stopped or flat tire stranded', type: 'Mechanical Breakdown Panic' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Warning Alert Banner */}
      <View style={[styles.bannerCard, activeSOS && styles.bannerCardAlert]}>
        <Text style={styles.bannerEmoji}>{activeSOS ? '🚨' : '🛡️'}</Text>
        <View style={styles.bannerTextCol}>
          <Text style={styles.bannerTitle}>
            {activeSOS ? 'ACTIVE SOS EMERGENCY BEACON BROADCASTING' : 'DRIVER EMERGENCY PANIC TERMINAL'}
          </Text>
          <Text style={styles.bannerSub}>
            GPS Coordinates transmitting live to School Control & First Responders.
          </Text>
        </View>
      </View>

      {/* GPS Telemetry Box */}
      <View style={styles.telemetryCard}>
        <View style={styles.telemetryCol}>
          <Text style={styles.telemetryLabel}>VEHICLE TRANSPONDER</Text>
          <Text style={styles.telemetryVal}>{driverBus.number} ({driverBus.regNo})</Text>
        </View>
        <View style={styles.telemetryCol}>
          <Text style={styles.telemetryLabel}>CURRENT GPS POSITION</Text>
          <Text style={styles.telemetryVal}>{driverBus.lat.toFixed(5)}°N, {driverBus.lng.toFixed(5)}°E</Text>
        </View>
        <View style={styles.telemetryCol}>
          <Text style={styles.telemetryLabel}>PASSENGERS ONBOARD</Text>
          <Text style={[styles.telemetryVal, { color: '#38bdf8' }]}>{driverBus.currentOccupancy} Students</Text>
        </View>
      </View>

      {/* 4 Big Emergency Tiles */}
      <View style={styles.emergencyGrid}>
        {sosCategories.map((c) => (
          <TouchableOpacity
            key={c.title}
            style={styles.sosButton}
            onPress={() => triggerSOS(c.type, driverBus.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.sosBtnTitle}>{c.title}</Text>
            <Text style={styles.sosBtnDesc}>{c.desc}</Text>
            <View style={styles.sosBtnActionPill}>
              <Text style={styles.sosBtnActionText}>HOLD OR TAP TO BROADCAST 🚨</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Direct Hotlines Bar */}
      <View style={styles.hotlinesCard}>
        <Text style={styles.hotlinesTitle}>DIRECT EMERGENCY VOICE LINES</Text>
        <View style={styles.hotlinesRow}>
          <TouchableOpacity
            style={styles.hotlineBtn}
            onPress={() => addNotification({ title: 'Calling Principal', message: 'Calling School Admin Hotline: +91 98765 43210', type: 'info' })}
          >
            <Text style={styles.hotlineBtnText}>📞 School Admin (+91 98765 43210)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.hotlineBtn, { borderColor: '#ef4444' }]}
            onPress={() => addNotification({ title: 'Calling Ambulance', message: 'Connecting to National Medical Services #108...', type: 'sos' })}
          >
            <Text style={[styles.hotlineBtnText, { color: '#f87171' }]}>🚑 Ambulance (108)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.hotlineBtn, { borderColor: '#3b82f6' }]}
            onPress={() => addNotification({ title: 'Calling Police', message: 'Connecting to Police Control Room #112...', type: 'info' })}
          >
            <Text style={[styles.hotlineBtnText, { color: '#60a5fa' }]}>🚓 Police Patrol (112)</Text>
          </TouchableOpacity>
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
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  bannerCard: {
    backgroundColor: '#161026',
    borderWidth: 1.5,
    borderColor: '#6b21a8',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  bannerCardAlert: {
    backgroundColor: '#b91c1c',
    borderColor: '#ef4444',
  },
  bannerEmoji: {
    fontSize: 34,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  bannerSub: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 2,
  },
  telemetryCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    gap: 14,
  },
  telemetryCol: {
    flex: 1,
    minWidth: 160,
  },
  telemetryLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  telemetryVal: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  sosButton: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#1b1220',
    borderWidth: 2,
    borderColor: '#16A34A',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  sosBtnTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  sosBtnDesc: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  sosBtnActionPill: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  sosBtnActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  hotlinesCard: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 18,
    padding: 20,
  },
  hotlinesTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  hotlinesRow: {
    gap: 10,
  },
  hotlineBtn: {
    backgroundColor: '#131b2e',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  hotlineBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});

