import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Svg, { Circle, Line, Polyline, Rect, Text as SvgText, G } from 'react-native-svg';
import { useSafety } from '../../context/SafetyContext';

export default function LiveTrackingScreen() {
  const { buses, routes, students, advanceSimulation, triggerSOS } = useSafety();
  const [selectedBusId, setSelectedBusId] = useState('bus-1');
  const [mapLayer, setMapLayer] = useState('radar'); // 'radar', 'geofence', 'traffic'

  const activeBus = buses.find((b) => b.id === selectedBusId) || buses[0];
  const activeRoute = routes.find((r) => r.id === activeBus.routeId) || routes[0];

  // Map coordinates projection logic for SVG canvas (width 700, height 360)
  // Maps route stops onto canvas points
  const stopPoints = activeRoute.stops.map((stop, index) => {
    const total = activeRoute.stops.length;
    const progress = index / (total - 1);
    // Draw an organic S-curve path across the screen
    const x = 70 + progress * 560;
    const y = 180 + Math.sin(progress * Math.PI * 2) * 80;
    return { ...stop, x, y };
  });

  const polylinePointsStr = stopPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Calculate current bus position along the curve
  const currentStopIndex = Math.min(activeBus.currentStopIndex, stopPoints.length - 1);
  const busPos = stopPoints[currentStopIndex] || stopPoints[0];

  const assignedStudents = students.filter((s) => s.busId === activeBus.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Bus Switcher Bar */}
      <View style={styles.busSelectorBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.busSelectorScroll}>
          {buses.map((bus) => {
            const isSelected = bus.id === activeBus.id;
            return (
              <TouchableOpacity
                key={bus.id}
                style={[styles.busChip, isSelected && styles.busChipActive]}
                onPress={() => setSelectedBusId(bus.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.busChipDot, { backgroundColor: isSelected ? '#38bdf8' : '#10b981' }]} />
                <View>
                  <Text style={[styles.busChipTitle, isSelected && styles.busChipTitleActive]}>
                    {bus.number} ({bus.name})
                  </Text>
                  <Text style={styles.busChipSub}>
                    {bus.speed} km/h • {bus.nextStop}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main HUD & Radar Screen */}
      <View style={styles.radarCard}>
        {/* Radar Map Controls & Status Header */}
        <View style={styles.radarHeader}>
          <View style={styles.radarHeaderLeft}>
            <View style={styles.radarIndicator}>
              <View style={styles.blinkingRadarDot} />
              <Text style={styles.radarTitle}>SATELLITE TELEMETRY RADAR</Text>
            </View>
            <Text style={styles.radarCoords}>
              GPS: {activeBus.lat.toFixed(5)}°N, {activeBus.lng.toFixed(5)}°E • HDOP 0.8m
            </Text>
          </View>

          <View style={styles.layerSelector}>
            <TouchableOpacity
              style={[styles.layerBtn, mapLayer === 'radar' && styles.layerBtnActive]}
              onPress={() => setMapLayer('radar')}
            >
              <Text style={[styles.layerBtnText, mapLayer === 'radar' && styles.layerBtnTextActive]}>
                Vector Radar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.layerBtn, mapLayer === 'geofence' && styles.layerBtnActive]}
              onPress={() => setMapLayer('geofence')}
            >
              <Text style={[styles.layerBtnText, mapLayer === 'geofence' && styles.layerBtnTextActive]}>
                100m Geofences
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.layerBtn, mapLayer === 'traffic' && styles.layerBtnActive]}
              onPress={() => setMapLayer('traffic')}
            >
              <Text style={[styles.layerBtnText, mapLayer === 'traffic' && styles.layerBtnTextActive]}>
                Traffic Flow
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Interactive SVG Radar Map Viewport */}
        <View style={styles.svgContainer}>
          <Svg width="100%" height="360" viewBox="0 0 700 360">
            {/* Grid background lines */}
            <Line x1="0" y1="90" x2="700" y2="90" stroke="#FED7AA" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="0" y1="180" x2="700" y2="180" stroke="#FED7AA" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="0" y1="270" x2="700" y2="270" stroke="#FED7AA" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="175" y1="0" x2="175" y2="360" stroke="#FED7AA" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="350" y1="0" x2="350" y2="360" stroke="#FED7AA" strokeWidth="1" strokeDasharray="4 4" />
            <Line x1="525" y1="0" x2="525" y2="360" stroke="#FED7AA" strokeWidth="1" strokeDasharray="4 4" />

            {/* Simulated Road Highway Ribbon */}
            <Polyline
              points={polylinePointsStr}
              fill="none"
              stroke="#FFEDD5"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Active route path */}
            <Polyline
              points={polylinePointsStr}
              fill="none"
              stroke={mapLayer === 'traffic' ? '#FF6B00' : '#16A34A'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stops */}
            {stopPoints.map((stop, i) => {
              const isPassed = i < currentStopIndex;
              const isCurrent = i === currentStopIndex;

              return (
                <G key={stop.id}>
                  {/* Geofence Ring if active layer */}
                  {mapLayer === 'geofence' && (
                    <Circle
                      cx={stop.x}
                      cy={stop.y}
                      r="34"
                      fill="rgba(255, 107, 0, 0.1)"
                      stroke="#FF6B00"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Stop Marker Node */}
                  <Circle
                    cx={stop.x}
                    cy={stop.y}
                    r={isCurrent ? 13 : 9}
                    fill={isCurrent ? "#16A34A" : isPassed ? "#FF6B00" : "#CBD5E1"}
                    stroke="#ffffff"
                    strokeWidth={isCurrent ? 3 : 2}
                  />

                  {/* Stop Label */}
                  <SvgText
                    x={stop.x}
                    y={stop.y > 200 ? stop.y + 24 : stop.y - 18}
                    fill="#0F172A"
                    fontSize="11"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {stop.name.split(' ')[0]}
                  </SvgText>
                  <SvgText
                    x={stop.x}
                    y={stop.y > 200 ? stop.y + 36 : stop.y - 6}
                    fill="#EA580C"
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {stop.scheduledTime}
                  </SvgText>
                </G>
              );
            })}

            {/* Animated Bus Icon Pin */}
            <G>
              {/* Radar pulse around bus */}
              <Circle
                cx={busPos.x}
                cy={busPos.y}
                r="26"
                fill="rgba(22, 163, 74, 0.2)"
                stroke="#16A34A"
                strokeWidth="2"
              />
              <Rect
                x={busPos.x - 15}
                y={busPos.y - 15}
                width="30"
                height="30"
                rx="8"
                fill="#16A34A"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <SvgText
                x={busPos.x}
                y={busPos.y + 6}
                fill="#ffffff"
                fontSize="15"
                fontWeight="900"
                textAnchor="middle"
              >
                🚌
              </SvgText>

              {/* Overhead Bus Callout */}
              <Rect
                x={busPos.x - 52}
                y={busPos.y - 46}
                width="104"
                height="24"
                rx="6"
                fill="#FFFFFF"
                stroke="#FF6B00"
                strokeWidth="1.5"
              />
              <SvgText
                x={busPos.x}
                y={busPos.y - 30}
                fill="#16A34A"
                fontSize="10"
                fontWeight="900"
                textAnchor="middle"
              >
                {activeBus.number} • {activeBus.speed}km/h
              </SvgText>
            </G>
          </Svg>

          {/* Quick simulation controls floating on map */}
          <View style={styles.floatingControls}>
            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={advanceSimulation}
              activeOpacity={0.8}
            >
              <Text style={styles.floatingBtnText}>⏩ Advance Telemetry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.floatingBtn, { backgroundColor: '#16A34A' }]}
              onPress={() => triggerSOS('Route Obstruction Panic', activeBus.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.floatingBtnText}>🚨 Trigger SOS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HUD Telemetry Cockpit Panel */}
        <View style={styles.telemetryHUD}>
          <View style={styles.hudStat}>
            <Text style={styles.hudLabel}>VELOCITY</Text>
            <Text style={styles.hudValue}>{activeBus.speed} <Text style={styles.hudUnit}>km/h</Text></Text>
            <Text style={styles.hudSub}>Speed governor active</Text>
          </View>

          <View style={styles.hudDivider} />

          <View style={styles.hudStat}>
            <Text style={styles.hudLabel}>APPROACHING STOP</Text>
            <Text style={[styles.hudValue, { color: '#38bdf8' }]} numberOfLines={1}>
              {activeBus.nextStop}
            </Text>
            <Text style={styles.hudSub}>ETA: ~{activeBus.etaMins} mins</Text>
          </View>

          <View style={styles.hudDivider} />

          <View style={styles.hudStat}>
            <Text style={styles.hudLabel}>PASSENGER PAYLOAD</Text>
            <Text style={styles.hudValue}>
              {activeBus.currentOccupancy} / {activeBus.capacity}
            </Text>
            <Text style={styles.hudSub}>
              {assignedStudents.filter((s) => s.status === 'boarded').length} Boarded
            </Text>
          </View>

          <View style={styles.hudDivider} />

          <View style={styles.hudStat}>
            <Text style={styles.hudLabel}>PILOT & ESCORT</Text>
            <Text style={styles.hudValue} numberOfLines={1}>{activeBus.driver}</Text>
            <Text style={styles.hudSub}>{activeBus.driverPhone}</Text>
          </View>
        </View>
      </View>

      {/* Stop Waypoints & Student Manifest Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>
          {activeRoute.name} — Stop Sequence & Manifest
        </Text>
        <Text style={styles.timelineSub}>
          Total Distance: {activeRoute.totalDistance} • Expected Travel: {activeRoute.estimatedDuration}
        </Text>

        <View style={styles.stopsList}>
          {activeRoute.stops.map((stop, i) => {
            const isPassed = i < currentStopIndex;
            const isCurrent = i === currentStopIndex;
            const stopStudents = students.filter((s) => s.stopId === stop.id);

            return (
              <View key={stop.id} style={styles.stopTimelineItem}>
                <View style={styles.timelineLeftCol}>
                  <View
                    style={[
                      styles.timelineNode,
                      isCurrent && styles.timelineNodeCurrent,
                      isPassed && styles.timelineNodePassed,
                    ]}
                  >
                    <Text style={styles.timelineNodeText}>
                      {isPassed ? '✓' : isCurrent ? '🚌' : i + 1}
                    </Text>
                  </View>
                  {i < activeRoute.stops.length - 1 && <View style={styles.timelineStem} />}
                </View>

                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.stopNameText}>{stop.name}</Text>
                    <View style={styles.timeTag}>
                      <Text style={styles.timeTagText}>{stop.scheduledTime}</Text>
                    </View>
                  </View>

                  <View style={styles.studentBadgesRow}>
                    {stopStudents.length === 0 ? (
                      <Text style={styles.noStudentsText}>No students assigned to stop</Text>
                    ) : (
                      stopStudents.map((st) => (
                        <View key={st.id} style={styles.studentBadge}>
                          <Text style={styles.studentBadgeEmoji}>{st.avatar}</Text>
                          <Text style={styles.studentBadgeName}>{st.name}</Text>
                          <View
                            style={[
                              styles.studentStatusPill,
                              st.status === 'boarded' && styles.statusBoarded,
                              st.status === 'safe_dropped' && styles.statusDropped,
                            ]}
                          >
                            <Text style={styles.studentStatusPillText}>
                              {st.status.replace('_', ' ').toUpperCase()}
                            </Text>
                          </View>
                        </View>
                      ))
                    )}
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
    backgroundColor: '#FFF9F5',
  },
  content: {
    padding: 20,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  busSelectorBar: {
    marginBottom: 16,
  },
  busSelectorScroll: {
    gap: 10,
  },
  busChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  busChipActive: {
    borderColor: '#16A34A',
    backgroundColor: '#DCFCE7',
    borderWidth: 2,
    shadowColor: '#16A34A',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  busChipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  busChipTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
  },
  busChipTitleActive: {
    color: '#16A34A',
  },
  busChipSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  radarCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: '#FED7AA',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: '#FFF7ED',
  },
  radarHeaderLeft: {
    gap: 4,
  },
  radarIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  blinkingRadarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  radarTitle: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  radarCoords: {
    color: '#64748B',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  layerSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 10,
    padding: 3,
  },
  layerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  layerBtnActive: {
    backgroundColor: '#16A34A',
  },
  layerBtnText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  layerBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  svgContainer: {
    backgroundColor: '#FFFDFB',
    position: 'relative',
    borderBottomWidth: 1.5,
    borderBottomColor: '#FED7AA',
  },
  floatingControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 10,
  },
  floatingBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  telemetryHUD: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#FED7AA',
    padding: 16,
  },
  hudStat: {
    flex: 1,
    minWidth: 130,
    paddingHorizontal: 12,
  },
  hudDivider: {
    width: 1.5,
    backgroundColor: '#FED7AA',
  },
  hudLabel: {
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  hudValue: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  hudUnit: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  hudSub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  timelineTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
  },
  timelineSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  stopsList: {
    gap: 6,
  },
  stopTimelineItem: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineLeftCol: {
    alignItems: 'center',
    width: 32,
  },
  timelineNode: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FED7AA',
  },
  timelineNodeCurrent: {
    backgroundColor: '#16A34A',
    borderColor: '#B91C1C',
  },
  timelineNodePassed: {
    backgroundColor: '#FF6B00',
    borderColor: '#EA580C',
  },
  timelineNodeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  timelineStem: {
    width: 2,
    flex: 1,
    backgroundColor: '#FED7AA',
    marginVertical: 4,
    minHeight: 40,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stopNameText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
  timeTag: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timeTagText: {
    color: '#EA580C',
    fontSize: 11,
    fontWeight: '800',
  },
  studentBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  noStudentsText: {
    color: '#94A3B8',
    fontSize: 12,
    fontStyle: 'italic',
  },
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  studentBadgeEmoji: {
    fontSize: 13,
  },
  studentBadgeName: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  studentStatusPill: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBoarded: {
    backgroundColor: '#DCFCE7',
  },
  statusDropped: {
    backgroundColor: '#16A34A',
  },
  studentStatusPillText: {
    color: '#16A34A',
    fontSize: 9,
    fontWeight: '900',
  },
});

