import { create } from 'zustand';
import {
  kpiData,
  waitingCustomers,
  channelSources,
  trendData7Days,
  trendData30Days,
  headerStats,
} from '../mock/overview';
import { stores, dataCompletenessIssues } from '../mock/stores';
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
import type { WarningItem, ProjectCategory } from '../types';

interface DataState {
  headerStats: typeof headerStats;
  kpiData: typeof kpiData;
  waitingCustomers: typeof waitingCustomers;
  channelSources: typeof channelSources;
  trendData7Days: typeof trendData7Days;
  trendData30Days: typeof trendData30Days;
  stores: typeof stores;
  dataCompletenessIssues: typeof dataCompletenessIssues;
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
  
  setSelectedTimeRange: (range: '7d' | '30d') => void;
  setSelectedProjectCategory: (category: ProjectCategory) => void;
  updateWarningStatus: (id: string, status: WarningItem['status']) => void;
  getFunnelDataByCategory: () => typeof funnelData;
  getNodeTimeDataByCategory: () => typeof nodeTimeData;
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
  
  setSelectedTimeRange: (range) => set({ selectedTimeRange: range }),
  setSelectedProjectCategory: (category) => set({ selectedProjectCategory: category }),
  
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
}));
