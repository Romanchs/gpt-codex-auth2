import { Navigate, Route, Routes } from 'react-router-dom';
import { AuditCreate, AuditsRegister, AuditView } from './index';

const AuditsRoutes = () => {
  return (
    <Routes>
      <Route index element={<AuditsRegister />} />
      <Route path={':uid'} element={<AuditView />} />
      <Route path={'create'} element={<AuditCreate />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AuditsRoutes;
