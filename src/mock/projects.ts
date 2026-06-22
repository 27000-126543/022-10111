import type { ProjectIntent, FunnelData } from '../types';

export const projectIntents: ProjectIntent[] = [
  {
    name: '鼻综合整形',
    category: 'rhinoplasty',
    intentCount: 42,
    conversionRate: 38.5,
    avgPrice: 38000,
  },
  {
    name: '眼综合整形',
    category: 'blepharoplasty',
    intentCount: 56,
    conversionRate: 45.2,
    avgPrice: 22000,
  },
  {
    name: '皮秒祛斑',
    category: 'skin-photoelectric',
    intentCount: 68,
    conversionRate: 52.8,
    avgPrice: 3800,
  },
  {
    name: '热玛吉',
    category: 'skin-photoelectric',
    intentCount: 35,
    conversionRate: 41.3,
    avgPrice: 18000,
  },
  {
    name: '玻尿酸填充',
    category: 'injection',
    intentCount: 82,
    conversionRate: 65.4,
    avgPrice: 6800,
  },
  {
    name: '瘦脸针',
    category: 'injection',
    intentCount: 75,
    conversionRate: 72.1,
    avgPrice: 3200,
  },
  {
    name: '假体隆胸',
    category: 'breast',
    intentCount: 18,
    conversionRate: 28.6,
    avgPrice: 68000,
  },
  {
    name: '自体脂肪隆胸',
    category: 'breast',
    intentCount: 22,
    conversionRate: 32.4,
    avgPrice: 58000,
  },
  {
    name: '吸脂塑形',
    category: 'body-shaping',
    intentCount: 28,
    conversionRate: 35.8,
    avgPrice: 28000,
  },
];

export const radarIndicators = [
  { name: '鼻整形', value: 85 },
  { name: '眼整形', value: 92 },
  { name: '皮肤光电', value: 88 },
  { name: '注射微整', value: 95 },
  { name: '胸整形', value: 68 },
  { name: '形体雕塑', value: 72 },
];

export const funnelData: FunnelData[] = [
  { stage: '签到到店', value: 100, conversionRate: 100 },
  { stage: '分诊登记', value: 94, conversionRate: 94 },
  { stage: '风险问卷', value: 88, conversionRate: 93.6 },
  { stage: '咨询师沟通', value: 76, conversionRate: 86.4 },
  { stage: '医生面诊', value: 62, conversionRate: 81.6 },
  { stage: '成交缴费', value: 38, conversionRate: 61.3 },
];

export const categoryFunnelData: Record<string, FunnelData[]> = {
  rhinoplasty: [
    { stage: '签到到店', value: 100, conversionRate: 100 },
    { stage: '分诊登记', value: 96, conversionRate: 96 },
    { stage: '风险问卷', value: 91, conversionRate: 94.8 },
    { stage: '咨询师沟通', value: 82, conversionRate: 90.1 },
    { stage: '医生面诊', value: 70, conversionRate: 85.4 },
    { stage: '成交缴费', value: 42, conversionRate: 60.0 },
  ],
  'skin-photoelectric': [
    { stage: '签到到店', value: 100, conversionRate: 100 },
    { stage: '分诊登记', value: 97, conversionRate: 97 },
    { stage: '风险问卷', value: 93, conversionRate: 95.9 },
    { stage: '咨询师沟通', value: 88, conversionRate: 94.6 },
    { stage: '医生面诊', value: 80, conversionRate: 90.9 },
    { stage: '成交缴费', value: 58, conversionRate: 72.5 },
  ],
  blepharoplasty: [
    { stage: '签到到店', value: 100, conversionRate: 100 },
    { stage: '分诊登记', value: 95, conversionRate: 95 },
    { stage: '风险问卷', value: 90, conversionRate: 94.7 },
    { stage: '咨询师沟通', value: 84, conversionRate: 93.3 },
    { stage: '医生面诊', value: 74, conversionRate: 88.1 },
    { stage: '成交缴费', value: 48, conversionRate: 64.9 },
  ],
  injection: [
    { stage: '签到到店', value: 100, conversionRate: 100 },
    { stage: '分诊登记', value: 98, conversionRate: 98 },
    { stage: '风险问卷', value: 95, conversionRate: 96.9 },
    { stage: '咨询师沟通', value: 92, conversionRate: 96.8 },
    { stage: '医生面诊', value: 88, conversionRate: 95.7 },
    { stage: '成交缴费', value: 72, conversionRate: 81.8 },
  ],
};
