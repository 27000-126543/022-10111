import * as XLSX from 'xlsx';
import type { Store, WarningItem, Doctor, Consultant } from '../types';

interface ExportColumn {
  key: string;
  title: string;
  formatter?: (value: any) => string;
}

export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[],
  fileName: string,
  sheetName = 'Sheet1'
): void => {
  const exportData = data.map((row) => {
    const formattedRow: Record<string, any> = {};
    columns.forEach((col) => {
      const value = row[col.key];
      formattedRow[col.title] = col.formatter ? col.formatter(value) : value;
    });
    return formattedRow;
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  ws['!cols'] = columns.map(() => ({ wch: 15 }));
  
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportStoreRanking = (stores: any[], fileName: string): void => {
  const columns: ExportColumn[] = [
    { key: 'rank', title: '排名' },
    { key: 'name', title: '门店名称' },
    { key: 'newCustomers', title: '今日初诊量' },
    { key: 'conversionRate', title: '转化率(%)', formatter: (v) => `${v}%` },
    { key: 'avgWaitTime', title: '平均等待(分钟)' },
    { key: 'dataCompleteness', title: '资料完整率(%)', formatter: (v) => `${v}%` },
    { key: 'score', title: '综合评分', formatter: (v) => v.toFixed(1) },
  ];
  
  exportToExcel(stores, columns, fileName, '门店排名');
};

export const exportWarningList = (warnings: WarningItem[], fileName: string): void => {
  const columns: ExportColumn[] = [
    { key: 'id', title: '预警编号' },
    { 
      key: 'type', 
      title: '预警类型', 
      formatter: (v) => {
        const types: Record<string, string> = {
          timeout: '超时未接诊',
          missed: '顾客爽约',
          late: '顾客迟到',
          reassignment: '分诊改派',
        };
        return types[v] || v;
      }
    },
    { 
      key: 'level', 
      title: '风险等级', 
      formatter: (v) => {
        const levels: Record<string, string> = {
          high: '高风险',
          medium: '中风险',
          low: '低风险',
        };
        return levels[v] || v;
      }
    },
    { key: 'customerName', title: '顾客姓名' },
    { key: 'storeName', title: '所属门店' },
    { key: 'content', title: '预警内容' },
    { key: 'triggerTime', title: '触发时间' },
    { 
      key: 'status', 
      title: '处理状态', 
      formatter: (v) => {
        const statuses: Record<string, string> = {
          pending: '待处理',
          processing: '处理中',
          resolved: '已解决',
        };
        return statuses[v] || v;
      }
    },
    { key: 'handler', title: '处理人' },
  ];
  
  exportToExcel(warnings, columns, fileName, '预警记录');
};

export const exportDoctorReport = (doctors: Doctor[], fileName: string): void => {
  const columns: ExportColumn[] = [
    { key: 'name', title: '医生姓名' },
    { key: 'storeName', title: '所属门店' },
    { key: 'specialty', title: '擅长项目' },
    { key: 'todayPatients', title: '今日接诊数' },
    { key: 'waitingPatients', title: '等待人数' },
    { key: 'avgConsultationTime', title: '平均接诊(分钟)' },
    { key: 'satisfaction', title: '满意度(%)', formatter: (v) => `${v}%` },
    { key: 'returnVisitRate', title: '复诊率(%)', formatter: (v) => `${v}%` },
  ];
  
  exportToExcel(doctors, columns, fileName, '医生报表');
};

export const exportConsultantReport = (consultants: Consultant[], fileName: string): void => {
  const columns: ExportColumn[] = [
    { key: 'name', title: '咨询师姓名' },
    { key: 'storeName', title: '所属门店' },
    { key: 'todayReceptions', title: '今日接待数' },
    { key: 'avgCommunicationTime', title: '平均沟通(分钟)' },
    { key: 'referralSuccessRate', title: '转介成功率(%)', formatter: (v) => `${v}%` },
    { key: 'conversionCount', title: '成交数' },
  ];
  
  exportToExcel(consultants, columns, fileName, '咨询师报表');
};
