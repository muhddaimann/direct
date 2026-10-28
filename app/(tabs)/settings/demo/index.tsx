import { AppScreen } from '../../../../src/components/shared/appScreen';
import { EmptyState } from '../../../../src/components/shared/emptyState';

export default function SettingsDemoScreen() {
  return (
    <AppScreen title="Settings demo" subtitle="A full-screen nested route." showBack>
      <EmptyState title="Nothing to change yet" message="This temporary demo route is ready for a future settings module." icon="tune-variant" />
    </AppScreen>
  );
}
