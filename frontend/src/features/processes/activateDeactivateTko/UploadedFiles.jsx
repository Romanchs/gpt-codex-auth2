import React from 'react';
import { UploadedFilesTable } from '../../../Components/pages/Processes/Components/UploadedFilesTable';
import { mainApi } from '../../../app/mainApi';
import { useDispatch } from 'react-redux';

const UploadedFiles = ({ data, tags }) => {
  const dispatch = useDispatch();
  const handleUpdateList = () => {
    dispatch(mainApi.util.invalidateTags(['ACTIVATE_DEACTIVATE_DETAILS', 'UPLOADED_TKO']));
  };

  return <UploadedFilesTable files={data?.files || []} handleUpdateList={handleUpdateList} tags={tags} />;
};

export default UploadedFiles;
