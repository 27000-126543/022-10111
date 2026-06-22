import type { Store, StoreCustomer, MissingFieldCustomer } from '../types';

export const stores: Store[] = [
  {
    id: '1',
    name: '北京朝阳店',
    todayNewCustomers: 28,
    avgWaitTime: 22,
    dataCompleteness: 96.5,
    conversionRate: 38.2,
    doctorBacklog: 8,
    reassignmentCount: 2,
    riskCompletionRate: 95.8,
  },
  {
    id: '2',
    name: '上海浦东店',
    todayNewCustomers: 32,
    avgWaitTime: 18,
    dataCompleteness: 98.2,
    conversionRate: 41.5,
    doctorBacklog: 6,
    reassignmentCount: 1,
    riskCompletionRate: 97.2,
  },
  {
    id: '3',
    name: '广州天河店',
    todayNewCustomers: 25,
    avgWaitTime: 25,
    dataCompleteness: 88.6,
    conversionRate: 32.8,
    doctorBacklog: 12,
    reassignmentCount: 3,
    riskCompletionRate: 90.5,
  },
  {
    id: '4',
    name: '深圳南山店',
    todayNewCustomers: 22,
    avgWaitTime: 15,
    dataCompleteness: 94.8,
    conversionRate: 36.4,
    doctorBacklog: 5,
    reassignmentCount: 0,
    riskCompletionRate: 96.1,
  },
  {
    id: '5',
    name: '杭州西湖店',
    todayNewCustomers: 18,
    avgWaitTime: 12,
    dataCompleteness: 92.3,
    conversionRate: 39.6,
    doctorBacklog: 3,
    reassignmentCount: 1,
    riskCompletionRate: 93.8,
  },
  {
    id: '6',
    name: '成都锦江店',
    todayNewCustomers: 15,
    avgWaitTime: 28,
    dataCompleteness: 85.4,
    conversionRate: 28.3,
    doctorBacklog: 15,
    reassignmentCount: 4,
    riskCompletionRate: 88.2,
  },
  {
    id: '7',
    name: '武汉江汉店',
    todayNewCustomers: 12,
    avgWaitTime: 16,
    dataCompleteness: 91.7,
    conversionRate: 34.5,
    doctorBacklog: 4,
    reassignmentCount: 0,
    riskCompletionRate: 92.6,
  },
  {
    id: '8',
    name: '南京鼓楼店',
    todayNewCustomers: 16,
    avgWaitTime: 20,
    dataCompleteness: 90.2,
    conversionRate: 31.9,
    doctorBacklog: 7,
    reassignmentCount: 2,
    riskCompletionRate: 91.4,
  },
];

export const dataCompletenessIssues = [
  { storeName: '成都锦江店', missingFields: ['联系方式', '既往病史', '过敏史'], missingCount: 5, responsiblePerson: '周小琳', responsibleRole: '前台' },
  { storeName: '广州天河店', missingFields: ['术前照片', '咨询记录'], missingCount: 3, responsiblePerson: '吴雨晴', responsibleRole: '前台' },
  { storeName: '南京鼓楼店', missingFields: ['风险问卷', '知情同意书'], missingCount: 2, responsiblePerson: '郑思怡', responsibleRole: '前台' },
];

export const storeCustomers: StoreCustomer[] = [
  { id: 'sc1', name: '张女士', projectType: '鼻整形初诊', signInTime: '09:15', waitTime: 42, status: 'danger', consultant: '李咨询师', nextStep: '等待医生面诊', storeName: '北京朝阳店' },
  { id: 'sc2', name: '何女士', projectType: '注射微整初诊', signInTime: '09:30', waitTime: 28, status: 'warning', consultant: '王咨询师', nextStep: '咨询师沟通中', storeName: '北京朝阳店' },
  { id: 'sc3', name: '宋女士', projectType: '皮肤光电初诊', signInTime: '10:05', waitTime: 10, status: 'normal', consultant: '李咨询师', nextStep: '已完成面诊', storeName: '北京朝阳店' },
  { id: 'sc4', name: '王女士', projectType: '皮肤光电初诊', signInTime: '09:25', waitTime: 35, status: 'danger', consultant: '王咨询师', nextStep: '等待医生面诊', storeName: '上海浦东店' },
  { id: 'sc5', name: '马女士', projectType: '眼整形初诊', signInTime: '09:50', waitTime: 15, status: 'normal', consultant: '张咨询师', nextStep: '已完成面诊', storeName: '上海浦东店' },
  { id: 'sc6', name: '刘女士', projectType: '眼整形初诊', signInTime: '09:32', waitTime: 28, status: 'warning', consultant: '张咨询师', nextStep: '等待咨询师', storeName: '广州天河店' },
  { id: 'sc7', name: '杨女士', projectType: '鼻整形初诊', signInTime: '09:45', waitTime: 32, status: 'danger', consultant: '刘咨询师', nextStep: '等待医生面诊', storeName: '广州天河店' },
  { id: 'sc8', name: '韩女士', projectType: '注射微整初诊', signInTime: '10:10', waitTime: 8, status: 'normal', consultant: '张咨询师', nextStep: '咨询记录填写中', storeName: '广州天河店' },
  { id: 'sc9', name: '陈女士', projectType: '注射微整初诊', signInTime: '09:38', waitTime: 25, status: 'warning', consultant: '刘咨询师', nextStep: '等待咨询师', storeName: '深圳南山店' },
  { id: 'sc10', name: '赵女士', projectType: '胸整形初诊', signInTime: '09:42', waitTime: 18, status: 'normal', consultant: '陈咨询师', nextStep: '已完成面诊', storeName: '杭州西湖店' },
  { id: 'sc11', name: '孙女士', projectType: '形体雕塑初诊', signInTime: '09:50', waitTime: 12, status: 'normal', consultant: '赵咨询师', nextStep: '分诊登记中', storeName: '成都锦江店' },
  { id: 'sc12', name: '周女士', projectType: '鼻整形初诊', signInTime: '09:20', waitTime: 45, status: 'danger', consultant: '赵咨询师', nextStep: '超时未接诊', storeName: '成都锦江店' },
  { id: 'sc13', name: '吴女士', projectType: '皮肤光电初诊', signInTime: '10:00', waitTime: 22, status: 'warning', consultant: '赵咨询师', nextStep: '等待咨询师', storeName: '成都锦江店' },
  { id: 'sc14', name: '郑女士', projectType: '眼整形初诊', signInTime: '10:15', waitTime: 5, status: 'normal', consultant: '陈咨询师', nextStep: '已完成面诊', storeName: '武汉江汉店' },
  { id: 'sc15', name: '钱女士', projectType: '胸整形初诊', signInTime: '09:55', waitTime: 20, status: 'warning', consultant: '陈咨询师', nextStep: '等待咨询师', storeName: '南京鼓楼店' },
  { id: 'sc16', name: '冯女士', projectType: '形体雕塑初诊', signInTime: '10:20', waitTime: 10, status: 'normal', consultant: '赵咨询师', nextStep: '风险问卷填写中', storeName: '南京鼓楼店' },
];

