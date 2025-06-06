import { useMeterReadingProcessQuery } from '../api';
import { useParams } from 'react-router-dom';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import { useLazyMsFilesDownloadQuery } from '../../../app/mainApi';
import useExportFileLog from '../../../services/actionsLog/useEportFileLog';

const RequestsTab = ({ params }) => {
  const { uid } = useParams();
  const { currentData, refetch } = useMeterReadingProcessQuery({ uid, params });
  const [onDownload] = useLazyMsFilesDownloadQuery();
  const exportFileLog = useExportFileLog(['Інформування передачі показів від ППКО']);

  const handleDownloadFile = (file) => {
    onDownload({ id: file?.file_id, name: file?.file_name });
    exportFileLog(uid);
  };

  return (
    <UploadedFilesTable
      files={currentData?.files || []}
      handleDownload={handleDownloadFile}
      handleUpdateList={refetch}
    />
  );
};

export default RequestsTab;
