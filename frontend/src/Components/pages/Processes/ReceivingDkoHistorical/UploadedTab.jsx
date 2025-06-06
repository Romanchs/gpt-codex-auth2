import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { downloadFileById } from '../../../../actions/massLoadActions';
import { getReceivingDkoHistoricalFiles } from '../../../../actions/processesActions';
import { Pagination } from '../../../Theme/Table/Pagination';
import { UploadedFilesTable } from '../Components/UploadedFilesTable';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const UploadedTab = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { currentProcess, loading } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });

  const exportFileLog = useExportFileLog(['Запит історії по споживачу']);

  // Check roles & get data
  useEffect(() => {
    dispatch(getReceivingDkoHistoricalFiles(uid, params));
  }, [dispatch, uid, params]);

  const handleDownload = ({ file_processed_id, file_name }) => {
    dispatch(downloadFileById(file_processed_id, file_name));
    exportFileLog(uid);
  };

  const handleUpdateList = () => {
    dispatch(getReceivingDkoHistoricalFiles(uid, params));
  };

  return (
    <>
      <UploadedFilesTable
        files={currentProcess?.uploaded_files?.data || []}
        handleDownload={handleDownload}
        handleUpdateList={handleUpdateList}
      />
      <Pagination
        loading={loading}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
        {...currentProcess?.uploaded_files}
      />
    </>
  );
};

export default UploadedTab;
