import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

/**
 * AdvancedCard - a reusable, premium styled card component.
 * Props:
 *   title: string - Card title.
 *   value: string | number - Main highlighted value.
 *   icon: any - Optional image source (require or uri).
 *   gradientColors: [string, string] - Optional gradient colors.
 */
export default function AdvancedCard({ title, value, icon, gradientColors }) {
  const backgroundStyle = gradientColors
    ? { background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})` }
    : {};

  return (
    <View style={[styles.card, backgroundStyle]}>
      {icon && <Image source={icon} style={styles.icon} resizeMode="contain" />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    margin: 8,
    width: 180,
    backgroundColor: '#16A34A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '800',
  },
});
