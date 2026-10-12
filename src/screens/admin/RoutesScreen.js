import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafety } from '../../context/SafetyContext';

export default function RoutesScreen() {
  const { routes, buses, students, addNotification } = useSafety();
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0].id);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const assignedBus = buses.find((b) => b.routeId === activeRoute.id) || buses[0];
  const routeStudents = students.filter((s) => s.busId === assignedBus.id);

  const handleRecalculate = () => {
    addNotification({
      title: 'AI Route Optimized',
      message: `${activeRoute.name} path recalculated avoiding morning construction on 4th Cross. Est. savings: 6 mins.`,
      type: 'info',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.headerKicker}>TRANSIT CORRIDORS & GEOFENCED WAYPOINTS</Text>
          <Text style={styles.headerTitle}>Route Optimizer & Corridor Grid</Text>
          <Text style={styles.headerSub}>
            Multi-stop timetable schedules, 100m safety geofences, and dynamic road traffic hazard alerts.
          </Text>
        </View>
        <TouchableOpacity style={styles.optBtn} onPress={handleRecalculate}>
          <Text style={styles.optBtnText}>⚡ Recalculate AI Traffic Path</Text>
        </TouchableOpacity>
      </View>

      {/* Route Switcher Cards */}
      <View style={styles.routeCardsGrid}>
        {routes.map((route) => {
          const isSelected = route.id === activeRoute.id;
          const bus = buses.find((b) => b.routeId === route.id);
          return (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routePillCard,
                isSelected && styles.routePillCardActive,
                { borderLeftColor: route.color, borderLeftWidth: 4 },
              ]}
              onPress={() => setSelectedRouteId(route.id)}
              activeOpacity={0.8}
            >
              <View style={styles.routePillTop}>
                <Text style={[styles.routeCodeText, { color: route.color }]}>{route.code}</Text>
                {isSelected && <View style={styles.activeDot} />}
              </View>
              <Text style={styles.routeNameText}>{route.name}</Text>
              <Text style={styles.routeBusText}>Assigned: {bus?.number || 'Bus #101'}</Text>
              <View style={styles.routeMetaRow}>
                <Text style={styles.routeMetaText}>{route.totalDistance}</Text>
                <Text style={styles.routeMetaText}>•</Text>
                <Text style={styles.routeMetaText}>{route.stops.length} Stops</Text>
                <Text style={styles.routeMetaText}>•</Text>
                <Text style={styles.routeMetaText}>{route.estimatedDuration}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Route Detailed Cockpit */}
      <View style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={[styles.detailCode, { color: activeRoute.color }]}>{activeRoute.code}</Text>
              <Text style={styles.detailTitle}>{activeRoute.name}</Text>
            </View>
            <Text style={styles.detailSub}>
              Pilot: {assignedBus.driver} ({assignedBus.driverPhone}) • Vehicle: {assignedBus.number} ({assignedBus.regNo})
            </Text>
          </View>
          <View style={styles.statsPill}>
            <Text style={styles.statsPillNum}>{routeStudents.length}</Text>
            <Text style={styles.statsPillLabel}>Students On Route</Text>
          </View>
        </View>

        {/* Stops Table / Waypoints list */}
        <View style={styles.waypointList}>
          {activeRoute.stops.map((stop, index) => {
            const isFirst = index === 0;
            const isLast = index === activeRoute.stops.length - 1;
            const stopStudents = students.filter((s) => s.stopId === stop.id);

            return (
              <View key={stop.id} style={styles.waypointItem}>
                <View style={styles.waypointLeft}>
                  <View style={[styles.waypointIndexCircle, isFirst && styles.firstStopCircle, isLast && styles.lastStopCircle]}>
                    <Text style={styles.waypointIndexText}>{index + 1}</Text>
                  </View>
                </View>

                <View style={styles.waypointContent}>
                  <View style={styles.waypointTitleRow}>
                    <Text style={styles.waypointName}>{stop.name}</Text>
                    <View style={styles.schedBadge}>
                      <Text style={styles.schedTime}>{stop.scheduledTime}</Text>
                    </View>
                  </View>

                  <View style={styles.waypointMeta}>
                    <Text style={styles.coordsText}>
                      Coordinates: {stop.lat.toFixed(4)}°N, {stop.lng.toFixed(4)}°E
                    </Text>
                    <View style={styles.geofenceTag}>
                      <Text style={styles.geofenceTagText}>🛡️ 100m Geofence Active</Text>
                    </View>
                  </View>

                  {/* Students waiting or dropped at this stop */}
                  <View style={styles.stopStudentsContainer}>
                    <Text style={styles.stopStudentsLabel}>Passengers at stop ({stopStudents.length}):</Text>
                    <View style={styles.stopStudentsBadges}>
                      {stopStudents.length === 0 ? (
                        <Text style={styles.noStudentsText}>None assigned</Text>
                      ) : (
                        stopStudents.map((s) => (
                          <View key={s.id} style={styles.studentChip}>
                            <Text style={styles.studentChipEmoji}>{s.avatar}</Text>
                            <Text style={styles.studentChipName}>{s.name} ({s.grade})</Text>
                          </View>
                        ))
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
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
  optBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  optBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  routeCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 24,
  },
  routePillCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  routePillCardActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
    borderWidth: 2,
    shadowColor: '#16A34A',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  routePillTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeCodeText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  routeNameText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  routeBusText: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  routeMetaRow: {
    flexDirection: 'row',
    gap: 6,
  },
  routeMetaText: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFEDD5',
    paddingBottom: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  detailCode: {
    fontSize: 15,
    fontWeight: '900',
  },
  detailTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '900',
  },
  detailSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  statsPill: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  statsPillNum: {
    color: '#16A34A',
    fontSize: 18,
    fontWeight: '900',
  },
  statsPillLabel: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  waypointList: {
    gap: 14,
  },
  waypointItem: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#FFF7ED',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  waypointLeft: {
    alignItems: 'center',
  },
  waypointIndexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstStopCircle: {
    backgroundColor: '#16A34A',
    borderColor: '#B91C1C',
  },
  lastStopCircle: {
    backgroundColor: '#FF6B00',
    borderColor: '#EA580C',
  },
  waypointIndexText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '900',
  },
  waypointContent: {
    flex: 1,
  },
  waypointTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  waypointName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
  schedBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  schedTime: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: '800',
  },
  waypointMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  coordsText: {
    color: '#64748B',
    fontSize: 11,
  },
  geofenceTag: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  geofenceTagText: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '800',
  },
  stopStudentsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#FFEDD5',
    paddingTop: 8,
  },
  stopStudentsLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  stopStudentsBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  noStudentsText: {
    color: '#94A3B8',
    fontSize: 11,
    fontStyle: 'italic',
  },
  studentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  studentChipEmoji: {
    fontSize: 12,
  },
  studentChipName: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700',
  },
});

