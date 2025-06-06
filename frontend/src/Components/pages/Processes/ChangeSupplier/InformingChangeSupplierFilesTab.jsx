import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadedFilesTable } from '../Components/UploadedFilesTable';
import { CHANGE_SUPPLIER_INFORMING_ATKO_ACCESS_ACCEPT_ROLES, CHANGE_SUPPLIER_INFORMING_SUPPLIER_ACCESS_ACCEPT_ROLES } from './InformingChangeSupplier';
import { checkPermissions } from '../../../../util/verifyRole';
import { getChangeSupplierInformingFiles } from '../../../../actions/processesActions';

const InformingChangeSupplierFilesTab = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uid } = useParams();
  const {activeRoles: [{ relation_id }]} = useSelector(({ user }) => user);
  const { currentProcess } = useSelector(({ processes }) => processes);

  useEffect(() => {
    handleUpdateList();
  }, [relation_id, dispatch, navigate]);

  const handleUpdateList = () => {
    if (
      checkPermissions(
        'PROCESSES.CHANGE_SUPPLIER.INFORMING_ATKO.ACCESS',
        CHANGE_SUPPLIER_INFORMING_ATKO_ACCESS_ACCEPT_ROLES
      )
    ) {
      dispatch(getChangeSupplierInformingFiles(uid, 'informing-atko-for-change-supplier'));
    } else if (
      checkPermissions(
        'PROCESSES.CHANGE_SUPPLIER.INFORMING_SUPPLIER.ACCESS',
        CHANGE_SUPPLIER_INFORMING_SUPPLIER_ACCESS_ACCEPT_ROLES
      )
    ) {
      dispatch(getChangeSupplierInformingFiles(uid, 'informing-current-supplier'));
    } else {
      navigate('/processes');
    }
  };

  return (
      <UploadedFilesTable
        files={currentProcess?.files || []}
        tags={['Заявка на зміну СВБ']}
        handleUpdateList={handleUpdateList}
      />
  );
};

export default InformingChangeSupplierFilesTab;
