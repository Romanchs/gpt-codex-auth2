import { Navigate, Route, Routes } from 'react-router-dom';
import { UsersDirectory } from './UsersDirectory';

export const UsersDirectoryRoutes = () => {
  return (
    <Routes>
      <Route index element={<UsersDirectory />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
