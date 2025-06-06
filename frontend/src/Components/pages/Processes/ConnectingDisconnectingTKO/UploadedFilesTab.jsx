import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { downloadFileById } from '../../../../actions/massLoadActions';
import { UploadedFilesTable } from '../Components/UploadedFilesTable';
import { useParams } from 'react-router-dom';
import { getConnectingDisconnectingTKOFiles } from '../../../../actions/processesActions';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const UploadedFilesTab = () => {
  const { uid } = useParams();
  const { currentProcess } = useSelector(({ processes }) => processes);
  const dispatch = useDispatch();
  const tag = currentProcess.action_type === 'DISCONNECT_TKO' ? ['Заявка на відключення ТКО'] : ['Заявка на підключення ТКО'];
  const exportFileLog = useExportFileLog(tag);

  useEffect(() => {
    dispatch(getConnectingDisconnectingTKOFiles(uid));
  }, [dispatch]);

  const handleDownload = ({ file_id, file_name }) => {
    dispatch(downloadFileById(file_id, file_name));
    exportFileLog(uid);
  };

  const handleUpdateList = () => {
    dispatch(getConnectingDisconnectingTKOFiles(uid));
  };

  return (
    <UploadedFilesTable
      files={currentProcess?.files || []}
      handleDownload={handleDownload}
      handleUpdateList={handleUpdateList}
    />
  );
};

export default UploadedFilesTab;
