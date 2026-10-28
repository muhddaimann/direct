import { Platform } from 'react-native';

export function minimumFloatingControlOffset(layout: { floatingBottomOffsetIOS: number; floatingBottomOffsetAndroid: number }) {
  return Platform.OS === 'ios' ? layout.floatingBottomOffsetIOS : layout.floatingBottomOffsetAndroid;
}
