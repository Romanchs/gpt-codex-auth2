import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from '../../../../Components/Theme/Table/Pagination';
import { UploadedFilesTable } from '../../../../Components/pages/Processes/Components/UploadedFilesTable';
import { useFilesChangePaymentTypeQuery } from '../api';
import { setParams } from '../slice';

const FilesTab = () => {
  const { uid } = useParams();
  const dispatch = useDispatch();
  const params = useSelector((store) => store.changePaymentType.params);
  const { currentData, isFetching, refetch } = useFilesChangePaymentTypeQuery({ uid, params }, { skip: !uid });

  return (
    <>
      <UploadedFilesTable
        files={currentData?.files || []}
        handleUpdateList={refetch}
        tags={['Зміна способу оплати послуг з розподілу/передачі е/е']}
      />
      <Pagination
        {...currentData?.aps}
        params={params}
        loading={isFetching}
        onPaginate={(p) => dispatch(setParams({ ...params, ...p }))}
      />
    </>
  );
};

export default FilesTab;
