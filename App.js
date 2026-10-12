import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, Modal, Pressable } from 'react-native';
import { Bell, BusFront, CalendarDays, CircleEllipsis, ClipboardList, House, LayoutDashboard, Map, Siren, ShieldCheck, TriangleAlert, Users, Waypoints } from 'lucide-react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SafetyProvider, useSafety } from './src/context/SafetyContext';

import Header from './src/components/Header';
import LoginScreen from './src/screens/LoginScreen';

// Admin Screens
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import StudentsScreen from './src/screens/admin/StudentsScreen';
import FleetScreen from './src/screens/admin/FleetScreen';
import RoutesScreen from './src/screens/admin/RoutesScreen';
import MissingStudentsScreen from './src/screens/admin/MissingStudentsScreen';
import SafeDropScreen from './src/screens/admin/SafeDropScreen';
import EmergencyScreen from './src/screens/admin/EmergencyScreen';

// Driver Screens
import DriverHomeScreen from './src/screens/driver/DriverHomeScreen';
import ManifestScreen from './src/screens/driver/ManifestScreen';
import DriverSOSScreen from './src/screens/driver/DriverSOSScreen';

// Parent Screens
import ParentHomeScreen from './src/screens/parent/ParentHomeScreen';
import ParentAttendanceScreen from './src/screens/parent/ParentAttendanceScreen';

// Student Screens
import StudentHomeScreen from './src/screens/student/StudentHomeScreen';

// Common Screens
import LiveTrackingScreen from './src/screens/common/LiveTrackingScreen';
import NotificationsScreen from './src/screens/common/NotificationsScreen';

const NAVIGATION = {
  admin: [
    { key: 'home', label: 'Overview', Icon: LayoutDashboard },
    { key: 'tracking', label: 'Live map', Icon: Map },
    { key: 'students', label: 'Students', Icon: Users },
    { key: 'more', label: 'More', Icon: CircleEllipsis },
  ],
  driver: [
    { key: 'home', label: 'Trip', Icon: House },
    { key: 'manifest', label: 'Manifest', Icon: ClipboardList },
    { key: 'tracking', label: 'Route', Icon: Map },
    { key: 'sos', label: 'SOS', Icon: Siren, danger: true },
  ],
  parent: [
    { key: 'home', label: 'Home', Icon: House },
    { key: 'tracking', label: 'Track', Icon: Map },
    { key: 'attendance', label: 'Activity', Icon: CalendarDays },
  ],
  student: [
    { key: 'home', label: 'My pass', Icon: House },
    { key: 'tracking', label: 'Track bus', Icon: Map },
  ],
};

const ADMIN_TOOLS = [
  { key: 'fleet', label: 'Fleet', detail: 'Vehicles and driver status', Icon: BusFront },
  { key: 'routes', label: 'Routes', detail: 'Stops and route coverage', Icon: Waypoints },
  { key: 'safedrop', label: 'Safe drop', detail: 'Verified handovers', Icon: ShieldCheck },
  { key: 'missing', label: 'Student alerts', detail: 'Review boarding alerts', Icon: TriangleAlert },
  { key: 'emergency', label: 'Emergency', detail: 'Active SOS incidents', Icon: Siren },
];

