/**
 * Maps widget IDs to their React components.
 * @module components/organisms/widgets/widgetMap
 */
import type { ComponentType } from 'react';
import type { WidgetId } from '@/types/dashboard';
import StatsWidget from './StatsWidget';

/** Map from widget ID to its render component. */
export const widgetMap: Partial<Record<
  WidgetId, ComponentType
>> = {
  stats: StatsWidget,
};
