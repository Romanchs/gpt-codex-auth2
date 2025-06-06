import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUploadedTkoFilesQuery } from '../../api';
import { mainApi } from '../../../../../app/mainApi';
import { Pagination } from '../../../../../Components/Theme/Table/Pagination';
import { useDispatch } from 'react-redux';
import { UploadedFilesTable } from '../../../../../Components/pages/Processes/Components/UploadedFilesTable';
import { downloadProcessFileById } from '../../../../../actions/processesActions';
import useExportFileLog from '../../../../../services/actionsLog/useEportFileLog';

const FilesTab = ({ setIsLoading }) => {
  const { uid } = useParams();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const dispatch = useDispatch();
  const exportFileLog = useExportFileLog(['Заявка про завершення надання послуг ком. обліку']);

  const { data, isFetching, refetch } = useGetUploadedTkoFilesQuery(
    {
      uid,
      params
    },
    { skip: !uid }
  );

  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching]);

  const handleUpdateList = async () => {
    await refetch();
    dispatch(mainApi.util.invalidateTags(['PROCESS_DATA']));
  };

  const handleDownloadFile = (file) => {
    dispatch(downloadProcessFileById(file?.file_processed_id, file?.file_name));
    exportFileLog(uid);
  };

  return (
    <>
      <UploadedFilesTable files={data?.uploaded_files?.data || []} handleUpdateList={handleUpdateList} handleDownload={handleDownloadFile} />
      <Pagination
        {...data?.uploaded_files}
        loading={isFetching}
        params={params}
        onPaginate={(v) => {
          setParams({ ...params, ...v });
        }}
      />
    </>
  );
};

export default FilesTab;
