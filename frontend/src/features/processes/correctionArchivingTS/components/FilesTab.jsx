import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UploadedFilesTable } from '../../../../Components/pages/Processes/Components/UploadedFilesTable';
import { mainApi } from '../../../../app/mainApi';
import { TAGS, useFilesCorrectionArchivingTSQuery } from '../api';

const FilesTab = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { currentData, refetch } = useFilesCorrectionArchivingTSQuery(uid);

  const handleUpdate = () => {
    dispatch(mainApi.util.invalidateTags([TAGS.CORRECTION_ARCHIVING_TS]));
    refetch();
  };

  return <UploadedFilesTable files={currentData?.files || []} handleUpdateList={handleUpdate} />;
};

export default FilesTab;
