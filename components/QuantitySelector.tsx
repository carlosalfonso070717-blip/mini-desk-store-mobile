import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function QuantitySelector({ quantity, onIncrement, onDecrement }: QuantitySelectorProps) {
  if (quantity === 0) {
    return (
      <Pressable onPress={onIncrement} style={styles.addButton} hitSlop={8}>
        <Ionicons name="add" size={16} color={colors.primaryText} />
        <Text style={styles.addButtonText}>Agregar</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.stepper}>
      <Pressable onPress={onDecrement} style={styles.stepButton} hitSlop={8}>
        <Ionicons name="remove" size={16} color={colors.primary} />
      </Pressable>
      <Text style={styles.quantityText}>{quantity}</Text>
      <Pressable onPress={onIncrement} style={styles.stepButton} hitSlop={8}>
        <Ionicons name="add" size={16} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
  },
  addButtonText: { ...typography.body, color: colors.primaryText, fontWeight: '600' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  stepButton: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  quantityText: { ...typography.subtitle, color: colors.text, minWidth: 22, textAlign: 'center' },
});