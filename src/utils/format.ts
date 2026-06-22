export const formatNumber = (num: number, decimals = 0): string => {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatPercent = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
};

export const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString('zh-CN')}`;
};

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD HH:mm'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
};

export const getTimeAgo = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}小时前`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}天前`;
};

export const getWarningLevelColor = (level: 'high' | 'medium' | 'low'): string => {
  const colors = {
    high: '#F53F3F',
    medium: '#FF7D00',
    low: '#F7BA1E',
  };
  return colors[level];
};

export const getWarningLevelText = (level: 'high' | 'medium' | 'low'): string => {
  const texts = {
    high: '高风险',
    medium: '中风险',
    low: '低风险',
  };
  return texts[level];
};

export const getWarningTypeText = (type: string): string => {
  const types: Record<string, string> = {
    timeout: '超时未接诊',
    missed: '顾客爽约',
    late: '顾客迟到',
    reassignment: '分诊改派',
  };
  return types[type] || type;
};

export const getStatusColor = (status: 'pending' | 'processing' | 'resolved'): string => {
  const colors = {
    pending: '#F53F3F',
    processing: '#FF7D00',
    resolved: '#00B42A',
  };
  return colors[status];
};

export const getStatusText = (status: 'pending' | 'processing' | 'resolved'): string => {
  const texts = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
  };
  return texts[status];
};

export const getRankBadgeColor = (rank: number): string => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
  if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
  if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800';
  return 'bg-slate-600';
};
