import { Grid } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getReceivingDkoHistorical } from '../../../../actions/processesActions';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { Pagination } from '../../../Theme/Table/Pagination';
import TabActualTkos from '../RecievingDkoActual/TabActualTkos';
import { useTranslation } from 'react-i18next';

const DetailsTab = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { currentProcess, loading } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });

  // Check roles & get data
  useEffect(() => {
    dispatch(getReceivingDkoHistorical(uid, params));
  }, [dispatch, uid, params]);

  return (
    <>
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} readOnly value={currentProcess?.initiator} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              readOnly
              value={currentProcess?.created_at ? moment(currentProcess?.created_at).format('DD.MM.yyyy • HH:mm') : ''}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.FORMED_AT')}
              readOnly
              value={currentProcess?.formed_at ? moment(currentProcess?.formed_at).format('DD.MM.yyyy • HH:mm') : ''}
            />
          </Grid>

          {!currentProcess?.canceled_at && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.COMPLETE_DATETIME')}
                readOnly
                value={
                  currentProcess?.status === 'DONE' && currentProcess?.completed_at
                    ? moment(currentProcess?.completed_at).format('DD.MM.yyyy • HH:mm')
                    : ''
                }
              />
            </Grid>
          )}

          {currentProcess?.canceled_at && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput
                label={t('FIELDS.CANCELED_AT')}
                readOnly
                value={
                  currentProcess?.canceled_at ? moment(currentProcess?.canceled_at).format('DD.MM.yyyy • HH:mm') : ''
                }
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY')}
              readOnly
              value={currentProcess?.initiator_company?.short_name}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.INFORMATION_START_DATE')}
              readOnly
              value={
                currentProcess?.start_dko_data
                  ? moment(currentProcess?.start_dko_data).format('DD.MM.yyyy HH:mm:ss')
                  : ''
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.INFORMATION_END_DATE')}
              readOnly
              value={
                currentProcess?.end_dko_data ? moment(currentProcess?.end_dko_data).format('DD.MM.yyyy HH:mm:ss') : ''
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.DATE_OF_ANSWER')}
              readOnly
              value={
                currentProcess?.must_be_finished_at
                  ? moment(currentProcess?.must_be_finished_at).format('DD.MM.yyyy')
                  : ''
              }
            />
          </Grid>
        </Grid>
      </div>
      <TabActualTkos data={currentProcess?.tkos?.data || []} />
      <Pagination
        loading={loading}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
        {...currentProcess?.tkos}
      />
    </>
  );
};

export default DetailsTab;
