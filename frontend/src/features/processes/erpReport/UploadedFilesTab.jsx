import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import { useDispatch } from 'react-redux';
import { mainApi } from '../../../app/mainApi';
import { useParams } from 'react-router-dom';
import { useErpReportFilesQuery } from './api';

const UploadedFilesTab = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { data } = useErpReportFilesQuery(uid);

  const handleUpdateList = () => {
    dispatch(mainApi.util.invalidateTags(['ERP_REPORT_FILES', 'ERP_REPORT']));
  };

  return <UploadedFilesTable files={data?.files?.data || []} handleUpdateList={handleUpdateList} tags={['Заявка на отримання звіту для ЕРП']} />;
};

export default UploadedFilesTab;
