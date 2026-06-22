import { create } from 'zustand';
import {
  kpiData,
  waitingCustomers,
  channelSources,
  trendData7Days,
  trendData30Days,
  headerStats,
} from '../mock/overview';
import { stores, dataCompletenessIssues, storeCustomers, missingFieldCustomers } from '../mock/stores';
import { doctors, consultants, heatmapData } from '../mock/doctors';
import { projectIntents, radarIndicators, funnelData, categoryFunnelData } from '../mock/projects';
import { warnings, warningStats, reassignmentAbnormal, highRiskCustomers } from '../mock/warnings';
import {
  nodeTimeData,
  categoryNodeTimeData,
  scriptData,
  scheduleSuggestions,
  storeRankingData,
} from '../mock/reports';
import type { WarningItem, ProjectCategory, MissingFieldCustomer } from '../types';

interface DataState {
  headerStats: typeof headerStats;
  kpiData: typeof kpiData;
  waitingCustomers: typeof waitingCustomers;
  channelSources: typeof channelSources;
  trendData7Days: typeof trendData7Days;
  trendData30Days: typeof trendData30Days;
  stores: typeof stores;
  dataCompletenessIssues: typeof dataCompletenessIssues;
  storeCustomers: typeof storeCustomers;
  missingFieldCustomers: MissingFieldCustomer[];
  doctors: typeof doctors;
  consultants: typeof consultants;
  heatmapData: typeof heatmapData;
  projectIntents: typeof projectIntents;
  radarIndicators: typeof radarIndicators;
  funnelData: typeof funnelData;
  categoryFunnelData: typeof categoryFunnelData;
  warnings: WarningItem[];
  warningStats: typeof warningStats;
  reassignmentAbnormal: typeof reassignmentAbnormal;
  highRiskCustomers: typeof highRiskCustomers;
  nodeTimeData: typeof nodeTimeData;
  categoryNodeTimeData: typeof categoryNodeTimeData;
  scriptData: typeof scriptData;
  scheduleSuggestions: typeof scheduleSuggestions;
  storeRankingData: typeof storeRankingData;
  
  selectedTimeRange: '7d' | '30d';
  selectedProjectCategory: ProjectCategory;
  compareCategoryA: ProjectCategory;
  compareCategoryB: ProjectCategory;
  
  setSelectedTimeRange: (range: '7d' | '30d') => void;
  setSelectedProjectCategory: (category: ProjectCategory) => void;
  setCompareCategoryA: (category: ProjectCategory) => void;
  setCompareCategoryB: (category: ProjectCategory) => void;
  updateWarningStatus: (id: string, status: WarningItem['status']) => void;
  getFunnelDataByCategory: () => typeof funnelData;
  getNodeTimeDataByCategory: () => typeof nodeTimeData;
  getFunnelDataForCategory: (category: ProjectCategory) => typeof funnelData;
  getNodeTimeDataForCategory: (category: ProjectCategory) => typeof nodeTimeData;
  completeMissingField: (id: string) => void;
  getStoreCustomers: (storeName: string) => typeof storeCustomers;
  getMissingFieldCustomers: (storeName: string, field: string) => MissingFieldCustomer[];
}

export const useDataStore = create<DataState>((set, get) => ({
  headerStats,
  kpiData,
  waitingCustomers,
  channelSources,
  trendData7Days,
  trendData30Days,
  stores,
  dataCompletenessIssues,
  storeCustomers,
  missingFieldCustomers,
  doctors,
  consultants,
  heatmapData,
  projectIntents,
  radarIndicators,
  funnelData,
  categoryFunnelData,
  warnings,
  warningStats,
  reassignmentAbnormal,
  highRiskCustomers,
  nodeTimeData,
  categoryNodeTimeData,
  scriptData,
  scheduleSuggestions,
  storeRankingData,
  
  selectedTimeRange: '7d',
  selectedProjectCategory: 'all',
  compareCategoryA: 'breast',
  compareCategoryB: 'body-shaping',
  
  setSelectedTimeRange: (range) => set({ selectedTimeRange: range }),
  setSelectedProjectCategory: (category) => set({ selectedProjectCategory: category }),
  setCompareCategoryA: (category) => set({ compareCategoryA: category }),
  setCompareCategoryB: (category) => set({ compareCategoryB: category }),
  
  updateWarningStatus: (id, status) =>
    set((state) => ({
      warnings: state.warnings.map((w) =>
        w.id === id ? { ...w, status } : w
      ),
      warningStats: {
        ...state.warningStats,
        pending: state.warnings.filter((w) => w.id === id ? status === 'pending' : w.status === 'pending').length,
        processing: state.warnings.filter((w) => w.id === id ? status === 'processing' : w.status === 'processing').length,
        resolved: state.warnings.filter((w) => w.id === id ? status === 'resolved' : w.status === 'resolved').length,
      },
    })),
  
  getFunnelDataByCategory: () => {
    const { selectedProjectCategory, funnelData, categoryFunnelData } = get();
    if (selectedProjectCategory === 'all') return funnelData;
    return categoryFunnelData[selectedProjectCategory] || funnelData;
  },
  
  getNodeTimeDataByCategory: () => {
    const { selectedProjectCategory, nodeTimeData, categoryNodeTimeData } = get();
    if (selectedProjectCategory === 'all') return nodeTimeData;
    return categoryNodeTimeData[selectedProjectCategory] || nodeTimeData;
  },

  getFunnelDataForCategory: (category: ProjectCategory) => {
    const { funnelData, categoryFunnelData } = get();
    if (category === 'all') return funnelData;
    return categoryFunnelData[category] || funnelData;
  },

  getNodeTimeDataForCategory: (category: ProjectCategory) => {
    const { nodeTimeData, categoryNodeTimeData } = get();
    if (category === 'all') return nodeTimeData;
    return categoryNodeTimeData[category] || nodeTimeData;
  },

  completeMissingField: (id: string) => {
    set((state) => {
      const updated = state.missingFieldCustomers.map((c) =>
        c.id === id ? { ...c, completed: true } : c
      );
      const storeFieldCount = new Map<string, number>();
      updated.forEach((c) => {
        if (!c.completed) {
          const key = `${c.storeName}__${c.missingField}`;
          storeFieldCount.set(key, (storeFieldCount.get(key) || 0) + 1);
        }
      });
      const newIssues = state.dataCompletenessIssues.map((issue) => {
        const remainingFields = issue.missingFields.filter((field) => {
          const key = `${issue.storeName}__${field}`;
          return (storeFieldCount.get(key) || 0) > 0;
        });
        const completedCount = issue.missingFields.length - remainingFields.length;
        return {
          ...issue,
          missingFields: remainingFields,
          missingCount: Math.max(0, issue.missingCount - completedCount),
        };
      }).filter((issue) => issue.missingFields.length > 0);

      const updatedStores = state.stores.map((store) => {
        const storeIssues = newIssues.filter((i) => i.storeName === store.name);
        if (storeIssues.length === 0) {
          const original = stores.find((s) => s.id === store.id);
          return { ...store, dataCompleteness: Math.min(100, original ? original.dataCompleteness + 5 : store.dataCompleteness) };
        }
        return store;
      });

      return {
        missingFieldCustomers: updated,
        dataCompletenessIssues: newIssues,
        stores: updatedStores,
      };
    });
  },

  getStoreCustomers: (storeName: string) => {
    return get().storeCustomers.filter((c) => c.storeName === storeName);
  },

  getMissingFieldCustomers: (storeName: string, field: string) => {
    return get().missingFieldCustomers.filter(
      (c) => c.storeName === storeName && c.missingField === field && !c.completed
    );
  },
}));
