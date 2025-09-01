// components/ui/IconSymbol.tsx - Updated with new icon mappings
// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi). -- MaterialIcons
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 * - https://hotpot.ai/free-icons -- help with mapping names <SF ICONS NAME> : <MATERIAL ICON NAME>
 */
const MAPPING = {
  plus: 'add',
  'list.bullet': 'list',
  'chart.bar': 'bar-chart',
  gear: 'settings',
  trash: 'delete',
  'doc.text': 'content-paste',
  'chevron.down': 'keyboard-arrow-down',
  'chevron.up': 'keyboard-arrow-up',
  creditcard: 'credit-card',
  calendar: 'calendar-month',
  clock: 'access-time',
  'checkmark.circle': 'check-circle-outline',
  magnifyingglass: 'search',
  'xmark.circle.fill': 'cancel',
  'xmark.circle': 'highlight-off',
  'line.horizontal.3.decrease.circle': 'filter-list',
  pencil: 'edit',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
