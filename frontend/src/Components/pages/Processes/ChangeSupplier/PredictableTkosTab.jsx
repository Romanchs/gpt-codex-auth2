import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  deleteChangeSupplyTkoByUid,
  getChangeSupplierPredictableTkos,
  getChangeSupplierTkos
} from '../../../../actions/processesActions';
import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import StyledInput from '../../../Theme/Fields/StyledInput';
import moment from 'moment';
import { Pagination } from '../../../Theme/Table/Pagination';
import { TkosTable } from './TkosTable';
import DelegateInput from '../../../../features/delegate/delegateInput';
import { useTranslation } from 'react-i18next';

const PredictableTkosTab = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const { uid } = useParams();
  const { currentProcess, loading } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });

  useEffect(() => {
    dispatch(getChangeSupplierPredictableTkos(uid, params));
  }, [dispatch, params]);

  return (
    <div>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.USER_INITIATOR')}
              disabled
              value={currentProcess?.initiator?.username || ''}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.EIC_X_INITIATOR')}
              disabled
              value={currentProcess?.initiator_company?.eic || ''}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USREOU')} disabled value={currentProcess?.initiator_company?.usreou || ''} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              disabled
              value={currentProcess?.created_at && moment(currentProcess?.created_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.START_WORK_DATE')}
              disabled
              value={currentProcess?.started_at && moment(currentProcess?.started_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CHANGED_SUPPLIER_AT')}
              disabled
              value={
                currentProcess?.changed_supplier_at && moment(currentProcess?.changed_supplier_at).format('DD.MM.yyyy')
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.NEW_INITIATOR_NAME')}
              disabled
              value={currentProcess?.initiator_company?.short_name || ''}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DelegateInput
              label={t('FIELDS.USER_EXECUTOR')}
              disabled
              value={currentProcess?.executor?.username || ''}
              data={currentProcess?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.DATETIME_OF_REVIEW')}
              disabled
              value={currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.MUST_BE_FINISHED_AT')}
              disabled
              value={
                currentProcess?.must_be_finished_at && moment(currentProcess?.must_be_finished_at).format('DD.MM.yyyy')
              }
            />
          </Grid>
        </Grid>
      </div>
      <TkosTable
        data={currentProcess?.aps?.data || []}
        can_delete_tko={currentProcess?.can_delete_tko}
        handleDelete={(tko_uid) => {
          dispatch(
            deleteChangeSupplyTkoByUid(uid, tko_uid, () => {
              dispatch(getChangeSupplierTkos(uid, params));
            })
          );
        }}
      />
      <Pagination
        {...currentProcess?.aps}
        loading={loading}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
      />
    </div>
  );
};

export default PredictableTkosTab;
