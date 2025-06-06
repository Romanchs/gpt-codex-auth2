import Box from '@mui/material/Box';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CancelModal from '../../../../Components/Modal/CancelModal';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import DatePicker from '../../../../Components/Theme/Fields/DatePicker';
import RadioList from '../../../../Components/Theme/Fields/RadioList';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { Pagination } from '../../../../Components/Theme/Table/Pagination';
import DelegateInput from '../../../delegate/delegateInput';
import { DEFAULT_ROLES } from '../data.js';
import {
  useChangePPKOAutocompleteQuery,
  useChangePPKOQuery,
  useChangePPKORolesQuery,
  useInitChangePPKOMutation,
  useUpdateChangePPKOMutation
} from '../api';
import { setDataForInit, setParams } from '../slice';
import InnerDataTable from '../InnerDataTable';
import { useTranslation } from 'react-i18next';

const defaultColumns = [
  { id: 'eic', label: 'FIELDS.AP_CODE_TYPE_Z', minWidth: 200 },
  { id: 'connection_status', label: 'FIELDS.CONNECTION_STATUS', minWidth: 200 },
  { id: 'customer', label: 'FIELDS.AP_CUSTOMER_CODE', minWidth: 200 },
  { id: 'city', label: 'FIELDS.CITY', minWidth: 200 }
];

const DetailsTab = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { dataForInit, params } = useSelector((store) => store.changePPKO);

  const { currentData: rolesData } = useChangePPKORolesQuery(null, { skip: uid });
  const { full_name } = useSelector(({ user }) => user);
  const { currentData: ppko_company } = useChangePPKOAutocompleteQuery(null, { skip: uid });
  const [, { error }] = useInitChangePPKOMutation({ fixedCacheKey: 'changePPKO_init' });

  const { currentData, isFetching } = useChangePPKOQuery({ uid, params }, { skip: !uid });

  const [deleteTko, setDeleteTko] = useState(null);
  const [update, { isLoading: isUpdating, error: updateError }] = useUpdateChangePPKOMutation({
    fixedCacheKey: 'changePPKO_update'
  });

  const columns = [
    ...defaultColumns,
    currentData?.status === 'IN_PROCESS'
      ? {
          id: 'delete-tko',
          label: '',
          minWidth: 30,
          align: 'right',
          renderBody: (...args) => (
            <Box sx={{ mr: 1 }}>
              <CircleButton
                type={'delete'}
                title={t('CONTROLS.DELETE')}
                onClick={() => setDeleteTko(args[1].uid)}
                size={'small'}
                disabled={!currentData?.can_delete_point}
              />
            </Box>
          )
        }
      : {
          id: 'dropped_out',
          label: t('FIELDS.DROPPED_OUT_OF_PROCESS'),
          minWidth: 200,
          renderBody: (...args) =>
            args[1].review_data?.is_active
              ? t('CONTROLS.NO')
              : moment(args[1].review_data?.reviewed_at).format('DD.MM.yyyy • HH:mm')
        }
  ];

  const handleDeleteTko = () => {
    update({ uid, type: '/' + deleteTko, method: 'DELETE' });
    setDeleteTko(null);
  };

  const layoutDate = () => {
    let label = t('FIELDS.COMPLETE_DATETIME'),
      value = currentData?.finished_at;
    if (currentData?.status === 'REJECTED') {
      label = t('FIELDS.REQUEST_CANCEL_REJECTED_DATE');
      value = currentData?.finished_at;
    } else if (currentData?.status === 'CANCELED') {
      label = t('FIELDS.CANCELED_AT');
      value = currentData?.canceled_at;
    }
    return { label, value: value && moment(value).format('DD.MM.yyyy • HH:mm') };
  };

  return (
    <>
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
          {t('SELECT_ROLES_FOR_PPKO_CHANGES')}
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
          data={
            uid
              ? Object.entries(currentData?.additional_data?.roles_info || {})
                  ?.filter((i) => Boolean(i[1]))
                  ?.map((i) => [i[0], DEFAULT_ROLES[i[0]]])
              : !rolesData
              ? []
              : Object.entries(DEFAULT_ROLES)
                  .filter((i) => rolesData[i[0]])
                  .map((i) => i)
          }
          selected={
            (uid
              ? Object.entries(currentData?.additional_data?.roles_info || {})
                  ?.filter((i) => i[1])
                  ?.map((i) => i[0])
              : dataForInit?.roles) || []
          }
          setSelected={uid ? false : (roles) => dispatch(setDataForInit({ roles }))}
          groupName={'roles'}
        />
      </Box>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.SHORT_PPKO_NAME')}
              value={!uid ? ppko_company?.short_name : currentData?.additional_data?.ppko_company?.short_name}
              error={error?.data?.short_name}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.EIC_CODE_PPKO')}
              value={!uid ? ppko_company?.eic : currentData?.additional_data?.ppko_company?.eic}
              error={error?.data?.eic}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.USREOU')}
              value={!uid ? ppko_company?.usreou : currentData?.additional_data?.ppko_company?.usreou}
              error={error?.data?.usreou}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={3}>
            {currentData?.status === 'IN_PROCESS' ? (
              <DatePicker
                label={t('FIELDS.CHANGE_PPKO_DATE')}
                value={dataForInit?.ppko_change_date || currentData?.additional_data?.ppko_change_date}
                error={error?.data?.ppko_change_date || updateError?.data?.ppko_change_date}
                onChange={(v) => dispatch(setDataForInit({ ppko_change_date: moment(v).format() }))}
              />
            ) : (
              <StyledInput
                label={t('FIELDS.CHANGE_PPKO_DATE')}
                value={
                  currentData?.additional_data?.ppko_change_date &&
                  moment(currentData?.additional_data?.ppko_change_date).format('DD.MM.yyyy')
                }
                readOnly
              />
            )}
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={t('FIELDS.CONSIDERATION_DATETIME')}
              value={currentData?.formed_at && moment(currentData?.formed_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          {currentData?.status !== 'CANCELED' && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.REQUEST_CANCEL_APPROVED_DATE')}
                value={currentData?.approved_at && moment(currentData?.approved_at).format('DD.MM.yyyy • HH:mm')}
                readOnly
              />
            </Grid>
          )}
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput {...layoutDate()} readOnly />
          </Grid>
          {currentData?.status !== 'CANCELED' && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.COMPLETED_AT')}
                value={currentData?.completed_at && moment(currentData?.completed_at).format('DD.MM.yyyy • HH:mm')}
                readOnly
              />
            </Grid>
          )}
        </Grid>
      </Box>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              readOnly
              value={!uid ? full_name : currentData?.initiator?.username}
              data={currentData?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              value={!uid ? ppko_company?.full_name : currentData?.initiator_company?.full_name}
              readOnly
            />
          </Grid>
        </Grid>
      </Box>
      {currentData?.aps && (
        <>
          <InnerDataTable
            columns={columns}
            currentData={currentData.aps}
            loading={isFetching || isUpdating}
            isPagination={false}
            ignoreI18={false}
          />
          <Pagination
            {...currentData.aps}
            loading={isFetching || isUpdating}
            params={params}
            onPaginate={(v) => dispatch(setParams(v))}
          />
        </>
      )}
      <CancelModal
        text={t('DELETE_AP_FROM_PROCESS_COMFIRAMTION')}
        open={Boolean(deleteTko)}
        onClose={() => setDeleteTko(null)}
        onSubmit={handleDeleteTko}
      />
    </>
  );
};

export default DetailsTab;
