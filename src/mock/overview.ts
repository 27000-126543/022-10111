import type { KpiData, WaitingCustomer, ChannelSource, TrendData } from '../types';

export const kpiData: KpiData[] = [
  {
    title: '今日初诊量',
    value: 168,
    unit: '人',
    trend: 12.5,
    trendType: 'up',
    miniChartData: [120, 132, 145, 138, 156, 162, 168],
    color: '#165DFF',
  },
  {
    title: '平均等待时长',
    value: 18,
    unit: '分钟',
    trend: 8.3,
    trendType: 'down',
    miniChartData: [25, 28, 22, 20, 19, 21, 18],
    color: '#00B42A',
  },
  {
    title: '分诊改派次数',
    value: 7,
    unit: '次',
    trend: 22.2,
    trendType: 'down',
    miniChartData: [12, 15, 9, 11, 8, 10, 7],
    color: '#FF7D00',
  },
  {
    title: '风险问卷完成率',
    value: 94.2,
    unit: '%',
    trend: 3.8,
    trendType: 'up',
    miniChartData: [85, 88, 90, 89, 92, 93, 94],
    color: '#722ED1',
  },
];

export const waitingCustomers: WaitingCustomer[] = [
  {
    id: '1',
    name: '张女士',
    storeName: '北京朝阳店',
    waitTime: 42,
    projectType: '鼻整形初诊',
    status: 'danger',
    signInTime: '09:15',
    consultant: '李咨询师',
  },
  {
    id: '2',
    name: '王女士',
    storeName: '上海浦东店',
    waitTime: 35,
    projectType: '皮肤光电初诊',
    status: 'danger',
    signInTime: '09:25',
    consultant: '王咨询师',
  },
  {
    id: '3',
    name: '刘女士',
    storeName: '广州天河店',
    waitTime: 28,
    projectType: '眼整形初诊',
    status: 'warning',
    signInTime: '09:32',
    consultant: '张咨询师',
  },
  {
    id: '4',
    name: '陈女士',
    storeName: '深圳南山店',
    waitTime: 25,
    projectType: '注射微整初诊',
    status: 'warning',
    signInTime: '09:38',
    consultant: '刘咨询师',
  },
  {
    id: '5',
    name: '赵女士',
    storeName: '杭州西湖店',
    waitTime: 18,
    projectType: '胸整形初诊',
    status: 'normal',
    signInTime: '09:42',
    consultant: '陈咨询师',
  },
  {
    id: '6',
    name: '孙女士',
    storeName: '成都锦江店',
    waitTime: 12,
    projectType: '形体雕塑初诊',
    status: 'normal',
    signInTime: '09:50',
    consultant: '赵咨询师',
  },
];

export const channelSources: ChannelSource[] = [
  { name: '抖音', value: 42, conversionRate: 28.5 },
  { name: '小红书', value: 35, conversionRate: 32.1 },
  { name: '美团点评', value: 28, conversionRate: 25.3 },
  { name: '老客推荐', value: 22, conversionRate: 45.6 },
  { name: '百度搜索', value: 15, conversionRate: 18.2 },
  { name: '其他', value: 26, conversionRate: 15.8 },
];

export const trendData7Days: TrendData[] = [
  { date: '06/16', newCustomers: 142, conversionRate: 31.2 },
  { date: '06/17', newCustomers: 156, conversionRate: 33.5 },
  { date: '06/18', newCustomers: 138, conversionRate: 29.8 },
  { date: '06/19', newCustomers: 165, conversionRate: 35.2 },
  { date: '06/20', newCustomers: 172, conversionRate: 36.8 },
  { date: '06/21', newCustomers: 158, conversionRate: 34.1 },
  { date: '06/22', newCustomers: 168, conversionRate: 37.5 },
];

export const trendData30Days: TrendData[] = Array.from({ length: 30 }, (_, i) => {
  const day = String(i + 1).padStart(2, '0');
  return {
    date: `06/${day}`,
    newCustomers: Math.floor(120 + Math.random() * 60),
    conversionRate: Math.round((28 + Math.random() * 12) * 10) / 10,
  };
});

export const headerStats = {
  totalStores: 12,
  onlineDoctors: 86,
  onlineConsultants: 124,
  todayConsultations: 168,
  completedConsultations: 92,
  pendingConsultations: 76,
};
