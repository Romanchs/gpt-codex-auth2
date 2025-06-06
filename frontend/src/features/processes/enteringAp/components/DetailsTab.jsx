import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import { useDetailsEnteringApQuery } from '../api';
import InnerDataTable from './InnerDataTable';
import DelegateInput from '../../../delegate/delegateInput';
import i18n from '../../../../i18n/i18n';
import { useTranslation } from 'react-i18next';

const renderHead = (item) => <Box component="p">{item.label}</Box>;
const columns = [
  { id: 'eic', label: i18n.t('FIELDS.EIC_CODE'), minWidth: 150, renderHead },
  { id: 'valid_from', label: i18n.t('FIELDS.EFFECTIVE_DATE'), minWidth: 200, renderHead },
  { id: 'connection_status', label: i18n.t('FIELDS.CONNECTION_STATUS'), minWidth: 200, renderHead },
  { id: 'customer', label: i18n.t('FIELDS.AP_CUSTOMER_CODE'), minWidth: 200, renderHead }
];

const DetailsTab = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { activeOrganization, full_name } = useSelector(({ user }) => user);
  const { currentData, isFetching } = useDetailsEnteringApQuery({ uid, params }, { skip: !uid });

  return (
    <>
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <DelegateInput
              label={t('FIELDS.USER_INITIATOR')}
              value={uid ? currentData?.initiator : full_name}
              data={currentData?.delegation_history || []}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.CREATED_AT')}
              value={currentData?.created_at && moment(currentData?.created_at).format('DD.MM.yyyy • HH:mm')}
              readOnly
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={
                currentData?.status.startsWith('CANCELED') ? t('FIELDS.CANCELED_AT') : t('FIELDS.COMPLETE_DATETIME')
              }
              value={currentData?.finished_at && moment(currentData?.finished_at).format('DD.MM.yyyy • HH:mm')}
              disabled
            />
          </Grid>
          {uid && (
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.UNIQUE_APS')} value={currentData?.successful} readOnly />
            </Grid>
          )}
          <Grid item xs={12}>
            <StyledInput
              label={t('FIELDS.INITIATOR_COMPANY_NAME')}
              value={uid ? currentData?.initiator_company : activeOrganization?.name}
              readOnly
            />
          </Grid>
        </Grid>
      </Box>
      {currentData?.aps && (
        <InnerDataTable
          columns={columns}
          currentData={currentData?.aps}
          loading={isFetching}
          params={params}
          setParams={setParams}
        />
      )}
    </>
  );
};

export default DetailsTab;
