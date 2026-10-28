import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View, useWindowDimensions } from 'react-native';
import { AppScreen, AppScreenHeader } from '../../../../src/components/shared/appScreen';
import { EmptyState } from '../../../../src/components/shared/emptyState';
import { LongList } from '../../../../src/components/shared/longList';
import { useTheme } from '../../../../src/hooks/useTheme';

const demoItems = [
  { id: 'chat', title: 'Live chat', detail: 'A placeholder for in-app messaging.' },
  { id: 'imr', title: 'Interactive support', detail: 'A placeholder for guided troubleshooting.' },
  { id: 'help', title: 'Help topics', detail: 'A placeholder for support articles.' },
  { id: 'contact', title: 'Contact support', detail: 'A placeholder for contact options.' },
];

export default function HomeDemoScreen() {
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();

  return (
    <AppScreen scrollable={false}>
      <LongList
        data={demoItems}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<AppScreenHeader title="Support options" subtitle="Local placeholder only · no requests are sent." showBack />}
        renderItem={({ item }) => (
          <View style={{ minHeight: theme.size.touchTarget + theme.spacing.lg, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderRadius: theme.radius.lg, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, padding: theme.spacing.lg, backgroundColor: theme.colors.surface }}>
            <MaterialCommunityIcons name="lifebuoy" size={theme.size.supportActionIcon} color={theme.colors.primary} />
            <View style={{ flex: theme.layout.fill }}>
              <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>{item.title}</Text>
              <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>{item.detail}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState title="No support options" message="There are no local demo items to show." />}
      />
    </AppScreen>
  );
}
