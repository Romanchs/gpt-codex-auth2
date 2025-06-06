import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDisputeTko } from '../../../../actions/processesActions';
import { UploadedFilesTable } from '../Components/UploadedFilesTable';
import { downloadFileById } from '../../../../actions/massLoadActions';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const DisputeFiles = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { currentProcess } = useSelector(({ processes }) => processes);
  const exportFileLog = useExportFileLog(['Суперечка з основних даних ТКО']);

  const handleDownload = (file) => {
    dispatch(downloadFileById(file?.file_id, file?.file_name));
    exportFileLog(uid);
  };

  const handleUpdateList = () => {
    dispatch(getDisputeTko(uid));
  };

  return (
    <UploadedFilesTable
      files={currentProcess?.files || []}
      handleDownload={handleDownload}
      handleUpdateList={handleUpdateList}
    />
  );
};

export default DisputeFiles;
