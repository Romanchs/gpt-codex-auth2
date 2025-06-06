import Page from '../../../Components/Global/Page';
import { useTranslation } from 'react-i18next';
import { Typography, Box, Grid } from '@mui/material';
import styles from './styles';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import { useEffect, useState } from 'react';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { useGetFrequencySettingsQuery, useUpdateFrequencySettingsMutation } from '../api';
import { selectValues } from './constants';

const ECustomerProcess = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({
    REPORTS_BY_BASIC_AP_INFO: null,
    REPORTS_BY_AP_CONSUMPTION_AND_GENERATION: null
  });

  const { data: frequencySettings, isFetching: isLoadingGetSettings } = useGetFrequencySettingsQuery();
  const [updateFrequencySettings, { isLoading: isLoadingUpdateSettings }] = useUpdateFrequencySettingsMutation();

  const isLoadingData = isLoadingGetSettings || isLoadingUpdateSettings;

  const handleSave = () => {
    updateFrequencySettings(data);
  };

  useEffect(() => {
    if (frequencySettings) {
      setData(frequencySettings);
    }
  }, [frequencySettings]);

  const isActualData = JSON.stringify(data) === JSON.stringify(frequencySettings);

  const handleChange = (id) => (value) => {
    const newData = { ...data, [id]: value };
    setData(newData);
  };
  return (
    <Page
      acceptPermisions={'TECH_WORK.ACCESS'}
      acceptRoles={['АКО_Процеси']}
      pageName={t('PAGES.E_CONSUMER_ADMINISTRATION')}
      backRoute={'/tech'}
      loading={isLoadingData}
    >
      <Box component={'section'} sx={styles.table}>
        <Typography component={'h4'} sx={styles.header}>
          {t('TECH_WORKS.PAGE.REPORT_FREQUENCY_SETTINGS')}
        </Typography>
        <Box sx={styles.body}>
          <Box sx={styles.saveButton}>
            <CircleButton
              type={'save'}
              title={t('CONTROLS.SAVE')}
              onClick={handleSave}
              disabled={isLoadingData || isActualData}
            />
          </Box>
          <Grid container alignItems={'center'} gap={2}>
            <Grid item xl={2} lg={3} md={4} sm={12} xs={12}>
              {t('TECH_WORKS.FIELDS.REPORTS_MAIN_INFO_TKO')}
            </Grid>
            <Grid item xl={2} lg={3} md={4} sm={12} xs={12}>
              <SelectField
                label={t('TECH_WORKS.FIELDS.FREQUENCY')}
                data={selectValues}
                onChange={handleChange('REPORTS_BY_BASIC_AP_INFO')}
                value={data.REPORTS_BY_BASIC_AP_INFO}
              />
            </Grid>
          </Grid>
          <Grid container alignItems={'center'} gap={2}>
            <Grid item xl={2} lg={3} md={4} sm={12} xs={12}>
              {t('TECH_WORKS.FIELDS.REPORTS_CONSUMPTION_GENERATION_TKO')}
            </Grid>
            <Grid item xl={2} lg={3} md={4} sm={12} xs={12}>
              <SelectField
                label={t('TECH_WORKS.FIELDS.FREQUENCY')}
                data={selectValues}
                onChange={handleChange('REPORTS_BY_AP_CONSUMPTION_AND_GENERATION')}
                value={data.REPORTS_BY_AP_CONSUMPTION_AND_GENERATION}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Page>
  );
};

export default ECustomerProcess;
