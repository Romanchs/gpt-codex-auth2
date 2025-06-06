import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  changeSupplierInformingAkoFiles,
  clearCurrentProcess,
  downloadProcessFileById
} from '../../../../actions/processesActions';
import { UploadedFilesTable } from '../Components/UploadedFilesTable';
import { Pagination } from '../../../Theme/Table/Pagination';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const InformingAkoPredictable = () => {
  const dispatch = useDispatch();
  const { uid } = useParams();
  const { currentProcess, loading } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const exportFileLog = useExportFileLog(['Заявка на зміну СВБ']);

  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  useEffect(() => {
    handleUpdateList();
  }, [dispatch, params]);

  const handleUpdateList = () => {
    dispatch(changeSupplierInformingAkoFiles(uid, 'with-predictable-dko', params));
  };

  const handleDownloadFile = (file) => {
    dispatch(downloadProcessFileById(file?.file_id, file?.file_name));
    exportFileLog(uid);
  };

  return (
    <div>
      <UploadedFilesTable
        files={currentProcess?.files?.data || []}
        handleDownload={handleDownloadFile}
        handleUpdateList={handleUpdateList}
      />
      <Pagination
        {...currentProcess?.files}
        loading={loading}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
      />
    </div>
  );
};

export default InformingAkoPredictable;
