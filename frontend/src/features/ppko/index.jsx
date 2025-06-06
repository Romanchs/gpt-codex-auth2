import {Navigate, Route, Routes} from 'react-router-dom';
import PpkoMain from '../../Components/pages/PPKO/PpkoMain';
import PpkoDetail from '../../Components/pages/PPKO/details/PpkoDetail';
import PpkoHistory from './history';

const Ppko = () => {
  return (
    <Routes>
      <Route index element={<PpkoMain/>}/>
      <Route path={':id'} exact element={<PpkoDetail />} />
      <Route path={'history'} element={<PpkoHistory/>}/>
      <Route path={'history/:id'} element={<PpkoHistory/>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
};

export default Ppko;
