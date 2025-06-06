import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import DelegateBtn from '../../delegate/delegateBtn';
import DelegateInput from '../../delegate/delegateInput';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CancelModal from '../../../Components/Modal/CancelModal';
import DatePicker from '../../../Components/Theme/Fields/DatePicker';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import { Grid, Typography } from '@mui/material';
import { GeneratedFilesTable } from './GeneratedFilesTable';
import {
  useCreateTransferTsToGrexelMutation,
  useLazySendTsVolumesToGrexelQuery,
  useTransferTsToGrexelQuery,
  useLazyTransferTsToGrexelVersionsQuery,
  useUpdateTransferTsToGrexelMutation,
  useUploadTransferTsToGrexelCorrectionFileMutation
} from './api';
import SimpleImportModal from '../../../Components/Modal/SimpleImportModal';
import useProcessRoom from '../../../app/sockets/useProcessRoom';

export const TRANSFER_TS_TO_GREXEL_ACCEPT_ROLES = ['АКО_Процеси'];
const MIN_DATE = '2019-07-01';

const TransferTsToGrexel = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const { activeOrganization, full_name } = useSelector(({ user }) => user);
  const [openCancel, setOpenCancel] = useState(false);
  const [dateRange, setDateRange] = useState({});
  const [version, setVersion] = useState();
  const [delegating, setDelegating] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  const [create, { isLoading: creating, error: errorCreate }] = useCreateTransferTsToGrexelMutation();
  const [getVersions, { data: versions, isFetching: fetchingVersions }] = useLazyTransferTsToGrexelVersionsQuery();
  const { currentData, isFetching: fetching, error, refetch } = useTransferTsToGrexelQuery(uid, { skip: !uid });
  const [update, { isLoading: updating, error: errorUpdate }] = useUpdateTransferTsToGrexelMutation();
  const [sendTsVolumesToGrexel, { isFetching: sending }] = useLazySendTsVolumesToGrexelQuery();
  const [uploadFile, { isLoading: uploading, error: uploadError }] =
    useUploadTransferTsToGrexelCorrectionFileMutation();

  useProcessRoom(uid, refetch);

  const isDateRangeValid = () => {
    const { period_from, period_to } = dateRange;

    if (!period_from || !period_to) return false;

    const periodFrom = moment(period_from);
    const periodTo = moment(period_to);
    const minDate = moment(MIN_DATE);
    const maxDate = moment().subtract(1, 'd');

    const isValidRange = (date) => date.isValid() && date.isBetween(minDate, maxDate, 'days', '[]');

    return isValidRange(periodFrom) && isValidRange(periodTo) && periodFrom.isSameOrBefore(periodTo);
  };

  useEffect(() => {
    if (isDateRangeValid()) getVersions(dateRange);
  }, [dateRange]);

  const handleCreate = () => {
    create({ ...dateRange, version }).then((res) => {
      if (res?.data) {
        navigate(`/processes/transfer-ts-to-grexel/${res?.data}`, { replace: true });
      }
    });
  };

  const getDateValue = () => {
    if (currentData?.status?.startsWith('CANCELED') && currentData?.canceled_at)
      return moment(currentData?.canceled_at).format('DD.MM.yyyy • HH:mm');
    if (currentData?.status?.startsWith('DONE') && currentData?.completed_at)
      return moment(currentData?.completed_at).format('DD.MM.yyyy • HH:mm');
    if (currentData?.status?.startsWith('COMPLETED') && currentData?.finished_at)
      return moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm');
    return null;
  };

  return (
    <Page
      acceptPermisions={
        uid ? 'PROCESSES.TRANSFER_TS_TO_GREXEL.ACCESS' : 'PROCESSES.TRANSFER_TS_TO_GREXEL.INITIALIZATION'
      }
      acceptRoles={TRANSFER_TS_TO_GREXEL_ACCEPT_ROLES}
      pageName={
        fetching
          ? `${t('LOADING')}...`
          : currentData?.id
          ? t('PAGES.TRANSFER_TS_TO_GREXEL_ID', { id: currentData?.id })
          : t('PAGES.TRANSFER_TS_TO_GREXEL')
      }
      backRoute={'/processes'}
      loading={creating || updating || fetching || delegating || fetchingVersions || sending}
      notFoundMessage={error && !error?.comment && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {!uid && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={handleCreate}
              disabled={!isDateRangeValid() || !version}
            />
          )}
          {currentData?.can_upload && (
            <CircleButton type={'upload'} title={t('CONTROLS.IMPORT')} onClick={() => setOpenUpload(true)} />
          )}
          {currentData?.can_form && (
            <CircleButton type={'new'} title={t('CONTROLS.FORM')} onClick={() => update({ uid, type: 'to-form' })} />
          )}
          {currentData?.can_cancel && (
            <CircleButton type={'remove'} title={t('CONTROLS.CANCEL')} onClick={() => setOpenCancel(true)} />
          )}
          {currentData?.can_delegate && (
            <DelegateBtn
              process_uid={uid}
              onStarted={() => setDelegating(true)}
              onFinished={() => setDelegating(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
          {currentData?.can_complete && (
            <CircleButton
              type={'send'}
              title={t('CONTROLS.SENT')}
              onClick={() => sendTsVolumesToGrexel(uid).then(refetch)}
            />
          )}
        </>
      }
    >
      <Statuses
        statuses={['NEW', 'IN_PROCESS', 'DONE', 'COMPLETED', 'CANCELED']}
        currentStatus={currentData?.status || 'NEW'}
      />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
        <Grid container spacing={1} alignItems={'center'}>
          <Grid item xs={12} md={4} lg={2.5}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              value={uid ? currentData?.initiator?.username : full_name}
              readOnly
              data={currentData?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={2.4}>
            <StyledInput
              label={t('FIELDS.START_WORK_DATE')}
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={4} lg={2.4}>
            <StyledInput
              label={
                currentData?.status?.startsWith('CANCELED')
                  ? t('FIELDS.CANCELED_AT')
                  : currentData?.status?.startsWith('COMPLETED')
                  ? t('FIELDS.COMPLETED_AT')
                  : t('FIELDS.COMPLETE_DATETIME')
              }
              value={getDateValue()}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={4} lg={1.8}>
            {uid ? (
              <StyledInput
                label={t('FIELDS.PERIOD_FROM')}
                value={currentData?.period_from && moment(currentData?.period_from).format('DD.MM.yyyy')}
                readOnly
              />
            ) : (
              <DatePicker
                label={t('FIELDS.PERIOD_FROM')}
                value={dateRange?.period_from}
                error={errorCreate?.data?.period_from}
                onChange={(period_from) => setDateRange({ ...dateRange, period_from })}
                minDate={moment(MIN_DATE)}
                maxDate={dateRange?.period_to ? moment(dateRange?.period_to) : moment().subtract(1, 'day')}
                outFormat={'YYYY-MM-DD'}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4} lg={1.8}>
            {uid ? (
              <StyledInput
                label={t('FIELDS.PERIOD_TO')}
                value={currentData?.period_to && moment(currentData?.period_to).format('DD.MM.yyyy')}
                readOnly
              />
            ) : (
              <DatePicker
                label={t('FIELDS.PERIOD_TO')}
                value={dateRange?.period_to}
                error={errorCreate?.data?.period_to}
                onChange={(period_to) => setDateRange({ ...dateRange, period_to })}
                minDate={dateRange?.period_from ? moment(dateRange?.period_from) : moment(MIN_DATE)}
                maxDate={
                  dateRange?.period_from && moment(dateRange?.period_from).add(31, 'day') <= moment().subtract(1, 'day')
                    ? moment(dateRange?.period_from).add(31, 'day')
                    : moment().subtract(1, 'day')
                }
                outFormat={'YYYY-MM-DD'}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4} lg={1.1}>
            {uid ? (
              <StyledInput label={t('FIELDS.VERSION')} value={currentData?.version?.toString()} readOnly />
            ) : (
              <SelectField
                label={t('FIELDS.VERSION')}
                value={version}
                data={versions || []}
                onChange={setVersion}
                dataMarker={'version'}
                error={errorUpdate?.data?.version}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={uid ? currentData?.initiator_company?.short_name : activeOrganization?.name}
              readOnly
            />
          </Grid>
        </Grid>
      </div>
      {currentData?.files?.length > 0 && (
        <>
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
            {t('LIST_OF_GENERATED_FILES')}:
          </Typography>
          <GeneratedFilesTable
            files={currentData?.files || []}
            refetch={refetch}
            periodFrom={currentData?.period_from}
            periodTo={currentData?.period_to}
            version={currentData?.version}
          />
        </>
      )}
      <CancelModal
        text={t('CANCEL_PROCESS_CONFIRMATION')}
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        onSubmit={() => {
          update({ uid, type: 'cancel' }).then((res) => {
            if (!res?.error) {
              setOpenCancel(false);
            }
          });
        }}
      />
      <SimpleImportModal
        title={t('IMPORT_FILE_WITH_CORRECTIONS')}
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        canUploadWithoutKey
        handleUpload={(formData, handleClose) => {
          uploadFile({ uid, body: formData }).then(() => {
            handleClose();
          });
        }}
        layoutList={[
          {
            key: 'file_original',
            label: t('IMPORT_FILE.SELECT_FILE_FORMAT', { format: '.xlsx' }),
            accept: '.xlsx',
            maxSize: 15000000,
            sizeError: t('VERIFY_MSG.MAX_FILE_SIZE', { size: 15 })
          }
        ]}
        uploading={uploading}
        error={uploadError}
      />
    </Page>
  );
};

export default TransferTsToGrexel;
