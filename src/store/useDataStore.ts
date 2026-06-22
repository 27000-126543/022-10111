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
  compareStore: string | 'all';
  
  setSelectedTimeRange: (range: '7d' | '30d') => void;
  setSelectedProjectCategory: (category: ProjectCategory) => void;
  setCompareCategoryA: (category: ProjectCategory) => void;
  setCompareCategoryB: (category: ProjectCategory) => void;
  setCompareStore: (store: string | 'all') => void;
  updateWarningStatus: (id: string, status: WarningItem['status']) => void;
  getFunnelDataByCategory: () => typeof funnelData;
  getNodeTimeDataByCategory: () => typeof nodeTimeData;
  getFunnelDataForCategory: (category: ProjectCategory, store?: string | 'all') => typeof funnelData;
  getNodeTimeDataForCategory: (category: ProjectCategory, store?: string | 'all') => typeof nodeTimeData;
  completeMissingField: (id: string) => void;
  getStoreCustomers: (storeName: string) => typeof storeCustomers;
  getMissingFieldCustomers: (storeName: string, field: string) => MissingFieldCustomer[];
  markCustomerAsSeen: (customerId: string) => void;
  reassignCustomer: (customerId: string, consultant: string) => void;
  addCustomerNote: (customerId: string, note: string) => void;
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
  compareStore: 'all',
  
  setSelectedTimeRange: (range) => set({ selectedTimeRange: range }),
  setSelectedProjectCategory: (category) => set({ selectedProjectCategory: category }),
  setCompareCategoryA: (category) => set({ compareCategoryA: category }),
  setCompareCategoryB: (category) => set({ compareCategoryB: category }),
  setCompareStore: (store) => set({ compareStore: store }),
  
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

  getFunnelDataForCategory: (category: ProjectCategory, store: string | 'all' = 'all') => {
    const { funnelData, categoryFunnelData, stores } = get();
    let data = category === 'all' ? funnelData : (categoryFunnelData[category] || funnelData);
    
    if (store !== 'all') {
      const storeInfo = stores.find((s) => s.name === store);
      if (storeInfo) {
        const avgConversionRate = stores.reduce((sum, s) => sum + s.conversionRate, 0) / stores.length;
        const factor = storeInfo.conversionRate / avgConversionRate;
        data = data.map((item) => ({
          ...item,
          value: Math.round(item.value * factor),
          conversionRate: Math.min(100, Math.max(0, item.conversionRate * factor)),
        }));
      }
    }
    
    return data;
  },

  getNodeTimeDataForCategory: (category: ProjectCategory, store: string | 'all' = 'all') => {
    const { nodeTimeData, categoryNodeTimeData, stores } = get();
    let data = category === 'all' ? nodeTimeData : (categoryNodeTimeData[category] || nodeTimeData);
    
    if (store !== 'all') {
      const storeInfo = stores.find((s) => s.name === store);
      if (storeInfo) {
        const avgWaitTime = stores.reduce((sum, s) => sum + s.avgWaitTime, 0) / stores.length;
        const factor = storeInfo.avgWaitTime / avgWaitTime;
        data = data.map((item) => ({
          ...item,
          avgTime: item.avgTime * factor,
          maxTime: item.maxTime * factor,
          minTime: item.minTime * factor,
        }));
      }
    }
    
    return data;
  },

  completeMissingField: (id: string) => {
    set((state) => {
      const targetCustomer = state.missingFieldCustomers.find((c) => c.id === id);
      if (!targetCustomer || targetCustomer.completed) return state;

      const updatedCustomers = state.missingFieldCustomers.map((c) =>
        c.id === id ? { ...c, completed: true } : c
      );

      const storeFieldUnfinished = new Map<string, number>();
      updatedCustomers.forEach((c) => {
        if (!c.completed) {
          const key = `${c.storeName}__${c.missingField}`;
          storeFieldUnfinished.set(key, (storeFieldUnfinished.get(key) || 0) + 1);
        }
      });

      const storeTotalMissing = new Map<string, number>();
      state.missingFieldCustomers.forEach((c) => {
        storeTotalMissing.set(c.storeName, (storeTotalMissing.get(c.storeName) || 0) + 1);
      });

      const storeUnfinishedCount = new Map<string, number>();
      updatedCustomers.forEach((c) => {
        if (!c.completed) {
          storeUnfinishedCount.set(c.storeName, (storeUnfinishedCount.get(c.storeName) || 0) + 1);
        }
      });

      const newIssues = state.dataCompletenessIssues.map((issue) => {
        const remainingFields = issue.missingFields.filter((field) => {
          const key = `${issue.storeName}__${field}`;
          return (storeFieldUnfinished.get(key) || 0) > 0;
        });
        const totalUnfinished = remainingFields.reduce((sum, field) => {
          const key = `${issue.storeName}__${field}`;
          return sum + (storeFieldUnfinished.get(key) || 0);
        }, 0);
        return {
          ...issue,
          missingFields: remainingFields,
          missingCount: totalUnfinished,
        };
      }).filter((issue) => issue.missingFields.length > 0);

      const targetStoreName = targetCustomer.storeName;
      const totalMissingForStore = storeTotalMissing.get(targetStoreName) || 1;
      const unfinishedForStore = storeUnfinishedCount.get(targetStoreName) || 0;
      const completedForStore = totalMissingForStore - unfinishedForStore;

      const updatedStores = state.stores.map((store) => {
        if (store.name !== targetStoreName) return store;
        const original = stores.find((s) => s.id === store.id);
        const originalRate = original ? original.dataCompleteness : store.dataCompleteness;
        const improvementPerRecord = (100 - originalRate) / totalMissingForStore;
        const newRate = Math.min(100, originalRate + improvementPerRecord * completedForStore);
        return { ...store, dataCompleteness: Math.round(newRate * 10) / 10 };
      });

      return {
        missingFieldCustomers: updatedCustomers,
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

  markCustomerAsSeen: (customerId: string) => {
    set((state) => {
      const targetCustomer = state.storeCustomers.find((c) => c.id === customerId);
      if (!targetCustomer) return state;

      const updatedStoreCustomers = state.storeCustomers.map((c) =>
        c.id === customerId
          ? { ...c, status: 'normal' as const, waitTime: 0, nextStep: '已接诊' }
          : c
      );

      const updatedWaitingCustomers = state.waitingCustomers.filter(
        (c) => c.id !== customerId
      );

      const storeName = targetCustomer.storeName;
      const storeCustomersAfter = updatedStoreCustomers.filter((c) => c.storeName === storeName);
      const totalWaitTime = storeCustomersAfter.reduce((sum, c) => sum + c.waitTime, 0);
      const avgWaitTime = storeCustomersAfter.length > 0
        ? Math.round(totalWaitTime / storeCustomersAfter.length)
        : 0;

      const updatedStores = state.stores.map((store) =>
        store.name === storeName
          ? { ...store, avgWaitTime }
          : store
      );

      return {
        storeCustomers: updatedStoreCustomers,
        waitingCustomers: updatedWaitingCustomers,
        stores: updatedStores,
      };
    });
  },

  reassignCustomer: (customerId: string, consultant: string) => {
    set((state) => {
      const updatedStoreCustomers = state.storeCustomers.map((c) =>
        c.id === customerId
          ? { ...c, consultant }
          : c
      );

      const updatedWaitingCustomers = state.waitingCustomers.map((c) =>
        c.id === customerId
          ? { ...c, consultant }
          : c
      );

      return {
        storeCustomers: updatedStoreCustomers,
        waitingCustomers: updatedWaitingCustomers,
      };
    });
  },

  addCustomerNote: (customerId: string, note: string) => {
    set((state) => {
      const updatedStoreCustomers = state.storeCustomers.map((c) =>
        c.id === customerId
          ? { ...c, note }
          : c
      );

      return {
        storeCustomers: updatedStoreCustomers,
      };
    });
  },
}));
