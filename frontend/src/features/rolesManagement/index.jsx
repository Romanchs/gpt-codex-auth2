import { Navigate, Route, Routes } from 'react-router-dom';
import { RolesList } from './RolesList';
import { RoleEdit } from './RoleEdit';
import { RoleCreate } from './RoleCreate';

export const RolesManagement = () => {
  return (
    <Routes>
      <Route index element={<RolesList />} />
      <Route path={'create'} element={<RoleCreate />} />

      <Route path={':uid'} exact element={<RoleEdit />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
