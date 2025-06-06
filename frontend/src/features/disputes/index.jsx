import { Route, Routes } from 'react-router-dom';
import { CreateDisputeTko } from './TKO/CreateDisputeTko';
import { DisputesEntityTko } from './TKO/DisputesEntityTko';
import { CreateDisputeDko } from './DKO/CreateDisputeDko';
import { DisputesEntityDko } from './DKO/DisputesEntityDko';
import { Disputes } from './Disputes';

export const DisputesRoutes = () => {
  return (
    <Routes>
      <Route index element={<Disputes />} />

      <Route path={'tko'}>
        <Route path={':uid'}>
          <Route index element={<DisputesEntityTko />} />
          <Route path={'create'} element={<CreateDisputeTko />} />
          <Route path={':section'} element={<DisputesEntityTko />} />
        </Route>
      </Route>

      <Route path={'dko'}>
        <Route path={':uid'}>
          <Route index element={<DisputesEntityDko />} />
          <Route path={'create'} element={<CreateDisputeDko />} />
          <Route path={':section'} element={<DisputesEntityDko />} />
        </Route>
      </Route>
    </Routes>
  );
};
