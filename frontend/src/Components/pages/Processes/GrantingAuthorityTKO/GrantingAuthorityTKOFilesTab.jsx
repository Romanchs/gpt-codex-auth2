import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { downloadFileById } from '../../../../actions/massLoadActions';
import { getFilesGrantingAuthority } from '../../../../actions/processesActions';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { Pagination } from '../../../Theme/Table/Pagination';
import { UploadedFilesTable } from '../Components/UploadedFilesTable';
import { useTranslation } from 'react-i18next';
import useExportFileLog from '../../../../services/actionsLog/useEportFileLog';

const GrantingAuthorityTkoFilesTab = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { currentProcess, loading } = useSelector(({ processes }) => processes);
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const exportFileLog = useExportFileLog(['Запит на перегляд даних ТКО']);

  // Check roles & get data
  useEffect(() => {
    dispatch(getFilesGrantingAuthority(uid, params));
  }, [dispatch, uid, relation_id, params]);

  const handleDownload = (file) => {
    dispatch(downloadFileById(file?.file_processed_id, file?.file_name));
    exportFileLog(uid);
  };

  const handleUpdateList = () => {
    dispatch(getFilesGrantingAuthority(uid, params));
  };

  return (
    <>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.UNIQUE_APS')}
              disabled
              value={currentProcess?.successfully_uploaded_tkos?.toString()}
            />
          </Grid>
        </Grid>
      </div>
      <UploadedFilesTable
        files={currentProcess?.uploaded_files?.data || []}
        handleDownload={handleDownload}
        handleUpdateList={handleUpdateList}
      />
      <Pagination
        loading={loading}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
        {...currentProcess?.uploaded_files}
      />
    </>
  );
};

export default GrantingAuthorityTkoFilesTab;
