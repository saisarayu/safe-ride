import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { Bell, Check, LogOut, Shield, X, Zap } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';

export default function Header({ onNotificationPress, onEmergencyPress, onTabNavigate }) {
  const { user, currentRoleKey, switchRole, logout, profiles } = useAuth();
  const { activeSOS, notifications, advanceSimulation, simulationTick } = useSafety();
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <View style={styles.headerWrapper}>
      {activeSOS && (
        <TouchableOpacity
          style={styles.sosBanner}
          activeOpacity={0.8}
          onPress={() => onEmergencyPress && onEmergencyPress()}
        >
          <Text style={styles.sosBannerText}>Emergency alert active</Text>
          <Text style={styles.sosBannerAction}>View incident</Text>
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <View style={styles.logoIcon}>
            <Shield size={21} color="#FFFFFF" strokeWidth={2.4} />
          </View>
          <View style={styles.brandCopy}>
            <Text style={styles.appName}>SafeRide<Text style={styles.appPlus}>+</Text></Text>
            <Text style={styles.subtitle} numberOfLines={1}>{user.roleTitle}</Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <TouchableOpacity
            style={styles.notifyButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
            accessibilityLabel={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell size={20} color="#29352D" strokeWidth={2} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setRoleModalVisible(true)}
            activeOpacity={0.75}
            accessibilityLabel="Open profile and switch role"
          >
            <Text style={styles.profileAvatar}>{user.avatar}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={roleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRoleModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setRoleModalVisible(false)}>
          <View style={styles.roleModalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Your profile</Text>
                <Text style={styles.modalSubtitle}>Switch SafeRide role</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setRoleModalVisible(false)} accessibilityLabel="Close profile menu">
                <X size={19} color="#59655D" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.rolesList} showsVerticalScrollIndicator={false}>
              {Object.keys(profiles).map((roleKey) => {
                const profile = profiles[roleKey];
                const isSelected = currentRoleKey === roleKey;
                return (
                  <TouchableOpacity
                    key={roleKey}
                    style={[styles.roleOptionCard, isSelected && styles.roleOptionSelected]}
                    activeOpacity={0.7}
                    onPress={() => {
                      switchRole(roleKey);
                      setRoleModalVisible(false);
                      if (onTabNavigate) onTabNavigate('home');
                    }}
                  >
                    <View style={styles.roleOptionAvatar}><Text style={styles.roleAvatarText}>{profile.avatar}</Text></View>
                    <View style={styles.roleOptionInfo}>
                      <Text style={styles.roleOptionTitle}>{profile.roleTitle}</Text>
                      <Text style={styles.roleOptionName}>{profile.name}</Text>
                    </View>
                    {isSelected && <Check size={20} color="#16803D" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity style={styles.simStepBtn} onPress={advanceSimulation} activeOpacity={0.7}>
              <Zap size={17} color="#176B37" />
              <Text style={styles.simStepText}>Advance trip simulation</Text>
              <Text style={styles.simulationTick}>#{simulationTick}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.7}>
              <LogOut size={17} color="#A13C3C" />
              <Text style={styles.logoutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBE6',
  },
  sosBanner: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFF1F0',
  },
  sosBannerText: {
    color: '#A83232',
    fontWeight: '700',
    fontSize: 12,
  },
  sosBannerAction: { color: '#A83232', fontSize: 12, fontWeight: '800' },
  header: {
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandCopy: { justifyContent: 'center' },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#16803D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    color: '#1A271E',
    fontSize: 18,
    fontWeight: '800',
  },
  appPlus: {
    color: '#16803D',
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    maxWidth: 180,
    color: '#748078',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#F3F6F3',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#D64545',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2EA',
  },
  profileAvatar: { fontSize: 21 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 31, 23, 0.38)',
    justifyContent: 'flex-end',
  },
  roleModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    width: '100%',
    maxHeight: '88%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D9E0D9',
    marginBottom: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    color: '#1A271E',
    fontSize: 20,
    fontWeight: '800',
  },
  modalSubtitle: { color: '#758078', fontSize: 12, marginTop: 3 },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F5F2',
  },
  rolesList: {
    flexGrow: 0,
    marginBottom: 14,
  },
  roleOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 68,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5EAE5',
    marginBottom: 8,
  },
  roleOptionSelected: {
    borderColor: '#8BBF91',
    backgroundColor: '#F2F8F2',
  },
  roleOptionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F5F2',
  },
  roleAvatarText: { fontSize: 22 },
  roleOptionInfo: { flex: 1 },
  roleOptionTitle: {
    color: '#27332A',
    fontSize: 14,
    fontWeight: '700',
  },
  roleOptionName: {
    color: '#758078',
    fontSize: 12,
    marginTop: 2,
  },
  simStepBtn: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#EAF3EA',
  },
  simStepText: { color: '#176B37', fontSize: 13, fontWeight: '700', flex: 1 },
  simulationTick: { color: '#65806A', fontSize: 12, fontWeight: '700' },
  logoutButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  logoutText: { color: '#A13C3C', fontSize: 13, fontWeight: '700' },
});

