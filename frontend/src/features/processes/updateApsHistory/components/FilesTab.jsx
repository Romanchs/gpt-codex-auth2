import { useParams } from 'react-router-dom';
import { UploadedFilesTable } from '../../../../Components/pages/Processes/Components/UploadedFilesTable';
import { useLazyMsFilesDownloadQuery } from '../../../../app/mainApi';
import { useUpdateApsHistoryQuery } from '../api';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const FilesTab = () => {
  const { uid } = useParams();
  const { currentData, refetch } = useUpdateApsHistoryQuery(uid, { skip: !uid });
  const [download] = useLazyMsFilesDownloadQuery();
  const exportFileLog = useExportFileLog(['Запит на редагування основних даних ТКО']);

  return (
    <UploadedFilesTable
      files={currentData?.files || []}
      handleDownload={(file) => {
        download({
          id: file?.file_id,
          name: file?.file_name
        })
        exportFileLog(uid);
      }}
      handleUpdateList={refetch}
    />
  );
};

export default FilesTab;
