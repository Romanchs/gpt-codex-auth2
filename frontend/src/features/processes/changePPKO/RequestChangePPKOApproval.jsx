import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import SelectModal from '../../../Components/Modal/SelectModal';
import RadioList from '../../../Components/Theme/Fields/RadioList';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { Pagination } from '../../../Components/Theme/Table/Pagination';
import { DEFAULT_ROLES, REASONS } from './data';
import { useRequestChangePPKOApprovalQuery, useUpdateRequestChangePPKOApprovalMutation } from './api';
import InnerDataTable from './InnerDataTable';
import { useTranslation } from 'react-i18next';
import uaTranslations from '../../../i18n/ua/ua.json';

const defaultParams = { page: 1, size: 25 };

const defaultColumns = [
  { id: 'eic', label: 'FIELDS.AP_CODE_TYPE_Z', minWidth: 100 },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 100 },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_CODE', minWidth: 100 },
  { id: 'city', label: 'FIELDS.CITY', minWidth: 100 }
];

const RequestChangePPKOApproval = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const [rejectDialog, setRejectlDialog] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const [deleteTko, setDeleteTko] = useState(false);
  const reasonsTranslations = uaTranslations.CHANGE_PPKO_REASONS;

  const { data, isFetching, isError, error } = useRequestChangePPKOApprovalQuery({ uid, params });
  const [update, { isLoading: isUpdating }] = useUpdateRequestChangePPKOApprovalMutation();
  const loading = isFetching || isUpdating;

  const columns = [...defaultColumns];
  if (data?.status !== 'NEW') {
    columns.push({
      id: 'reason',
      label: 'REMOVE_PPKO_REASON',
      minWidth: 200,
      renderBody: (...args) => {
        const value = args[1]?.review_data?.reason;
        if (!value) return '–';
        const translationKey = Object.keys(reasonsTranslations).find(
          (key) => reasonsTranslations[key].toLowerCase() === value.toLowerCase()
        );
        return translationKey ? t(`CHANGE_PPKO_REASONS.${translationKey}`) : value;
      }
    });
  }
  if (data?.status === 'IN_PROCESS') {
    columns.push({
      id: 'reject-tko',
      label: '',
      align: 'right',
      minWidth: 30,
      renderBody: (...args) => (
        <Box sx={{ mr: 1 }}>
          <CircleButton
            type={'remove'}
            title={args[1]?.review_data?.is_active ? t('CANCEL_AP') : ''}
            onClick={() => setDeleteTko(args[1]?.uid)}
            size={'small'}
            disabled={!args[1]?.review_data?.is_active}
          />
        </Box>
      )
    });
  }

  const handleRejectRequest = (reason) => {
    setRejectlDialog(false);
    update({ uid, type: '/reject-all-points', body: { reason } });
  };

  const handleDeleteTko = (reason) => {
    update({ uid, type: `/${deleteTko}/reject`, body: { reason } });
    setDeleteTko(false);
  };

  const handleLayoutData = () => {
    let label = t('FIELDS.COMPLETE_DATETIME'),
      value = data?.finished_at;
    if (data?.status === 'REJECTED') {
      label = t('FIELDS.REQUEST_CANCEL_REJECTED_DATE');
      value = data?.finished_at;
    } else if (data?.status === 'CANCELED') {
      label = t('FIELDS.CANCELED_AT');
      value = data?.canceled_at;
    }
    return { label, value: value && moment(value).format('DD.MM.yyyy • HH:mm') };
  };

  return (
    <Page
      acceptPermisions={'PROCESSES.CHANGE_PPKO.APPROVE.ACCESS'}
      acceptRoles={['АКО_ППКО']}
      pageName={data?.id ? t('PAGES.REQUEST_CHANGE_PPKO_APPROVAL', { id: data?.id }) : `${t('LOADING')}...`}
      backRoute={'/processes'}
      loading={loading}
      notFoundMessage={isError && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {data?.status === 'NEW' && (
            <CircleButton
              type={'create'}
              title={t('CONTROLS.TAKE_TO_WORK')}
              onClick={() => update({ uid, type: '/accept' })}
              disabled={loading || data?.can_formed}
            />
          )}
          {data?.status === 'IN_PROCESS' && (
            <>
              <CircleButton
                type={'remove'}
                title={t('CONTROLS.CANCEL_ALL_AP')}
                onClick={() => setRejectlDialog(true)}
                dataMarker={'remove_all'}
                disabled={loading || !data?.can_reject}
              />
              <CircleButton
                type={'done'}
                title={t('CONTROLS.DONE_PROCESS')}
                onClick={() => update({ uid, type: '/done' })}
                disabled={loading || !data?.aps?.data?.find(({ review_data }) => !review_data?.reason)}
              />
            </>
          )}
        </>
      }
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'DONE', 'REJECTED', 'CANCELED']} currentStatus={data?.status} />
      <Box className={'boxShadow'} sx={{ mt: 2, mb: 2 }}>
        <Box
          component={'h3'}
          sx={{
            fontSize: 15,
            fontWeight: 'normal',
            color: '#0D244D',
            lineHeight: 1.2,
            padding: '16px 24px'
          }}
        >
          {t('SELECTED_ROLES_FOR_PPKO_CHANGES')}
        </Box>
        <Box
          component={'hr'}
          sx={{
            height: '1px',
            border: 'none',
            backgroundColor: '#FFFFFF',
            boxShadow: 'inset 0px -1px 0px #E9EDF6'
          }}
        />
        <RadioList
          data={Object.entries(DEFAULT_ROLES).filter((i) => data?.additional_data?.roles_info?.[i[0]])}
          selected={
            data?.additional_data?.roles_info
              ? Object.entries(data?.additional_data?.roles_info)
                  .filter((i) => Boolean(i[1]))
                  .map(([k]) => k)
              : []
          }
          groupName={'roles'}
        />
      </Box>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={5}>
            <StyledInput
              label={t('FIELDS.SHORT_PPKO_NAME')}
              value={data?.additional_data?.ppko_company?.short_name}
              error={error?.short_name}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.EIC_CODE_PPKO')}
              value={data?.additional_data?.ppko_company?.eic}
              error={error?.eic}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <StyledInput
              label={t('FIELDS.USREOU')}
              value={data?.additional_data?.ppko_company?.usreou}
              error={error?.usreou}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <StyledInput
              label={t('FIELDS.CHANGE_PPKO_DATE')}
              value={
                data?.additional_data?.ppko_change_date &&
                moment(data?.additional_data?.ppko_change_date).format('DD.MM.yyyy')
              }
              readOnly
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} value={data?.initiator?.username} readOnly />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={data?.created_at && moment(data?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} value={data?.initiator_company?.full_name} readOnly />
          </Grid>
        </Grid>
      </Box>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.USER_EXECUTOR')} value={data?.executor?.username} readOnly />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.START_WORK_DATE')}
              value={data?.started_at && moment(data?.started_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput {...handleLayoutData()} readOnly />
          </Grid>
          <Grid item xs={12}>
            <StyledInput label={t('FIELDS.EXECUTOR_COMPANY_NAME')} value={data?.executor_company?.full_name} readOnly />
          </Grid>
        </Grid>
      </Box>
      <InnerDataTable
        columns={columns}
        currentData={data?.aps}
        loading={loading}
        isPagination={false}
        ignoreI18={false}
      />
      <Pagination {...data?.aps} loading={loading} params={params} onPaginate={(v) => setParams({ ...params, ...v })} />
      <SelectModal
        text={t('CANCEL_PPKO_REASON')}
        label={t('REMOVE_PPKO_REASON')}
        list={REASONS}
        open={rejectDialog}
        onClose={() => setRejectlDialog(false)}
        onSubmit={handleRejectRequest}
        resetAfterClose
      />
      <SelectModal
        text={t('CANCEL_PPKO_REASON')}
        label={t('REMOVE_PPKO_REASON')}
        list={REASONS}
        open={Boolean(deleteTko)}
        onClose={() => setDeleteTko(false)}
        onSubmit={handleDeleteTko}
        resetAfterClose
      />
    </Page>
  );
};

export default RequestChangePPKOApproval;
