import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type PickerOption = {
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  tone?: 'default' | 'danger';
};

export function OptionPicker({
  options,
  mode,
  selectedId,
  onSelect,
}: {
  options: PickerOption[];
  mode: 'action' | 'preference';
  selectedId?: string;
  onSelect: (option: PickerOption) => void;
}) {
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      {options.map((option) => {
        const selected = option.id === selectedId;
        return (
          <Pressable
            key={option.id}
            accessibilityRole={mode === 'preference' ? 'radio' : 'button'}
            accessibilityState={mode === 'preference' ? { checked: selected } : undefined}
            accessibilityLabel={option.description ? `${option.label}, ${option.description}` : option.label}
            onPress={() => onSelect(option)}
            style={({ pressed }) => ({
              minHeight: theme.size.touchTarget,
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.md,
              borderRadius: theme.radius.md,
              borderWidth: theme.layout.standardBorderWidth,
              borderColor: selected ? theme.colors.primary : theme.colors.border,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.sm,
              backgroundColor: selected ? theme.colors.surfaceSubtle : theme.colors.surface,
              opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
            })}
          >
            <View style={{ flex: theme.layout.fill }}>
              <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize, lineHeight: theme.typography.body.lineHeight * fontScale }}>
                {option.label}
              </Text>
              {option.description ? (
                <Text style={{ color: theme.colors.textMuted, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>
                  {option.description}
                </Text>
              ) : null}
            </View>
            {mode === 'preference' ? (
              <MaterialCommunityIcons name={selected ? 'radiobox-marked' : 'radiobox-blank'} size={theme.size.supportActionIcon} color={selected ? theme.colors.primary : theme.colors.textMuted} />
            ) : option.icon ? (
              <MaterialCommunityIcons name={option.icon} size={theme.size.supportActionIcon} color={option.tone === 'danger' ? theme.colors.danger : theme.colors.primary} />
            ) : (
              <MaterialCommunityIcons name="chevron-right" size={theme.size.supportActionIcon} color={theme.colors.primary} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
