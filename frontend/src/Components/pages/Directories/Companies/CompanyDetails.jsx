import Page from '../../../Global/Page';
import { useCompanyDetailsQuery } from './api';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Grid, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Fragment } from 'react';

const GENERAL = [
  { item_label: 'COMPANY_DIRECTORY.GENERAL.EIC', key: 'eic' },
  { item_label: 'COMPANY_DIRECTORY.GENERAL.SHORT_NAME', key: 'short_name' },
  { item_label: 'COMPANY_DIRECTORY.GENERAL.USREOU', key: 'usreou' },
  { item_label: 'COMPANY_DIRECTORY.GENERAL.CONTRACT_START', key: 'contract_start', type: 'DATE' },
  {
    item_label: 'COMPANY_DIRECTORY.GENERAL.CONTRACT_STATUS',
    key: 'contract_status'
  },
  { item_label: 'COMPANY_DIRECTORY.GENERAL.CONTRACT_END', key: 'contract_end' },
  { item_label: 'COMPANY_DIRECTORY.GENERAL.FULL_NAME', key: 'full_name' }
];

const ACTIVITY = [
  { item_label: 'COMPANY_DIRECTORY.ACTIVITY.ACTIVITY_TYPE', key: 'activity_type' },
  { item_label: 'COMPANY_DIRECTORY.ACTIVITY.LICENSE_TYPE', key: 'license_type' },
  { item_label: 'COMPANY_DIRECTORY.ACTIVITY.ACTIVITY_START', key: 'activity_start', type: 'DATE' },
  { item_label: 'COMPANY_DIRECTORY.ACTIVITY.LICENSE_START', key: 'license_start', type: 'DATE' },
  { item_label: 'COMPANY_DIRECTORY.ACTIVITY.ACTIVITY_END', key: 'activity_end', type: 'DATE' },
  { item_label: 'COMPANY_DIRECTORY.ACTIVITY.LICENSE_END', key: 'license_end', type: 'DATE' },
  { item_label: 'COMPANY_DIRECTORY.ACTIVITY.ACTIVITY_STATUS', key: 'activity_status' }
];

const FINANCIAL_STATUS = [
  { item_label: 'COMPANY_DIRECTORY.FINANCIAL_STATUS.FINANCIAL_STATUS', key: 'financial_status' },
  { item_label: 'COMPANY_DIRECTORY.FINANCIAL_STATUS.STATE_NAME', key: 'state_name' },
  {
    item_label: 'COMPANY_DIRECTORY.FINANCIAL_STATUS.FINANCIAL_STATUS_START',
    key: 'financial_status_start',
    type: 'DATE'
  },
  { item_label: 'COMPANY_DIRECTORY.FINANCIAL_STATUS.STATE_START', key: 'state_start', type: 'DATE' },
  { item_label: 'COMPANY_DIRECTORY.FINANCIAL_STATUS.FINANCIAL_STATUS_END', key: 'financial_status_end', type: 'DATE' },
  { item_label: 'COMPANY_DIRECTORY.FINANCIAL_STATUS.STATE_END', key: 'state_end', type: 'DATE' },
  { item_label: 'COMPANY_DIRECTORY.FINANCIAL_STATUS.STATE_STATUS', key: 'state_status' }
];

const EIC_Y = [
  { item_label: 'COMPANY_DIRECTORY.EIC_Y.Y_EIC', key: 'y_eic' },
  { item_label: 'COMPANY_DIRECTORY.EIC_Y.Y_EIC_TRADE_ZONE', key: 'y_eic_trade_zone' }
];

const EIC_W = [
  { item_label: 'COMPANY_DIRECTORY.EIC_W.W_EIC', key: 'w_eic' },
  { item_label: 'COMPANY_DIRECTORY.EIC_W.W_EIC_START', key: 'w_eic_start', type: 'DATE' },
  { item_label: 'COMPANY_DIRECTORY.EIC_W.W_EIC_TRADE_ZONE', key: 'w_eic_trade_zone' },
  { item_label: 'COMPANY_DIRECTORY.EIC_W.W_EIC_END', key: 'w_eic_end', type: 'DATE' }
];

