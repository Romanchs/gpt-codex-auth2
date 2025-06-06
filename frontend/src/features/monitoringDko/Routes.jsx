import { Navigate, Route, Routes } from 'react-router-dom';
import Details from './Details';
import View from './View';
import DetailsZV from './checkDkoZV/DetailsZV';

const MonitoringDkoRoutes = () => {
  return (
    <Routes>
      <Route index element={<View />} />
      <Route path={'details/:uid'} element={<Details />} />
      <Route path={'zv/details/:uid'} element={<DetailsZV />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default MonitoringDkoRoutes;
