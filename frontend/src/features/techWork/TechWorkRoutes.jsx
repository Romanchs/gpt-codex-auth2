import { Navigate, Route, Routes } from 'react-router-dom';
import TechWork from '.';
import { InterruptedProcesses } from './InterruptedProcesses';
import TeckWorkHome from './TeckWorkHome';
import ECustomerProcess from './ECustomerProcess';
import ConsistencyMonitoring from './ConsistencyMonitoring';
import QualityMonitoringDetails from './ConsistencyMonitoring/ConsistencyMonitoringDetails';

const TechWorkRoutes = () => {
  return (
    <Routes>
      <Route index element={<TeckWorkHome />} />
      <Route path={'administration'} exact element={<TechWork />} />
      <Route path={'administration/files'} exact element={<InterruptedProcesses />} />
      <Route path={'e-customer'} exact element={<ECustomerProcess />} />
      <Route path={'consistency-monitoring'} exact element={<ConsistencyMonitoring />} />
      <Route path={'consistency-monitoring/details'} exact element={<QualityMonitoringDetails />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default TechWorkRoutes;
