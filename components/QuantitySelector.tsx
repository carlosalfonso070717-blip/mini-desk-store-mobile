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
        <Text style={styles.addButtonText}>Agregar</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.stepper}>
      <Pressable onPress={onDecrement} style={styles.stepButton} hitSlop={8}>
        <Text style={styles.stepButtonText}>−</Text>
      </Pressable>
      <Text style={styles.quantityText}>{quantity}</Text>
      <Pressable onPress={onIncrement} style={styles.stepButton} hitSlop={8}>
        <Text style={styles.stepButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  stepButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {
    ...typography.subtitle,
    color: colors.primary,
  },
  quantityText: {
    ...typography.subtitle,
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
});