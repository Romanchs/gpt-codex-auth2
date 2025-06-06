import Box from '@mui/material/Box';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UploadedFilesTable } from '../../../../Components/pages/Processes/Components/UploadedFilesTable';
import { Pagination } from '../../../../Components/Theme/Table/Pagination';
import { useFilesEnteringApQuery } from '../api';
import { useLazyMsFilesDownloadQuery } from '../../../../app/mainApi';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const FilesTab = () => {
  const { uid } = useParams();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const exportFileLog = useExportFileLog(["Введення ТКО в облік"]);
  const { currentData, isFetching, refetch } = useFilesEnteringApQuery({ uid, params }, { skip: !uid });
  const [downloadFile] = useLazyMsFilesDownloadQuery();

  const handleDownload = (file) => {
    downloadFile({ id: file?.file_processed_id, name: file?.file_name });
    exportFileLog(uid);
  }

  return (
    <Box>
      <UploadedFilesTable
        files={currentData?.files?.data || []}
        handleDownload={handleDownload}
        handleUpdateList={refetch}
      />
      <Pagination {...currentData?.files} loading={isFetching} params={params} onPaginate={setParams} />
    </Box>
  );
};

export default FilesTab;
