import React, { useState } from 'react';
import { UploadedFilesTable } from '../../Components/pages/Processes/Components/UploadedFilesTable';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import { useFilesQuery } from './api';

const Files = () => {
  const [params, setParams] = useState({page: 1, size: 25});
  const { currentData, isFetching, refetch } = useFilesQuery(params);

  return (
    <>
      <UploadedFilesTable files={currentData?.data || []} handleUpdateList={refetch} tags={['Публікація термінів сертифікації ДКО']} />;
      <Pagination
        {...currentData}
        loading={isFetching}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
      />
    </>
  );
};

export default Files;