export const missingFieldCustomers: MissingFieldCustomer[] = [
  { id: 'mf1', customerName: '周女士', storeName: '成都锦江店', missingField: '联系方式', responsiblePerson: '周小琳', completed: false },
  { id: 'mf2', customerName: '吴女士', storeName: '成都锦江店', missingField: '联系方式', responsiblePerson: '周小琳', completed: false },
  { id: 'mf3', customerName: '孙女士', storeName: '成都锦江店', missingField: '既往病史', responsiblePerson: '周小琳', completed: false },
  { id: 'mf4', customerName: '郑女士', storeName: '成都锦江店', missingField: '既往病史', responsiblePerson: '周小琳', completed: false },
  { id: 'mf5', customerName: '冯女士', storeName: '成都锦江店', missingField: '过敏史', responsiblePerson: '周小琳', completed: false },
  { id: 'mf6', customerName: '陈女士', storeName: '广州天河店', missingField: '术前照片', responsiblePerson: '吴雨晴', completed: false },
  { id: 'mf7', customerName: '杨女士', storeName: '广州天河店', missingField: '术前照片', responsiblePerson: '吴雨晴', completed: false },
  { id: 'mf8', customerName: '韩女士', storeName: '广州天河店', missingField: '咨询记录', responsiblePerson: '吴雨晴', completed: false },
  { id: 'mf9', customerName: '钱女士', storeName: '南京鼓楼店', missingField: '风险问卷', responsiblePerson: '郑思怡', completed: false },
  { id: 'mf10', customerName: '何女士', storeName: '南京鼓楼店', missingField: '知情同意书', responsiblePerson: '郑思怡', completed: false },
];

export interface ReceptionistTrendItem {
  name: string;
  storeName: string;
  daily: { date: string; newMissing: number; completed: number; remaining: number }[];
}

export const receptionistTrends: ReceptionistTrendItem[] = [
  {
    name: '周小琳',
    storeName: '成都锦江店',
    daily: [
      { date: '06-16', newMissing: 2, completed: 1, remaining: 1 },
      { date: '06-17', newMissing: 1, completed: 0, remaining: 2 },
      { date: '06-18', newMissing: 3, completed: 2, remaining: 3 },
      { date: '06-19', newMissing: 0, completed: 1, remaining: 2 },
      { date: '06-20', newMissing: 2, completed: 1, remaining: 3 },
      { date: '06-21', newMissing: 1, completed: 0, remaining: 4 },
      { date: '06-22', newMissing: 2, completed: 0, remaining: 5 },
    ],
  },
  {
    name: '吴雨晴',
    storeName: '广州天河店',
    daily: [
      { date: '06-16', newMissing: 1, completed: 1, remaining: 0 },
      { date: '06-17', newMissing: 2, completed: 1, remaining: 1 },
      { date: '06-18', newMissing: 0, completed: 0, remaining: 1 },
      { date: '06-19', newMissing: 1, completed: 1, remaining: 1 },
      { date: '06-20', newMissing: 1, completed: 0, remaining: 2 },
      { date: '06-21', newMissing: 0, completed: 1, remaining: 1 },
      { date: '06-22', newMissing: 2, completed: 0, remaining: 3 },
    ],
  },
  {
    name: '郑思怡',
    storeName: '南京鼓楼店',
    daily: [
      { date: '06-16', newMissing: 1, completed: 0, remaining: 1 },
      { date: '06-17', newMissing: 0, completed: 1, remaining: 0 },
      { date: '06-18', newMissing: 2, completed: 1, remaining: 1 },
      { date: '06-19', newMissing: 0, completed: 0, remaining: 1 },
      { date: '06-20', newMissing: 1, completed: 0, remaining: 2 },
      { date: '06-21', newMissing: 0, completed: 1, remaining: 1 },
      { date: '06-22', newMissing: 1, completed: 0, remaining: 2 },
    ],
  },
];
