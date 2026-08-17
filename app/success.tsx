import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow, spacing, typography } from '../constants/theme';

export default function SuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orderNumber, totalPaid, itemCount } = useLocalSearchParams<{
    orderNumber: string;
    totalPaid: string;
    itemCount: string;
  }>();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark-circle" size={64} color={colors.success} />
      </View>
      <Text style={styles.title}>Payment Completed Successfully!</Text>
      <Text style={styles.message}>
        Your order has been processed and is being prepared for shipping.
      </Text>

      <View style={[styles.card, shadow.card]}>
        <DetailRow label="Order Number" value={`#${orderNumber}`} />
        <DetailRow label="Items" value={itemCount ?? '0'} />
        <DetailRow label="Total Paid" value={`$${totalPaid}`} />
        <DetailRow label="Estimated Delivery" value={getDeliveryRange()} />
      </View>

      <Pressable style={styles.button} onPress={() => router.dismissTo('/products')}>
        <Text style={styles.buttonText}>Back to Shop</Text>
      </Pressable>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function getDeliveryRange() {
  const start = new Date();
  start.setDate(start.getDate() + 3);
  const end = new Date();
  end.setDate(end.getDate() + 6);
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.title, color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { ...typography.body, color: colors.textSecondary },
  detailValue: { ...typography.subtitle, color: colors.text },
  button: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonText: { ...typography.subtitle, color: colors.accentText },
});