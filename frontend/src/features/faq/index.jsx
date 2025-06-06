import { Route, Routes } from 'react-router-dom';
import { useIsFaqAdmin } from './utils';
import Layout from './Layout';
import Edit from './edit';

const FAQ = () => {
  const isAdmin = useIsFaqAdmin();

  return (
    <Routes>
      <Route path=":chapter?/:page?/:uid?/*">
        <Route index element={<Layout />} />
        {isAdmin && <Route path="edit" element={<Edit />} />}
      </Route>
    </Routes>
  );
};

export default FAQ;
