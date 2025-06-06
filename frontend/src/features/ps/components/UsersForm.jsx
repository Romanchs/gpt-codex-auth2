import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useProcessSettingsUsersQuery, useProcessSettingsUsersUpdateMutation } from '../api';
import EditingList from './EditingList';
import { BaseSettingsDialog } from './BaseSettingsDialog';

const UsersForm = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const { currentData } = useProcessSettingsUsersQuery();
  const [updateUsers, { isLoading }] = useProcessSettingsUsersUpdateMutation({
    fixedCacheKey: 'process-settings-updating-users'
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (list) => {
    setUsers(list);
  };

  const handleSave = () => {
    updateUsers({ values: users, type: 'users' }).then((res) => {
      if (!res.error) handleClose();
    });
  };

  return (
    <BaseSettingsDialog
      title={t('LOGIN_APPROVING_PERSON')}
      open={open}
      onClose={handleClose}
      handleSave={handleSave}
      isLoading={isLoading}
    >
      {currentData && <EditingList list={currentData?.users} onChange={handleChange} />}
    </BaseSettingsDialog>
  );
};

UsersForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
};

export default UsersForm;