const CompanyDetails = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const { isFetching } = useCompanyDetailsQuery(uid);

  return (
    <Page
      pageName={t('PAGES.COMPANY_CHARACTERISTICS')}
      backRoute={'/directories/companies'}
      loading={isFetching}
      acceptPermisions={'DIRECTORIES.COMPANIES.ACCESS'}
      acceptRoles={['АКО', 'АКО_Процеси', 'АКО_Довідники', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Суперечки']}
    >
      <SimpleAccordion label={'COMPANY_DIRECTORY.GENERAL.TITLE'} items={GENERAL} dataKey={'general'} />
      <ActivityAccordion />
      <SimpleAccordion
        label={'COMPANY_DIRECTORY.FINANCIAL_STATUS.TITLE'}
        items={FINANCIAL_STATUS}
        dataKey={'financial_status'}
      />
      <SimpleAccordion label={'COMPANY_DIRECTORY.EIC_Y.TITLE'} items={EIC_Y} dataKey={'y_eic'} />
      <SimpleAccordion label={'COMPANY_DIRECTORY.EIC_W.TITLE'} items={EIC_W} dataKey={'w_eic'} />
    </Page>
  );
};

export default CompanyDetails;

const SimpleAccordion = ({ label, items, dataKey }) => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data } = useCompanyDetailsQuery(uid);

  const dataByKey = data?.[dataKey];

  const getData = (data, type) => {
    if (!data) {
      return '---';
    }
    return type === 'DATE' ? moment(data).format('DD.MM.YYYY') : data;
  };

  return (
    <Accordion>
      <AccordionSummary>{t(label)}</AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {items.map(({ item_label, key, type }) => (
            <Grid item xs={12} sm={6} key={key}>
              <Stack direction={'row'} spacing={3} alignItems={'flex-end'}>
                <Box sx={{ width: 200, color: '#A9B9C6' }}>{t(item_label)}</Box>
                <Box sx={{ color: '#567691' }}>{getData(dataByKey?.[key], type)}</Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Stack direction={'row'} justifyContent={'flex-end'}>
          <Button
            variant="contained"
            startIcon={<VisibilityRoundedIcon />}
            color={'blue'}
            sx={{ mt: 2 }}
            onClick={() => navigate(`/directories/companies/${uid}/history`, { state: { type: dataKey } })}
          >
            {t('CONTROLS.CHARACTERISTIC_CHANGES_HISTORY')}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

const ActivityAccordion = () => {
  const { uid } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data } = useCompanyDetailsQuery(uid);

  const activities = data?.activity || [];

  const getData = (data, type) => {
    if (!data) {
      return '---';
    }
    return type === 'DATE' ? moment(data).format('DD.MM.YYYY') : data;
  };

  return (
    <Accordion>
      <AccordionSummary>{t('COMPANY_DIRECTORY.ACTIVITY.TITLE')}</AccordionSummary>
      <AccordionDetails>
        {activities?.map((activity, index) => (
          <Fragment key={'activity-' + index}>
            <Grid container spacing={2}>
              {ACTIVITY.map(({ item_label, key, type }) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Stack direction={'row'} spacing={3}>
                    <Box sx={{ width: 200, color: '#A9B9C6' }}>{t(item_label)}</Box>
                    <Box sx={{ color: '#567691' }}>{getData(activity?.[key], type)}</Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
            {index < activities.length - 1 && <Divider sx={{ my: 2.5 }} />}
          </Fragment>
        ))}
        <Stack direction={'row'} justifyContent={'flex-end'}>
          <Button
            variant="contained"
            startIcon={<VisibilityRoundedIcon />}
            color={'blue'}
            sx={{ mt: 2 }}
            onClick={() => navigate(`/directories/companies/${uid}/history`, { state: { type: 'activity' } })}
          >
            {t('CONTROLS.CHARACTERISTIC_CHANGES_HISTORY')}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
