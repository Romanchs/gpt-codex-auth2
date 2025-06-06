import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { downloadFileById } from '../../../../actions/massLoadActions';
import { UploadedFilesTable } from '../Components/UploadedFilesTable';
import { getTerminationResumptionFiles } from '../../../../actions/processesActions';
import { useParams } from 'react-router-dom';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const TerminationResumptionFilesTab = () => {
  const { uid } = useParams();
  const { currentProcess } = useSelector(({ processes }) => processes);
  const dispatch = useDispatch();
  const tags = currentProcess.action_type === 'RESUMPTION_SUPPLY' ? ['Відновлення постачання за ТКО'] : ['Припинення постачання за ТКО'];
  const exportFileLog = useExportFileLog(tags);

  useEffect(() => {
    dispatch(getTerminationResumptionFiles(uid));
  }, [dispatch]);

  const handleDownload = ({ file_id, file_name }) => {
    dispatch(downloadFileById(file_id, file_name));
    exportFileLog(uid);
  };

  const handleUpdateList = () => {
    dispatch(getTerminationResumptionFiles(uid));
  };

  return (
    <UploadedFilesTable
      files={currentProcess?.files || []}
      handleDownload={handleDownload}
      handleUpdateList={handleUpdateList}
    />
  );
};

export default TerminationResumptionFilesTab;
