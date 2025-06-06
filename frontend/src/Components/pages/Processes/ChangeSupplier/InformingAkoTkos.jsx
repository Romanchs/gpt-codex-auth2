import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  changeSupplierInformingAkoTkos,
  clearCurrentProcess,
  deleteChangeSupplyTkoByUid,
  getChangeSupplierTkos
} from '../../../../actions/processesActions';
import Grid from '@material-ui/core/Grid';
import StyledInput from '../../../Theme/Fields/StyledInput';
import moment from 'moment';
import { TkosTable } from './TkosTable';
import { Pagination } from '../../../Theme/Table/Pagination';
import { useTranslation } from 'react-i18next';

const InformingAkoTkos = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { uid } = useParams();
  const { currentProcess, loading } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });

  useEffect(() => {
    dispatch(changeSupplierInformingAkoTkos(uid, params));
  }, [dispatch, params]);

  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

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
              label={t('FIELDS.FORMED_AT')}
              disabled
              value={currentProcess?.formed_at && moment(currentProcess?.formed_at).format('DD.MM.yyyy • HH:mm')}
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
            <StyledInput
              label={t('FIELDS.COMPLETE_DATETIME')}
              disabled
              value={currentProcess?.completed_at && moment(currentProcess?.completed_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.COMPLETED_AT')}
              disabled
              value={currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CANCELED_AT')}
              disabled
              value={currentProcess?.canceled_at && moment(currentProcess?.canceled_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}></Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CHANGES_FROM_PON')}
              disabled
              value={currentProcess?.from_pon ? t('CONTROLS.YES') : t('CONTROLS.NO')}
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

export default InformingAkoTkos;
