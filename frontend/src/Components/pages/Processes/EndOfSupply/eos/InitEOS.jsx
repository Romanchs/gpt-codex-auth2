import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../../../Global/Page';
import CircleButton from '../../../../Theme/Buttons/CircleButton';
import Statuses from '../../../../Theme/Components/Statuses';
import Grid from '@material-ui/core/Grid';
import StyledInput from '../../../../Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';
import { useCreateEndOfSupplyMutation } from '../api';
import moment from 'moment';
import DatePicker from '../../../../Theme/Fields/DatePicker';
import { Box } from '@mui/material';

const PERMISSION = 'PROCESSES.END_OF_SUPPLY.INITIALIZATION';

const InitEOS = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeOrganization, full_name } = useSelector(({ user }) => user);
  const [createEndOfSypply, { error, isLoading }] = useCreateEndOfSupplyMutation();
  const [mustBeFinishedAt, setMustBeFinishedAt] = useState(moment.utc(moment().add(21, 'days').startOf('day')).format());

  const handleStart = () => {
    createEndOfSypply({ must_be_finished_at: mustBeFinishedAt }).then((response) => {
      if (response.data && response.data.uid) {
        navigate(`/processes/end-of-supply/${response.data.uid}`);
      }
    });
  };

  return (
    <Page
      pageName={t('PAGES.END_OF_SUPPLY')}
      backRoute={'/processes'}
      acceptPermisions={PERMISSION}
      acceptRoles={['СВБ']}
      loading={isLoading}
      controls={<CircleButton type={'new'} title={t('CONTROLS.FORM')} onClick={handleStart} disabled={isLoading} />}
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED']} currentStatus={'NEW'} />
      <Box className={'boxShadow'} sx={{ p: 3, my: 2 }}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} lg={6}>
            <StyledInput
              label={t('FIELDS.SUPPLIER_NAME')}
              disabled
              value={activeOrganization?.name}
              error={error?.response?.data?.current_supplier}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.EIC_CODE_INITIATOR')} disabled value={activeOrganization?.eic} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.COMPANY_USREOU')} disabled value={activeOrganization?.usreou} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} disabled value={full_name} />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <DatePicker
              label={t('FIELDS.END_OF_SUPPLY_DATE')}
              value={mustBeFinishedAt}
              onChange={(date) => setMustBeFinishedAt(moment.utc(date).format())}
              minDate={moment().add(1, 'days')}
              minDateMessage={t('VERIFY_MSG.DATE_MUST_BE_GREATER_THAN_21_DAYS_FROM_CURRENT_DATE')}
            />
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
};

export default InitEOS;
