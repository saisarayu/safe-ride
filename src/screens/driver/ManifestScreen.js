import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafety } from '../../context/SafetyContext';
import { useAuth } from '../../context/AuthContext';

export default function ManifestScreen() {
  const { students, simulateRFIDScan, buses } = useSafety();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const currentBus = buses.find((b) => b.id === (user.busId || 'bus-1')) || buses[0];
  const busStudents = students.filter((s) => s.busId === currentBus.id);

  const filtered = busStudents.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(search.toLowerCase()) || s.stopName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesQuery && matchesFilter;
  });

  const boardedCount = busStudents.filter((s) => s.status === 'boarded').length;
  const waitingCount = busStudents.filter((s) => s.status === 'waiting').length;
  const droppedCount = busStudents.filter((s) => s.status === 'safe_dropped').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.headerKicker}>DIGITAL ESCORT MANIFEST & NFC / RFID SENSOR</Text>
          <Text style={styles.headerTitle}>{currentBus.number} Passenger Manifest</Text>
          <Text style={styles.headerSub}>
            Tap individual student cards or simulated RFID badges below to register boardings & safe drops.
          </Text>
        </View>

        {/* Real-Time Hardware Counter */}
        <View style={styles.occupancyDialCard}>
          <Text style={styles.occupancyDialNum}>{boardedCount} / {currentBus.capacity}</Text>
          <Text style={styles.occupancyDialLabel}>Live Occupancy</Text>
        </View>
      </View>

      {/* Filter Chips & Search */}
      <View style={styles.filterBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search student or stop..."
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.chipsRow}>
          {[
            { key: 'all', label: `All (${busStudents.length})` },
            { key: 'boarded', label: `On Board (${boardedCount})` },
            { key: 'waiting', label: `Waiting (${waitingCount})` },
            { key: 'safe_dropped', label: `Dropped (${droppedCount})` },
          ].map((c) => (
            <TouchableOpacity
              key={c.key}
              style={[styles.chipBtn, filter === c.key && styles.chipBtnActive]}
              onPress={() => setFilter(c.key)}
            >
              <Text style={[styles.chipText, filter === c.key && styles.chipTextActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Manifest List */}
      <View style={styles.manifestList}>
        {filtered.map((st) => (
          <View key={st.id} style={styles.manifestRow}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarEmoji}>{st.avatar}</Text>
            </View>

            <View style={styles.infoCol}>
              <View style={styles.nameRow}>
                <Text style={styles.studentName}>{st.name}</Text>
                <Text style={styles.rollTag}>Roll #{st.rollNo} • {st.grade}</Text>
              </View>
              <Text style={styles.stopName}>Stop: {st.stopName}</Text>
              <Text style={styles.rfidCode}>RFID: {st.rfidTag}</Text>
            </View>

            {/* Status & Tap action button */}
            <View style={styles.actionCol}>
              <TouchableOpacity
                style={[
                  styles.tapScanBtn,
                  st.status === 'waiting' && styles.tapScanBoard,
                  st.status === 'boarded' && styles.tapScanDrop,
                  st.status === 'safe_dropped' && styles.tapScanReset,
                ]}
                onPress={() => simulateRFIDScan(st.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.tapScanBtnText}>
                  {st.status === 'waiting' && '📶 Tap to Board'}
                  {st.status === 'boarded' && '🛡️ Tap Safe-Drop'}
                  {st.status === 'safe_dropped' && '✅ Drop Verified'}
                  {st.status === 'absent' && '❌ Absent'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F5', // Light warm background
  },
  content: {
    padding: 20,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 18,
    padding: 20,
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
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  headerTitle: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  headerSub: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
    maxWidth: 550,
  },
  occupancyDialCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  occupancyDialNum: {
    color: '#38bdf8',
    fontSize: 22,
    fontWeight: '900',
  },
  occupancyDialLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  filterBar: {
    marginBottom: 18,
    gap: 12,
  },
  searchInput: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipBtn: {
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  chipBtnActive: {
    backgroundColor: '#FF6B00',
    borderColor: '#16A34A',
  },
  chipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  manifestList: {
    gap: 10,
  },
  manifestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1322',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    gap: 14,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#131b2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  studentName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  rollTag: {
    color: '#64748b',
    fontSize: 11,
  },
  stopName: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  rfidCode: {
    color: '#38bdf8',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  actionCol: {
    minWidth: 140,
  },
  tapScanBtn: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tapScanBoard: {
    backgroundColor: '#FF6B00',
  },
  tapScanDrop: {
    backgroundColor: '#16A34A',
  },
  tapScanReset: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  tapScanBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
});

