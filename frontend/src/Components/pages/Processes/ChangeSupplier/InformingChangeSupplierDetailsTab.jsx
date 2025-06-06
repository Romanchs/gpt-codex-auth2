import { Grid } from '@mui/material';
import React from 'react';
import { checkPermissions } from '../../../../util/verifyRole';
import StyledInput from '../../../Theme/Fields/StyledInput';
import moment from 'moment';
import { TkosTable } from './TkosTable';
import { Pagination } from '../../../Theme/Table/Pagination';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { deleteChangeSupplyTkoByUid, getChangeSupplierTkos } from '../../../../actions/processesActions';
import { useParams } from 'react-router-dom';

const InformingChangeSupplierDetailsTab = ({params, setParams}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { uid } = useParams();
  const { loading, currentProcess } = useSelector(({ processes }) => processes);

  return (
    <div>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          {checkPermissions('PROCESSES.CHANGE_SUPPLIER.INFORMING_SUPPLIER.FIELDS.INITIATOR', 'АТКО') && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.USER_INITIATOR')}
                disabled
                value={currentProcess?.initiator?.username || ''}
              />
            </Grid>
          )}
          {checkPermissions('PROCESSES.CHANGE_SUPPLIER.INFORMING_SUPPLIER.FIELDS.EIC', 'АТКО') && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.EIC_X_INITIATOR')}
                disabled
                value={currentProcess?.initiator_company?.eic || ''}
              />
            </Grid>
          )}
          {checkPermissions('PROCESSES.CHANGE_SUPPLIER.INFORMING_SUPPLIER.FIELDS.USREOU', 'АТКО') && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.USREOU')}
                disabled
                value={currentProcess?.initiator_company?.usreou || ''}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              disabled
              value={currentProcess?.created_at && moment(currentProcess?.created_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CANCELED_AT')}
              disabled
              value={currentProcess?.canceled_at && moment(currentProcess?.canceled_at).format('DD.MM.yyyy')}
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
          {checkPermissions('PROCESSES.CHANGE_SUPPLIER.INFORMING_SUPPLIER.FIELDS.INITIATOR_COMPANY_NAME', 'АТКО') && (
            <Grid item xs={12} md={6}>
              <StyledInput
                label={t('FIELDS.NEW_INITIATOR_NAME')}
                disabled
                value={currentProcess?.initiator_company?.short_name || ''}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USER_EXECUTOR')} disabled value={currentProcess?.executor?.username || ''} />
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

export default InformingChangeSupplierDetailsTab;
