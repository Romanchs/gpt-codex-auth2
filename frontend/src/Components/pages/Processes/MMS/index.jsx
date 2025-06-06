import { Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  clearMmsUpload,
  mmsGetInfo,
  mmsSetFailureModal,
  mmsSetParams,
  mmsUploadFile
} from '../../../../actions/mmsActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { Pagination } from '../../../Theme/Table/Pagination';
import DragDropFiles from './DragDropFiles';
import SuccessModal from './SuccessModal';
import Table from './Table';
import AccessTimeFilledRounded from '@mui/icons-material/AccessTimeFilledRounded';
import { useTranslation } from 'react-i18next';

export const MMS_ACCEPT_ROLES = ['АКО','АКО_Процеси','АКО_ППКО','АКО_Користувачі','АКО_Довідники','ОДКО','АДКО'];

const Mms = () => {
  const {t} = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { relation_id } = useSelector(({ user }) => user.activeRoles[0]);
  const { data, loading, params, failureModal, uploading } = useSelector(({ mms }) => mms);

  useEffect(() => {
    if (
      checkPermissions('PROCESSES.MMS.INITIALIZATION', MMS_ACCEPT_ROLES)
    ) {
      dispatch(mmsGetInfo(params));
    } else {
      navigate('/processes');
    }
  }, [dispatch, navigate, relation_id, params]);

  const handleCloseDialog = () => {
    if (uploading) {
      clearInterval(window.massLoadInterval);
      dispatch(mmsGetInfo(params));
    }
    dispatch(clearMmsUpload());
    setOpenDialog(false);
  };

  return (
    <Page
      pageName={t('PAGES.MMS')}
      backRoute={'/processes'}
      loading={loading}
      faqKey={'PROCESSES__MMS'}
      controls={
        <>
          {checkPermissions('PROCESSES.MMS.CONTROLS.UPLOAD', ['АКО_Процеси', 'ОДКО', 'АДКО']) && (
            <CircleButton type={'upload'} onClick={() => setOpenDialog(true)} title={t('CONTROLS.IMPORT')} />
          )}
          {checkPermissions('PROCESSES.MMS.CONTROLS.UPLOAD_ZV', 'АКО_Процеси') && (
            <CircleButton
              dataMarker={'upload-zv'}
              onClick={() => navigate('/processes/mms/upload-zv')}
              title={t('PAGES.UPLOAD_ZV')}
              icon={<AccessTimeFilledRounded />}
            />
          )}
        </>
      }
    >
      <Table params={params} data={data || []} />
      <Pagination
        {...data}
        loading={loading}
        params={params}
        onPaginate={(v) => dispatch(mmsSetParams({ ...params, ...v }))}
      />
      <SuccessModal />
      <ModalWrapper
        open={Boolean(failureModal)}
        header={t('IMPORT_FILE.IMPORT_FILE_ERROR', {name: failureModal?.file_name || ''})}
        onClose={() => dispatch(mmsSetFailureModal(null))}
      >
        <Grid
          container
          justifyContent={'space-between'}
          alignItems={'center'}
          spacing={3}
          style={{
            marginTop: 24,
            minWidth: 400,
            borderBottom: '1px solid rgba(34, 59, 130, 0.25)'
          }}
        >
          <Grid item style={{ color: '#6C7D9A' }}>
            {t('IMPORT_FILE.IMPORT_FILE_RESULT')}
          </Grid>
          <Grid
            item
            style={{
              color: '#FF0000',
              fontWeight: 900
            }}
          >
            {failureModal?.return_codes.map((i) => Object.keys(i)[0]).join(' / ')}
          </Grid>
        </Grid>
        <ul
          style={{
            marginTop: 24,
            marginLeft: 12,
            color: '#ff0000',
            fontStyle: 'italic'
          }}
        >
          {failureModal?.return_codes?.map((i) => {
            return (
              <li key={i + Object.keys(i)[0]} style={{ paddingBottom: 4 }}>{`${Object.keys(i)[0]} (${
                Object.values(i)[0]
              })`}</li>
            );
          })}
        </ul>
      </ModalWrapper>
      {/*<ImportModal*/}
      {/*  open={openDialog}*/}
      {/*  onClose={handleCloseDialog}*/}
      {/*  nameOfFirstField={'Файл з ДКО в форматі xml'}*/}
      {/*  mainHeadline={'Завантажте файл з даними комерційного обліку'}*/}
      {/*  fileName={'files_original'}*/}
      {/*  fileNameKey={'files_key'}*/}
      {/*/>*/}
      <DragDropFiles
        open={openDialog}
        handleClose={handleCloseDialog}
        onUpload={(data) => dispatch(mmsUploadFile(data))}
      />
    </Page>
  );
};

export default Mms;
