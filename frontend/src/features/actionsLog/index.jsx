import { Navigate, Route, Routes } from 'react-router-dom';
import ActionsLog from './ActionsLog';
import Requests from './Requests';

const ActionsLogRoutes = () => {
  return (
    <Routes>
      <Route index element={<ActionsLog />} />
      <Route path={'requests'} exact element={<Requests />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ActionsLogRoutes;
