import { Grid, Typography } from '@material-ui/core';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  clearDirectoryListParams,
  closeAllDialogs,
  downloadSuppliers,
  downloadSuppliersUpdateResult,
  getSuppliersDirectory,
  setDirectoryListParams
} from '../../../../actions/directoriesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { GreenButton } from '../../../Theme/Buttons/GreenButton';
import { Pagination } from '../../../Theme/Table/Pagination';
import SuppliersTable from './SuppliersTable';
import { useTranslation } from 'react-i18next';

const Suppliers = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, params, selectedDirectory, downloading } = useSelector((s) => s.directories);
  const { openSuccessDialog, openPartialDialog, openFailureDialog, fileId } = useSelector(
    ({ directories }) => directories.uploadSuppliersStatus
  );

  useEffect(() => {
    if (checkPermissions('DIRECTORIES.SUPPLIERS.ACCESS', ['АКО...', 'ГапПок'])) {
      dispatch(getSuppliersDirectory(params));
    } else {
      navigate('/directories');
    }
  }, [dispatch, navigate, params]);

  useEffect(
    () => () => {
      dispatch(clearDirectoryListParams());
    },
    [dispatch]
  );

  const handleDownload = () => {
    dispatch(downloadSuppliers('DATAHUB-ДОВІДНИК-СВБ'));
  };

  // const handleUpload = ({ target }) => {
  //   if (target.files.length === 1) {
  //     dispatch(uploadSuppliersDirectory(target));
  //   }
  // };

  return (
    <Page
      pageName={t('PAGES.SUPPLIERS')}
      loading={loading}
      backRoute={'/directories'}
      controls={
        checkPermissions('DIRECTORIES.SUPPLIERS.CONTROLS.DOWNLOAD', 'АКО_Довідники') && (
          // <>
          // 	<input
          // 		accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,application/vnd.ms-excel.sheet.macroenabled.12"
          // 		id="upload-suppliers-file"
          // 		type="file"
          // 		onClick={e => e.target.value = null}
          // 		onChange={handleUpload}
          // 	/>
          // 	<label htmlFor="upload-suppliers-file" style={{margin: 0}}>
          // 		<CircleButton component="span" type={'upload'} title={'Імпорт'}/>
          // 	</label>
          <CircleButton
            onClick={handleDownload}
            type={'download'}
            title={t('CONTROLS.DOWNLOAD_DIRECTORY')}
            disabled={downloading}
          />
        )
        //</>
      }
    >
      <SuppliersTable />
      <Pagination
        {...selectedDirectory}
        loading={loading}
        params={params}
        onPaginate={(p) => dispatch(setDirectoryListParams({ ...params, ...p }))}
        elementsName={t('PAGINATION.ELEMENTS')}
      ></Pagination>
      <ModalWrapper open={openSuccessDialog} onClose={() => dispatch(closeAllDialogs())}>
        <Grid container spacing={3} alignItems={'center'} style={{ marginRight: 16, marginTop: 0 }}>
          <Grid item>
            <CheckCircleRounded style={{ color: '#008C0C', fontSize: 48 }} />
          </Grid>
          <Grid item>
            <Typography variant={'h6'}>{t('UPDATE_DIRECTORY_SUCCESS')}!</Typography>
          </Grid>
        </Grid>
        <div
          style={{
            textAlign: 'center',
            marginTop: 28
          }}
        >
          <GreenButton style={{ minWidth: '60%' }} onClick={() => dispatch(closeAllDialogs())}>
            {t('CONTROLS.OK')}
          </GreenButton>
        </div>
      </ModalWrapper>
      <ModalWrapper open={openPartialDialog} onClose={() => dispatch(closeAllDialogs())}>
        <Grid container spacing={3} alignItems={'center'} style={{ marginRight: 16, marginTop: 0 }}>
          <Grid item>
            <ErrorRounded style={{ color: '#FF4850', fontSize: 48 }} />
          </Grid>
          <Grid item>
            <Typography variant={'h6'}>{t('UPDATE_DIRECTORY_PARTLY')}!</Typography>
          </Grid>
        </Grid>
        <div
          style={{
            textAlign: 'center',
            marginTop: 28
          }}
        >
          <GreenButton style={{ minWidth: '60%' }} onClick={() => dispatch(downloadSuppliersUpdateResult(fileId))}>
            {t('DOWNLOAD_RESULT')}
          </GreenButton>
        </div>
      </ModalWrapper>
      <ModalWrapper open={openFailureDialog} onClose={() => dispatch(closeAllDialogs())}>
        <Grid container spacing={3} alignItems={'center'} style={{ marginRight: 16, marginTop: 0 }}>
          <Grid item>
            <ErrorRounded style={{ color: '#FF4850', fontSize: 48 }} />
          </Grid>
          <Grid item>
            <Typography variant={'h6'}>{t('UPDATE_DIRECTORY_ERROR')}!</Typography>
          </Grid>
        </Grid>
        <div
          style={{
            textAlign: 'center',
            marginTop: 28
          }}
        >
          <GreenButton style={{ minWidth: '60%' }} onClick={() => dispatch(downloadSuppliersUpdateResult(fileId))}>
            {t('DOWNLOAD_RESULT')}
          </GreenButton>
        </div>
      </ModalWrapper>
    </Page>
  );
};

export default Suppliers;
