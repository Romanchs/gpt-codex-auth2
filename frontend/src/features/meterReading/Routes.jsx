import { Navigate, Route, Routes } from 'react-router-dom';
import { MRInforming, MRProcess, MRUploads, MRView } from './index';
import { isDisabledInit } from '../../util/getEnv';

const MeterReadingRoutes = () => {
  return (
    <Routes>
      <Route path={'view'} element={<MRView />} />
      <Route path={'uploads'} element={<MRUploads />} />
      {!isDisabledInit('PROCESSES.METER_READING.PROCESS.INITIALIZATION') && (
        <Route path={'/process/init'} element={<MRProcess />} />
      )}
      <Route path={'/process/:uid'} element={<MRProcess />} />
      <Route path={'/process/informing/:uid'} element={<MRInforming />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default MeterReadingRoutes;
