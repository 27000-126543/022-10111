import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import Layout from '@/components/Layout';
import Overview from '@/pages/Overview';
import StoreCompare from '@/pages/StoreCompare';
import Doctor承接 from '@/pages/Doctor承接';
import ProjectHot from '@/pages/ProjectHot';
import Warning from '@/pages/Warning';
import Report from '@/pages/Report';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.darkAlgorithm,
        token: {
          colorPrimary: '#165DFF',
          colorInfo: '#165DFF',
          colorSuccess: '#00B42A',
          colorWarning: '#FF7D00',
          colorError: '#F53F3F',
          borderRadius: 8,
          fontFamily: "'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          colorBgContainer: 'rgba(30, 41, 59, 0.8)',
          colorBgElevated: 'rgba(15, 23, 42, 0.95)',
          colorBorder: 'rgba(71, 85, 105, 0.5)',
          colorText: '#CBD5E1',
          colorTextSecondary: '#94A3B8',
          colorTextTertiary: '#64748B',
        },
        components: {
          Select: {
            colorBgContainer: 'rgba(30, 41, 59, 0.8)',
            colorBorder: 'rgba(71, 85, 105, 0.5)',
            colorText: '#CBD5E1',
            borderRadius: 8,
          },
          Table: {
            colorBgContainer: 'transparent',
            colorBorderSecondary: 'rgba(71, 85, 105, 0.2)',
            headerBg: 'rgba(15, 23, 42, 0.5)',
            headerColor: '#94A3B8',
            rowHoverBg: 'rgba(22, 93, 255, 0.05)',
          },
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="store-compare" element={<StoreCompare />} />
            <Route path="doctor" element={<Doctor承接 />} />
            <Route path="project" element={<ProjectHot />} />
            <Route path="warning" element={<Warning />} />
            <Route path="report" element={<Report />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}
