import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle('dark');
    }, []),
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/welcome-bg.jpeg')}
        style={[StyleSheet.absoluteFill, styles.image]}
        contentFit="cover"
        contentPosition="center"
      />
      <LinearGradient
        colors={['transparent', 'rgba(15,23,42,0.55)', colors.primaryDark]}
        locations={[0.2, 0.55, 1]}
        style={styles.gradient}
      >
        <View style={[styles.content, { paddingBottom: insets.bottom + spacing.xl * 2 }]}>
          <Text style={styles.title}>Mini Desk Store</Text>
          <Text style={styles.subtitle}>Quality essentials, delivered to your door.</Text>
          <Pressable style={styles.button} onPress={() => router.push('/products')}>
            <Text style={styles.buttonText}>Shop Now</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.accentText} />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryDark },
  image: { transform: [{ scale: 1 }] },
  gradient: { flex: 1, justifyContent: 'flex-end' },
  content: { paddingHorizontal: spacing.xl, gap: spacing.xs },
  title: { ...typography.title, fontSize: 30, color: colors.primaryText },
  subtitle: { ...typography.body, color: 'rgba(255,255,255,0.85)', marginBottom: spacing.lg },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
  },
  buttonText: { ...typography.subtitle, color: colors.accentText },
});