function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const { activeSOS, missingAlerts, advanceSimulation } = useSafety();
  const [currentTab, setCurrentTab] = useState('home');
  const [moreVisible, setMoreVisible] = useState(false);

  // Reset tab to home if role switches
  useEffect(() => {
    setCurrentTab('home');
  }, [user?.role]);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const tabs = NAVIGATION[user?.role] || NAVIGATION.admin;

  const navigate = (tab) => {
    setCurrentTab(tab);
    setMoreVisible(false);
  };

  // Render active screen
  const renderScreen = () => {
    if (currentTab === 'notifications') {
      return <NotificationsScreen />;
    }
    if (currentTab === 'tracking') {
      return <LiveTrackingScreen />;
    }

    switch (user?.role) {
      case 'admin':
        switch (currentTab) {
          case 'home': return <AdminDashboardScreen onNavigate={setCurrentTab} />;
          case 'students': return <StudentsScreen />;
          case 'fleet': return <FleetScreen />;
          case 'routes': return <RoutesScreen />;
          case 'missing': return <MissingStudentsScreen />;
          case 'safedrop': return <SafeDropScreen />;
          case 'emergency': return <EmergencyScreen />;
          default: return <AdminDashboardScreen onNavigate={setCurrentTab} />;
        }
      case 'driver':
        switch (currentTab) {
          case 'home': return <DriverHomeScreen onNavigate={setCurrentTab} />;
          case 'manifest': return <ManifestScreen />;
          case 'sos': return <DriverSOSScreen />;
          default: return <DriverHomeScreen onNavigate={setCurrentTab} />;
        }
      case 'parent':
        switch (currentTab) {
          case 'home': return <ParentHomeScreen />;
          case 'attendance': return <ParentAttendanceScreen />;
          default: return <ParentHomeScreen />;
        }
      case 'student':
        switch (currentTab) {
          case 'home': return <StudentHomeScreen />;
          default: return <StudentHomeScreen />;
        }
      default:
        return <AdminDashboardScreen onNavigate={setCurrentTab} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header
        onNotificationPress={() => setCurrentTab('notifications')}
        onEmergencyPress={() => setCurrentTab('emergency')}
        onTabNavigate={navigate}
      />
      <View style={styles.contentContainer}>
        {renderScreen()}
      </View>
      <View style={styles.tabBar}>
        {tabs.map(({ key, label, Icon, danger }) => {
          const isActive = key === 'more' ? moreVisible : currentTab === key;
          const badgeCount = key === 'more' ? missingAlerts.length + (activeSOS ? 1 : 0) : 0;
          return (
            <TouchableOpacity
              key={key}
              style={styles.tabButton}
              onPress={() => key === 'more' ? setMoreVisible(true) : navigate(key)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <View style={styles.tabIconWrap}>
                <Icon size={21} color={danger ? '#D14343' : isActive ? '#15803D' : '#738078'} strokeWidth={isActive ? 2.5 : 2} />
                {badgeCount > 0 && <View style={styles.tabBadge}><Text style={styles.tabBadgeText}>{badgeCount > 9 ? '9+' : badgeCount}</Text></View>}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive, danger && styles.dangerTabLabel]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal visible={moreVisible} transparent animationType="slide" onRequestClose={() => setMoreVisible(false)}>
        <Pressable style={styles.sheetOverlay} onPress={() => setMoreVisible(false)}>
          <Pressable style={styles.moreSheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeading}>
              <View>
                <Text style={styles.sheetTitle}>Admin tools</Text>
                <Text style={styles.sheetSubtitle}>Manage your school transport</Text>
              </View>
              <TouchableOpacity style={styles.sheetClose} onPress={() => setMoreVisible(false)} accessibilityLabel="Close tools">
                <Text style={styles.sheetCloseText}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.toolsGrid}>
              {ADMIN_TOOLS.map(({ key, label, detail, Icon }) => {
                const badge = key === 'missing' ? missingAlerts.length : key === 'emergency' && activeSOS ? 1 : 0;
                return (
                  <TouchableOpacity key={key} style={styles.toolButton} onPress={() => navigate(key)} activeOpacity={0.7}>
                    <View style={styles.toolIconWrap}><Icon size={21} color={key === 'emergency' ? '#C43D3D' : '#15803D'} /></View>
                    <View style={styles.toolText}>
                      <Text style={styles.toolLabel}>{label}</Text>
                      <Text style={styles.toolDetail} numberOfLines={1}>{detail}</Text>
                    </View>
                    {badge > 0 && <View style={styles.toolBadge}><Text style={styles.toolBadgeText}>{badge}</Text></View>}
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.simulationButton} onPress={advanceSimulation} activeOpacity={0.7}>
              <Text style={styles.simulationButtonText}>Advance route simulation</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SafetyProvider>
        <MainApp />
      </SafetyProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7F4',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F5F7F4',
  },
  tabBar: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E6EBE6',
    paddingHorizontal: 8,
    paddingTop: 5,
    paddingBottom: 4,
  },
  tabButton: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabIconWrap: {
    width: 36,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    color: '#738078',
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#15803D',
    fontWeight: '800',
  },
  dangerTabLabel: {
    color: '#C43D3D',
  },
  tabBadge: {
    position: 'absolute',
    top: -2,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    backgroundColor: '#D64545',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(20, 31, 23, 0.38)',
  },
  moreSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D9E0D9',
    marginBottom: 18,
  },
  sheetHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sheetTitle: {
    color: '#18231B',
    fontSize: 20,
    fontWeight: '800',
  },
  sheetSubtitle: {
    color: '#758078',
    fontSize: 12,
    marginTop: 3,
  },
  sheetClose: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#F2F5F2',
  },
  sheetCloseText: {
    color: '#536057',
    fontSize: 24,
    lineHeight: 27,
  },
  toolsGrid: {
    gap: 8,
  },
  toolButton: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F5F7F4',
  },
  toolIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8F3E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolText: {
    flex: 1,
  },
  toolLabel: {
    color: '#243027',
    fontSize: 14,
    fontWeight: '700',
  },
  toolDetail: {
    color: '#758078',
    fontSize: 11,
    marginTop: 2,
  },
  toolBadge: {
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: '#D64545',
  },
  toolBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  simulationButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: 14,
    backgroundColor: '#E8F3E9',
  },
  simulationButtonText: {
    color: '#176B37',
    fontSize: 14,
    fontWeight: '700',
  },
});

