import { Route, Routes } from 'react-router-dom';
import SignFile from './SignFile';

const Tools = () => {
  return (
    <Routes>
      <Route path={'sign-file'} element={<SignFile />} />
    </Routes>
  );
};

export default Tools;
