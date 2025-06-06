import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Page from '../../../../Components/Global/Page';
import Statuses from '../../../../Components/Theme/Components/Statuses';
import {
  useDoneRequestActivateApMutation,
  useRequestActivateApQuery,
  useTakeToWorkRequestActivateApMutation,
  useUploadRequestActivateApFileMutation
} from './api';
import InitiatorDetails from './InitiatorDetails';
import ExecutorDetails from './ExecutorDetails';
import { Typography } from '@material-ui/core';
import { UploadedFilesTable } from '../../../../Components/pages/Processes/Components/UploadedFilesTable';
import SimpleImportModal from '../../../../Components/Modal/SimpleImportModal';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import { useDispatch } from 'react-redux';
import { mainApi } from '../../../../app/mainApi';
import { useTranslation } from 'react-i18next';
import useImportFileLog from '../../../../services/actionsLog/useImportFileLog';
import { REQUEST_ACTIVATE_AP_LOG } from '../data';
import usePerformProcessLog from '../../../../services/actionsLog/usePerformProcessLog';
import useInitProcessLog from '../../../../services/actionsLog/useInitProcessLog';
import useViewLog from '../../../../services/actionsLog/useViewLog';

export const REQUEST_ACTIVATE_ACCEPT_ROLES = ['СВБ', 'АКО', 'АКО_Процеси', 'АТКО'];

const RequestActivateAp = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openImportModal, setOpenImportModal] = useState(false);
  const { data, isFetching, error } = useRequestActivateApQuery(uid);
  const [uploadFile, { isLoading: uploading, error: uploadError }] = useUploadRequestActivateApFileMutation();
  const [doneProcess, { isLoading: isDoneLoading }] = useDoneRequestActivateApMutation();
  const [takeToWork, { isLoading: isTakeToWorkLoading }] = useTakeToWorkRequestActivateApMutation();
  const viewLog = useViewLog(REQUEST_ACTIVATE_AP_LOG);
  const importFileLog = useImportFileLog(REQUEST_ACTIVATE_AP_LOG);
  const performProcessLog = usePerformProcessLog(REQUEST_ACTIVATE_AP_LOG);
  const useInitProcrssLog = useInitProcessLog();

  useEffect(() => {
    if(!data) return;
    viewLog(uid);
  }, [data, viewLog])

  useEffect(() => {
    if (error?.status == 403) navigate('/processes');
  }, [error]);

  const handleUpload = (data) => {
    uploadFile({ body: data, uid }).then(() => {
      setOpenImportModal(false);
    });
  };

  const handleUpdateList = () => {
    dispatch(mainApi.util.invalidateTags(['REQUEST_ACTIVATE_ACCOUNTING_POINT']));
  };

  const handleDoneProcess = () => {
    doneProcess(uid);
    performProcessLog(uid);
  }

  const handleTakeToWorkProcess = () => {
    takeToWork(uid);
    useInitProcrssLog(REQUEST_ACTIVATE_AP_LOG, uid);
  }

  return (
    <>
      <Page
        pageName={t('PAGES.REQUEST_ACTIVATE_AP_ID', {id: data?.id})}
        backRoute={'/processes'}
        faqKey={'PROCESSES__REQUEST_ACTIVATE_AP'}
        loading={isFetching || isDoneLoading || isTakeToWorkLoading}
        acceptPermisions={'PROCESSES.ACTIVATING_DEACTIVATING.ACTIVATING_REQUEST.ACCESS'}
        acceptRoles={REQUEST_ACTIVATE_ACCEPT_ROLES}
        notFoundMessage={error && t('PROCESS_NOT_FOUND')}
        controls={
          <>
            {data?.can_upload && (
              <CircleButton
                title={t('CONTROLS.IMPORT')}
                type={'upload'}
                onClick={() => setOpenImportModal(true)}
                dataMarker={'uploadFile'}
              />
            )}
            {data?.can_done && <CircleButton type={'done'} title={t('CONTROLS.PERFORM')} onClick={handleDoneProcess} />}
            {data?.can_start && (
              <CircleButton color={'green'} type={'toWork'} title={t('CONTROLS.TAKE_TO_WORK')} onClick={handleTakeToWorkProcess} />
            )}
          </>
        }
      >
        <Statuses statuses={['NEW', 'IN_PROCESS', 'DONE', 'PARTIALLY_DONE', 'CANCELED']} currentStatus={data?.status} />
        <InitiatorDetails />
        <ExecutorDetails />
        <Typography
          variant="h3"
          style={{
            fontSize: 15,
            fontWeight: 'normal',
            color: '#0D244D',
            lineHeight: 1.2,
            paddingBottom: 16,
            paddingTop: 18
          }}
        >
          {t('DOWNLOADED_FILES')}:
        </Typography>
        <UploadedFilesTable files={data?.files || []} handleUpdateList={handleUpdateList} tags={REQUEST_ACTIVATE_AP_LOG} />
      </Page>
      <SimpleImportModal
        title={t('IMPORT_AP_FILES')}
        openUpload={openImportModal}
        setOpenUpload={setOpenImportModal}
        handleUpload={(formData) => {
          handleUpload(formData);
          importFileLog();
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_WITH_AP_INFORMAT', {format: '.xlsx' }),
            accept: '.xlsx',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', {size: 15})
          },
          {
            key: 'file_original_key',
            label: t('IMPORT_FILE.SELECT_DIGITAL_SIGNATURE_FILE'),
            accept: '.p7s',
            maxSize: 40960,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE_KBYTE', {size: 40})
          }
        ]}
        uploading={uploading}
        error={uploadError}
      />
    </>
  );
};

export default RequestActivateAp;
