import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Check, Shield } from 'lucide-react-native';
import { useAuth, USER_PROFILES } from '../context/AuthContext';

export default function LoginScreen() {
  const { loginAs } = useAuth();
  const [selectedRole, setSelectedRole] = useState('admin');
  const selectedProfile = USER_PROFILES[selectedRole];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.brandRow}>
          <View style={styles.logoMark}><Shield size={22} color="#FFFFFF" strokeWidth={2.4} /></View>
          <View>
            <Text style={styles.brandName}>SafeRide<Text style={styles.brandPlus}>+</Text></Text>
            <Text style={styles.brandCaption}>SCHOOL TRANSPORT</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>WELCOME</Text>
          <Text style={styles.title}>Choose your profile</Text>
          <Text style={styles.subtitle}>Continue to the SafeRide view for your role.</Text>
        </View>

        <View style={styles.profileList}>
          {Object.keys(USER_PROFILES).map((key) => {
            const profile = USER_PROFILES[key];
            const isSelected = selectedRole === key;
            const roleDescriptions = {
              admin: 'Routes, fleet and school-wide alerts',
              driver: 'Today’s trip and passenger manifest',
              parent: 'Your child’s ride and attendance',
              student: 'Your bus pass and route details',
            };

            return (
              <TouchableOpacity
                key={key}
                style={[styles.profileOption, isSelected && styles.profileOptionSelected]}
                onPress={() => setSelectedRole(key)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={[styles.avatar, isSelected && styles.avatarSelected]}>
                  <Text style={styles.avatarText}>{profile.avatar}</Text>
                </View>
                <View style={styles.profileCopy}>
                  <Text style={styles.profileRole}>{profile.roleTitle}</Text>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileDescription}>{roleDescriptions[key]}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={() => loginAs(selectedRole)} activeOpacity={0.8}>
          <Text style={styles.continueText}>Continue as {selectedProfile.name}</Text>
          <Check size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.demoNote}>Demo access · No password required</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F2',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16803D',
  },
  brandName: { color: '#1C2A20', fontSize: 18, fontWeight: '800' },
  brandPlus: { color: '#16803D' },
  brandCaption: { color: '#78837A', fontSize: 9, fontWeight: '700', marginTop: 1 },
  intro: { marginTop: 42, marginBottom: 22 },
  eyebrow: { color: '#16803D', fontSize: 11, fontWeight: '800', marginBottom: 7 },
  title: { color: '#17231A', fontSize: 27, fontWeight: '800' },
  subtitle: { color: '#69766D', fontSize: 14, lineHeight: 20, marginTop: 6 },
  profileList: {
    gap: 9,
  },
  profileOption: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E9E1',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  profileOptionSelected: {
    borderColor: '#76AD7D',
    backgroundColor: '#F0F7F0',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F4F1',
  },
  avatarSelected: { backgroundColor: '#E0EFE1' },
  avatarText: { fontSize: 23 },
  profileCopy: { flex: 1 },
  profileRole: { color: '#223027', fontSize: 13, fontWeight: '700' },
  profileName: { color: '#5F6D63', fontSize: 12, marginTop: 2 },
  profileDescription: { color: '#879188', fontSize: 10, marginTop: 3 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#BCC7BD',
  },
  radioSelected: { borderColor: '#16803D' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16803D' },
  continueButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: 13,
    marginTop: 18,
    backgroundColor: '#16803D',
  },
  continueText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  demoNote: { color: '#849087', textAlign: 'center', fontSize: 11, marginTop: 12 },
});

