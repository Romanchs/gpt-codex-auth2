import React from 'react';
import { UploadedFilesTable } from '../../Components/UploadedFilesTable';
import { TAGS, useEndOfSupplyFilesQuery } from '../api';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { mainApi } from '../../../../../app/mainApi';

export const UploadedFiles = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { data, refetch } = useEndOfSupplyFilesQuery(uid);

  const handleUpdate = async () => {
    refetch();
    const response = await mainApi.util.getRunningOperationPromise('endOfSupplyFiles', uid);
    const isContainInProcessFiles = response.data.files.data.find((file) => file.status === 'IN_PROCESS');
    if (!isContainInProcessFiles) {
      dispatch(mainApi.util.invalidateTags([TAGS.END_OF_SUPPLY]));
    }
  };

  return (
    <UploadedFilesTable files={data?.files?.data || []} handleUpdateList={handleUpdate} tags={['Закінчення постачання']} />
  );
};
