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

export default function FleetScreen() {
  const { buses, advanceSimulation, triggerSOS, addNotification } = useSafety();
  const [testingBusId, setTestingBusId] = useState(null);

  const handleSelfTest = (busNumber) => {
    setTestingBusId(busNumber);
    setTimeout(() => {
      setTestingBusId(null);
      addNotification({
        title: `Hardware Diagnostic Passed`,
        message: `${busNumber} all 12 telemetry sensors & emergency door locks verified functional.`,
        type: 'info',
      });
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.headerKicker}>VEHICLE TELEMATICS & HARDWARE SENSORS</Text>
          <Text style={styles.headerTitle}>Fleet Health & Diagnostics Console</Text>
          <Text style={styles.headerSub}>
            Live CAN-bus engine monitoring, tire telemetry, camera streams, and speed governor audits.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            addNotification({
              title: 'Fleet Audit Generated',
              message: 'All 4 vehicles certified for road safety compliance. ISO-39001 certified.',
              type: 'info',
            });
          }}
        >
          <Text style={styles.headerBtnText}>📋 Download Fleet Audit</Text>
        </TouchableOpacity>
      </View>

      {/* Fleet Stats Overview */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>TOTAL FLEET UNITS</Text>
          <Text style={styles.summaryVal}>4 Active</Text>
          <Text style={styles.summarySub}>0 Standby • 0 In Depot</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>AVERAGE FLEET SPEED</Text>
          <Text style={[styles.summaryVal, { color: '#FF6B00' }]}>
            {Math.round(buses.reduce((a, b) => a + b.speed, 0) / buses.length)} km/h
          </Text>
          <Text style={styles.summarySub}>Max Governor Limit: 45 km/h</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>CAMERAS STREAMING</Text>
          <Text style={[styles.summaryVal, { color: '#16A34A' }]}>11 / 11 Cams</Text>
          <Text style={styles.summarySub}>1080p AI Occupancy active</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>HARDWARE AUDIT</Text>
          <Text style={[styles.summaryVal, { color: '#EA580C' }]}>100% HEALTH</Text>
          <Text style={styles.summarySub}>Brakes, GPS, RFID passed</Text>
        </View>
      </View>

      {/* Vehicles Grid */}
      <View style={styles.vehiclesList}>
        {buses.map((bus) => {
          const isTesting = testingBusId === bus.number;
          return (
            <View key={bus.id} style={styles.busCard}>
              <View style={styles.busCardHeader}>
                <View style={styles.busHeaderLeft}>
                  <View style={styles.busNumberBadge}>
                    <Text style={styles.busNumberText}>{bus.number}</Text>
                  </View>
                  <View>
                    <Text style={styles.busNameText}>{bus.name}</Text>
                    <Text style={styles.busModelText}>
                      Tata Starbus Ultra 36-Seater • Reg: {bus.regNo}
                    </Text>
                  </View>
                </View>
                <View style={styles.operationalBadge}>
                  <View style={styles.greenDot} />
                  <Text style={styles.operationalText}>ONLINE TELEMETRY</Text>
                </View>
              </View>

              {/* Hardware Sensors Matrix */}
              <View style={styles.sensorsGrid}>
                <View style={styles.sensorItem}>
                  <Text style={styles.sensorLabel}>ENGINE COOLANT</Text>
                  <Text style={styles.sensorVal}>{bus.engineTemp}</Text>
                  <Text style={styles.sensorSub}>Normal (75-90°C)</Text>
                </View>
                <View style={styles.sensorItem}>
                  <Text style={styles.sensorLabel}>FUEL LEVEL</Text>
                  <Text style={[styles.sensorVal, { color: bus.fuel < 25 ? '#f87171' : '#ffffff' }]}>
                    {bus.fuel}%
                  </Text>
                  <Text style={styles.sensorSub}>Est. Range: ~180 km</Text>
                </View>
                <View style={styles.sensorItem}>
                  <Text style={styles.sensorLabel}>BATTERY VOLTAGE</Text>
                  <Text style={styles.sensorVal}>{bus.battery}% (26.8V)</Text>
                  <Text style={styles.sensorSub}>Alternator optimal</Text>
                </View>
                <View style={styles.sensorItem}>
                  <Text style={styles.sensorLabel}>TIRE PRESSURE</Text>
                  <Text style={styles.sensorVal}>32.5 PSI</Text>
                  <Text style={styles.sensorSub}>All 6 tires synced</Text>
                </View>
                <View style={styles.sensorItem}>
                  <Text style={styles.sensorLabel}>CCTV CAMERA FEED</Text>
                  <Text style={[styles.sensorVal, { color: '#38bdf8' }]}>{bus.cctvStatus}</Text>
                  <Text style={styles.sensorSub}>Driver + Cabin cams</Text>
                </View>
                <View style={styles.sensorItem}>
                  <Text style={styles.sensorLabel}>SPEED GOVERNOR</Text>
                  <Text style={[styles.sensorVal, { color: '#34d399' }]}>
                    ACTIVE ({bus.speed}/{bus.speedLimit})
                  </Text>
                  <Text style={styles.sensorSub}>Speed limit tamper proof</Text>
                </View>
              </View>

              {/* Crew & Safety Equipment */}
              <View style={styles.crewCardRow}>
                <View style={styles.crewCol}>
                  <Text style={styles.crewTitle}>DESIGNATED DRIVER</Text>
                  <Text style={styles.crewName}>{bus.driver}</Text>
                  <Text style={styles.crewPhone}>{bus.driverPhone}</Text>
                </View>
                <View style={styles.crewCol}>
                  <Text style={styles.crewTitle}>SAFETY ATTENDANT</Text>
                  <Text style={styles.crewName}>{bus.attendant}</Text>
                  <Text style={styles.crewPhone}>{bus.attendantPhone}</Text>
                </View>
                <View style={styles.crewCol}>
                  <Text style={styles.crewTitle}>SAFETY COMPLIANCE</Text>
                  <Text style={styles.crewName}>First-Aid & ABC Extinguisher</Text>
                  <Text style={styles.crewPhone}>Inspected Oct 2026</Text>
                </View>
              </View>

              {/* Diagnostic Actions */}
              <View style={styles.busActionRow}>
                <TouchableOpacity
                  style={[styles.selfTestBtn, isTesting && styles.selfTestBtnTesting]}
                  onPress={() => handleSelfTest(bus.number)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.selfTestBtnText}>
                    {isTesting ? '⚡ Running Diagnostic Ping...' : '🔍 Run Full Sensor Diagnostic'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.serviceRequestBtn}
                  onPress={() => {
                    addNotification({
                      title: 'Service Booked',
                      message: `Maintenance scheduled for ${bus.number} with Greenwood Fleet Depot.`,
                      type: 'info',
                    });
                  }}
                >
                  <Text style={styles.serviceRequestBtnText}>Schedule Depot Service</Text>
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
  headerBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#16A34A',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  summaryLabel: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  summaryVal: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },
  summarySub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },
  vehiclesList: {
    gap: 18,
  },
  busCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  busCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  busHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  busNumberBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  busNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  busNameText: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '900',
  },
  busModelText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  operationalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FF6B00',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B00',
  },
  operationalText: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sensorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sensorItem: {
    flex: 1,
    minWidth: 140,
  },
  sensorLabel: {
    color: '#EA580C',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  sensorVal: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 4,
  },
  sensorSub: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
  crewCardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#FFEDD5',
    paddingTop: 14,
    marginBottom: 16,
  },
  crewCol: {
    flex: 1,
    minWidth: 180,
  },
  crewTitle: {
    color: '#EA580C',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  crewName: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 3,
  },
  crewPhone: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  busActionRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  selfTestBtn: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FF6B00',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#FF6B00',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  selfTestBtnTesting: {
    backgroundColor: '#16A34A',
  },
  selfTestBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  serviceRequestBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  serviceRequestBtnText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '800',
  },
});

