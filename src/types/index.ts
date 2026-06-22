export interface Store {
  id: string;
  name: string;
  todayNewCustomers: number;
  avgWaitTime: number;
  dataCompleteness: number;
  conversionRate: number;
  doctorBacklog: number;
  reassignmentCount: number;
  riskCompletionRate: number;
}

export interface KpiData {
  title: string;
  value: number;
  unit: string;
  trend: number;
  trendType: 'up' | 'down';
  miniChartData: number[];
  color?: string;
}

export interface WaitingCustomer {
  id: string;
  name: string;
  storeName: string;
  waitTime: number;
  projectType: string;
  status: 'normal' | 'warning' | 'danger';
  signInTime: string;
  consultant?: string;
}

export interface Doctor {
  id: string;
  name: string;
  storeName: string;
  specialty: string;
  todayPatients: number;
  waitingPatients: number;
  avgConsultationTime: number;
  satisfaction: number;
  returnVisitRate: number;
}

export interface Consultant {
  id: string;
  name: string;
  storeName: string;
  todayReceptions: number;
  avgCommunicationTime: number;
  referralSuccessRate: number;
  conversionCount: number;
}

export interface ProjectIntent {
  name: string;
  category: string;
  intentCount: number;
  conversionRate: number;
  avgPrice: number;
}

export interface WarningItem {
  id: string;
  type: 'timeout' | 'missed' | 'late' | 'reassignment';
  level: 'high' | 'medium' | 'low';
  customerName: string;
  storeName: string;
  content: string;
  triggerTime: string;
  status: 'pending' | 'processing' | 'resolved';
  handler?: string;
}

export interface NodeTimeData {
  node: string;
  avgTime: number;
  projectType: string;
  comparison: number;
  maxTime: number;
  minTime: number;
}

export interface ChannelSource {
  name: string;
  value: number;
  conversionRate: number;
}

export interface TrendData {
  date: string;
  newCustomers: number;
  conversionRate: number;
}

export interface HeatmapData {
  hour: string;
  day: string;
  value: number;
}

export interface FunnelData {
  stage: string;
  value: number;
  conversionRate: number;
}

export interface ScriptData {
  name: string;
  usageCount: number;
  conversionRate: number;
  avgTalkTime: number;
}

export interface ScheduleSuggestion {
  timeSlot: string;
  dayOfWeek: string;
  suggestedDoctors: number;
  suggestedConsultants: number;
  avgWaitTime: number;
}

export type ProjectCategory = 
  | 'all' 
  | 'rhinoplasty' 
  | 'blepharoplasty' 
  | 'skin-photoelectric' 
  | 'injection' 
  | 'breast' 
  | 'body-shaping';

export const ProjectCategoryLabels: Record<ProjectCategory, string> = {
  'all': '全部项目',
  'rhinoplasty': '鼻整形初诊',
  'blepharoplasty': '眼整形初诊',
  'skin-photoelectric': '皮肤光电初诊',
  'injection': '注射微整初诊',
  'breast': '胸整形初诊',
  'body-shaping': '形体雕塑初诊',
};
