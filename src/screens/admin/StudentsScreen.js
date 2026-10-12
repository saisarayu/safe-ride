import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useSafety } from '../../context/SafetyContext';

export default function StudentsScreen() {
  const { students, simulateRFIDScan, markStudentAbsent } = useSafety();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = students.filter((s) => {
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.stopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rfidTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || s.status === statusFilter;
    return matchesQuery && matchesFilter;
  });

  const counts = {
    all: students.length,
    boarded: students.filter((s) => s.status === 'boarded').length,
    safe_dropped: students.filter((s) => s.status === 'safe_dropped').length,
    waiting: students.filter((s) => s.status === 'waiting').length,
    absent: students.filter((s) => s.status === 'absent').length,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerKicker}>STUDENT ROSTER & RFID REGISTRY</Text>
          <Text style={styles.headerTitle}>Student Safety Directory</Text>
          <Text style={styles.headerSub}>
            Real-time biometric & RFID transit monitoring across all district bus routes.
          </Text>
        </View>

        {/* Counter Pills */}
        <View style={styles.statPillsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statPillNum}>{counts.all}</Text>
            <Text style={styles.statPillLabel}>Enrolled</Text>
          </View>
          <View style={[styles.statPill, { borderColor: '#16A34A' }]}>
            <Text style={[styles.statPillNum, { color: '#16A34A' }]}>{counts.boarded}</Text>
            <Text style={styles.statPillLabel}>On Bus</Text>
          </View>
          <View style={[styles.statPill, { borderColor: '#FF6B00' }]}>
            <Text style={[styles.statPillNum, { color: '#EA580C' }]}>{counts.safe_dropped}</Text>
            <Text style={styles.statPillLabel}>Dropped</Text>
          </View>
          <View style={[styles.statPill, { borderColor: '#EA580C' }]}>
            <Text style={[styles.statPillNum, { color: '#FF6B00' }]}>{counts.waiting}</Text>
            <Text style={styles.statPillLabel}>Waiting</Text>
          </View>
          <View style={[styles.statPill, { borderColor: '#16A34A' }]}>
            <Text style={[styles.statPillNum, { color: '#16A34A' }]}>{counts.absent}</Text>
            <Text style={styles.statPillLabel}>Absent</Text>
          </View>
        </View>
      </View>

      {/* Search and Filters Bar */}
      <View style={styles.searchBarRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by student name, roll #, stop, or RFID tag..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterTabs}>
          {['all', 'boarded', 'safe_dropped', 'waiting', 'absent'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, statusFilter === f && styles.filterBtnActive]}
              onPress={() => setStatusFilter(f)}
            >
              <Text style={[styles.filterBtnText, statusFilter === f && styles.filterBtnTextActive]}>
                {f.replace('_', ' ').toUpperCase()} ({counts[f]})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Student Cards Grid */}
      <View style={styles.cardsGrid}>
        {filteredStudents.map((st) => {
          return (
            <View key={st.id} style={styles.studentCard}>
              <View style={styles.cardTop}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarEmoji}>{st.avatar}</Text>
                </View>
                <View style={styles.cardHeaderInfo}>
                  <Text style={styles.studentName}>{st.name}</Text>
                  <Text style={styles.studentGrade}>{st.grade} • Roll #{st.rollNo}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    st.status === 'boarded' && styles.statusBadgeBoarded,
                    st.status === 'safe_dropped' && styles.statusBadgeDropped,
                    st.status === 'waiting' && styles.statusBadgeWaiting,
                    st.status === 'absent' && styles.statusBadgeAbsent,
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {st.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>ASSIGNED BUS</Text>
                  <Text style={styles.metaVal}>{st.busNumber}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>BLOOD GROUP</Text>
                  <Text style={[styles.metaVal, { color: '#f87171' }]}>{st.bloodGroup}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>RFID TAG</Text>
                  <Text style={styles.metaValCode}>{st.rfidTag}</Text>
                </View>
              </View>

              <View style={styles.stopInfoBox}>
                <Text style={styles.stopInfoLabel}>DESIGNATED STOP</Text>
                <Text style={styles.stopInfoVal}>{st.stopName}</Text>
                {st.boardTime && (
                  <Text style={styles.timestampNote}>Boarded at: {st.boardTime}</Text>
                )}
                {st.dropTime && (
                  <Text style={[styles.timestampNote, { color: '#34d399' }]}>
                    Dropped at: {st.dropTime} ({st.verificationDistance}m verified)
                  </Text>
                )}
              </View>

              <View style={styles.guardianRow}>
                <Text style={styles.guardianText}>
                  Guardian: <Text style={{ color: '#ffffff', fontWeight: '700' }}>{st.guardianName}</Text> ({st.guardianRelation})
                </Text>
                <Text style={styles.phoneText}>{st.guardianPhone}</Text>
              </View>

              {st.medicalNotes !== 'None' && (
                <View style={styles.medicalAlertBox}>
                  <Text style={styles.medicalAlertText}>⚠️ {st.medicalNotes}</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.rfidSimBtn}
                  onPress={() => simulateRFIDScan(st.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.rfidSimBtnText}>
                    {st.status === 'waiting'
                      ? '📶 Tap RFID to Board'
                      : st.status === 'boarded'
                      ? '🛡️ Tap RFID Safe-Drop'
                      : '🔄 Reset to Waiting'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.detailsBtn}
                  onPress={() => setSelectedStudent(st)}
                >
                  <Text style={styles.detailsBtnText}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Student Details Modal */}
      {selectedStudent && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedStudent(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedStudent(null)}
          >
            <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text style={{ fontSize: 32 }}>{selectedStudent.avatar}</Text>
                  <View>
                    <Text style={styles.modalTitle}>{selectedStudent.name}</Text>
                    <Text style={styles.modalSubtitle}>{selectedStudent.grade} • Roll #{selectedStudent.rollNo}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedStudent(null)}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalFieldLabel}>RFID TRANSPONDER ID</Text>
                  <Text style={styles.modalFieldVal}>{selectedStudent.rfidTag} (13.56 MHz High-Frequency)</Text>
                </View>
                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalFieldLabel}>PRIMARY CONTACT / GUARDIAN</Text>
                  <Text style={styles.modalFieldVal}>{selectedStudent.guardianName} ({selectedStudent.guardianRelation}) — {selectedStudent.guardianPhone}</Text>
                </View>
                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalFieldLabel}>TRANSIT ASSIGNMENT</Text>
                  <Text style={styles.modalFieldVal}>{selectedStudent.busNumber} • Stop: {selectedStudent.stopName}</Text>
                </View>
                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalFieldLabel}>MEDICAL & EMERGENCY ALLERGIES</Text>
                  <Text style={[styles.modalFieldVal, { color: '#fbbf24' }]}>{selectedStudent.medicalNotes}</Text>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalActionBtn, { backgroundColor: '#ef4444' }]}
                    onPress={() => {
                      markStudentAbsent(selectedStudent.id, 'Parent requested excused absence');
                      setSelectedStudent(null);
                    }}
                  >
                    <Text style={styles.modalActionBtnText}>Mark Absent for Day</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalActionBtn, { backgroundColor: '#2563eb' }]}
                    onPress={() => {
                      simulateRFIDScan(selectedStudent.id);
                      setSelectedStudent(null);
                    }}
                  >
                    <Text style={styles.modalActionBtnText}>Simulate RFID Scan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
  statPillsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  statPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  statPillNum: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
  },
  statPillLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  searchBarRow: {
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
    shadowColor: '#FF6B00',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  filterTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterBtnActive: {
    backgroundColor: '#16A34A',
    borderColor: '#B91C1C',
    shadowColor: '#16A34A',
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  filterBtnText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  studentCard: {
    flex: 1,
    minWidth: 320,
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#FF6B00',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FF6B00',
  },
  avatarEmoji: {
    fontSize: 24,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  studentName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  studentGrade: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeBoarded: {
    backgroundColor: '#FFEDD5',
  },
  statusBadgeDropped: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeWaiting: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  statusBadgeAbsent: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeText: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '900',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    color: '#EA580C',
    fontSize: 9,
    fontWeight: '800',
  },
  metaVal: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  metaValCode: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
  },
  stopInfoBox: {
    marginBottom: 10,
  },
  stopInfoLabel: {
    color: '#EA580C',
    fontSize: 9,
    fontWeight: '800',
  },
  stopInfoVal: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  timestampNote: {
    color: '#FF6B00',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  guardianRow: {
    borderTopWidth: 1,
    borderTopColor: '#FFEDD5',
    paddingTop: 10,
    marginBottom: 10,
  },
  guardianText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  phoneText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  medicalAlertBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  medicalAlertText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rfidSimBtn: {
    flex: 1,
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    shadowColor: '#FF6B00',
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  rfidSimBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  detailsBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  detailsBtnText: {
    color: '#EA580C',
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF6B00',
    borderRadius: 18,
    width: '100%',
    maxWidth: 500,
    padding: 22,
    shadowColor: '#16A34A',
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFEDD5',
    paddingBottom: 14,
  },
  modalTitle: {
    color: '#16A34A',
    fontSize: 18,
    fontWeight: '900',
  },
  modalSubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    color: '#94A3B8',
    fontSize: 20,
    padding: 4,
    fontWeight: '700',
  },
  modalBody: {
    gap: 12,
  },
  modalFieldGroup: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
    borderRadius: 10,
  },
  modalFieldLabel: {
    color: '#EA580C',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  modalFieldVal: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalActionBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

