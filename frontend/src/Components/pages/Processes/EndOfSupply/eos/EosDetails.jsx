import { Box, Grid } from '@mui/material';
import React from 'react';
import StyledInput from '../../../../Theme/Fields/StyledInput';
import DelegateInput from '../../../../../features/delegate/delegateInput';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { InintTable } from './InitTable';
import { ApsTable } from './ApsTable';
import { useEndOfSupplyQuery } from '../api';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const EosDetails = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const { params } = useSelector((store) => store.endOfSupply);
  const { data, isFetching } = useEndOfSupplyQuery({ uid, params });

  return (
    <>
      <Box className={'boxShadow'} sx={{ p: 3, my: 2 }}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} lg={6}>
            <StyledInput label={t('FIELDS.SUPPLIER_NAME')} disabled value={data?.initiator_company?.full_name} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.EIC_CODE_INITIATOR')} disabled value={data?.initiator_company?.eic} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.COMPANY_USREOU')} disabled value={data?.initiator_company?.usreou} />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              disabled
              value={data?.initiator?.username}
              data={data?.delegation_history || []}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={t('FIELDS.END_OF_SUPPLY_DATE')}
              disabled
              value={data?.must_be_finished_at && moment(data?.must_be_finished_at).format('DD.MM.yyyy')}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_DATETIME')}
              disabled
              value={data?.created_at && moment(data?.created_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <StyledInput label={t('FIELDS.UPLOADED_APS_COUNT')} disabled value={data?.move_to_slr_aps_amount} />
          </Grid>
        </Grid>
      </Box>
      {data?.status === 'IN_PROCESS' ? <InintTable data={data} loading={isFetching} /> : <ApsTable />}
    </>
  );
};
