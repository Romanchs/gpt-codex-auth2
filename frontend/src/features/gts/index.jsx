import { Navigate, Route, Routes } from 'react-router-dom';
import RegionBalance from './regionBalance';
import InfoUploadedDko from './infoUploadedDko';
import GtsDko from '../../Components/pages/GTS/GtsDko';
import { isDisabledInit } from '../../util/getEnv';

const GtsRoutes = () => {
  return (
    <Routes>
      <Route path={'region-balance/*'} element={<RegionBalance />} />
      {!isDisabledInit('GTS.INFO_UPLOADED_DKO.ACCESS') && (
        <Route path={'info-uploaded-dko/:mp'} exact element={<InfoUploadedDko />} />
      )}
      <Route path={':type/:uid'} exact element={<GtsDko />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default GtsRoutes;
