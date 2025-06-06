import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { deleteChangeSupplyTkoByUid, getChangeSupplierTkos } from '../../../../actions/processesActions';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { Pagination } from '../../../Theme/Table/Pagination';
import { TkosTable } from './TkosTable';
import DelegateInput from '../../../../features/delegate/delegateInput';
import { TYPE_OF_ACCOUNTING_POINT } from '../../../../util/directories';
import { useTranslation } from 'react-i18next';

const TkosTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { uid } = useParams();
  const { currentProcess, loading } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });

  useEffect(() => {
    dispatch(getChangeSupplierTkos(uid, params));
  }, [dispatch, params]);

  return (
    <div>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              value={currentProcess?.initiator?.username || ''}
              disabled
              data={currentProcess?.delegation_history || []}
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
                currentProcess?.must_be_finished_at && moment(currentProcess?.must_be_finished_at).format('DD.MM.yyyy')
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.FORMED_AT')}
              disabled
              value={currentProcess?.formed_at && moment(currentProcess?.formed_at).format('DD.MM.yyyy • HH:mm')}
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
              label={t('FIELDS.POINT_TYPE')}
              disabled
              value={t(TYPE_OF_ACCOUNTING_POINT[currentProcess?.type_of_ap])}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={
                currentProcess?.status?.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')
              }
              disabled
              value={
                currentProcess?.status === 'DONE'
                  ? currentProcess?.finished_at && moment(currentProcess?.finished_at).format('DD.MM.yyyy • HH:mm')
                  : currentProcess?.canceled_at && moment(currentProcess?.canceled_at).format('DD.MM.yyyy • HH:mm')
              }
            />
          </Grid>
        </Grid>
      </div>
      <TkosTable
        data={currentProcess?.aps?.data || []}
        can_delete_tko={currentProcess?.can_delete_tko}
        handleDelete={(body) => {
          dispatch(
            deleteChangeSupplyTkoByUid(uid, body, () => {
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

export default TkosTab;
