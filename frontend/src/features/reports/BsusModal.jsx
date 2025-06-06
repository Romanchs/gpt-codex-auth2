import { DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { BlueButton } from '../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../Components/Theme/Buttons/GreenButton';
import { ReportDatePickerField } from './components/ReportDatePickerField';
import { StyledDialog } from './ReportsModal';
import { ReportSelectField } from './components/ReportSelectField';
import { useSelector } from 'react-redux';
import { useBsusCompaniesQuery } from './api';

const BSUS_TYPES = [
  {
    value: 'agg_gen_units',
    label: 'FIELDS.AGG_GEN_UNITS'
  },
  {
    value: 'non_agg_gen_units',
    label: 'FIELDS.NON_AGG_GEN_UNITS'
  }
];

export const BsusModal = ({
  title,
  openModal,
  setOpenModal,
  handleSubmit,
  reportSettings: { code, params },
  error
}) => {
  const { t } = useTranslation();
  const { eic: myEic } = useSelector((store) => store.user.activeOrganization);
  const { data } = useBsusCompaniesQuery();
  const [innerError, setInnerError] = useState({});
  const [values, setValues] = useState({
    company: 'null',
    bsus_aggregation_type: BSUS_TYPES[0].value,
    bsus_eic: 'null'
  });

  useEffect(() => {
    if (params && !params.includes('company')) {
      setValues((prev) => ({ ...prev, company: myEic }));
    }
  }, [params]);

  useEffect(() => {
    const responseError = JSON.parse(JSON.stringify(error?.data?.detail || error?.data || {}));
    delete responseError.details;
    if (typeof responseError === 'object') setInnerError(responseError);
  }, [error]);

  const handleClose = () => {
    setOpenModal(false);
    setValues({});
    setInnerError({});
  };

  const handleInnerSubmit = () => {
    handleSubmit({
      code,
      params: Object.fromEntries(
        Object.entries(values)
          // .filter(([key]) => params.includes(key))
          .map(([key, value]) => [key, value === 'null' ? null : value])
      )
    });
  };

  const handleSetValue = (name, value) => {
    setValues(
      name === 'bsus_aggregation_type'
        ? { ...values, [name]: value, bsus_eic: 'null' }
        : {
            ...values,
            [name]: value
          }
    );
    setInnerError({ ...innerError, [name]: null });
  };

  const allCompanies = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  const unicCompanies = useMemo(() => {
    const array = [{ value: 'null', label: t('ALL') }];
    if (!params?.includes('company') || !allCompanies) return array;
    const companies = Object.values(
      allCompanies.reduce((acc, obj) => {
        acc[obj?.['104-1']] = obj;
        return acc;
      }, {})
    );
    return array.concat(companies.map((c) => ({ value: c['104-1'], label: c['104-11'] })));
  }, [allCompanies, params]);

  const bsus_eics = useMemo(() => {
    const array = [{ value: 'null', label: t('ALL') }];
    if (allCompanies.length === 0 || values.company === 'null') return array;
    const bsus = allCompanies.filter((company) => company['104-1'] === values.company);
    return array.concat(bsus.map((c) => ({ value: c?.['106-80'], label: c?.['106-80'] })));
  }, [allCompanies, values.company]);

  return (
    <StyledDialog open={openModal} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          '& svg': {
            fontSize: 19
          }
        }}
        data-marker={'close-dialog'}
      >
        <CloseRounded />
      </IconButton>
      <DialogContent>
        <Stack spacing={2} sx={{ maxWidth: '480px' }}>
          {params?.includes('on_date') && (
            <ReportDatePickerField
              id={'on_date'}
              label={t('FIELDS.CUT_DATE')}
              values={values}
              onChange={handleSetValue}
              innerError={innerError}
              outFormat={'yyyy-MM-DD'}
              dataMarker={'on_date'}
            />
          )}
          {params?.includes('company') && (
            <ReportSelectField
              id={'company'}
              label={t('FIELDS.SUPPLIER_NAME')}
              data={unicCompanies}
              values={values}
              onChange={handleSetValue}
              innerError={innerError}
              dataMarker={'company'}
              withAll={false}
              ignoreI18
            />
          )}
          {params?.includes('bsus_aggregation_type') && (
            <ReportSelectField
              id={'bsus_aggregation_type'}
              label={t('CHARACTERISTICS.ACTIVE_CONSUMER')}
              data={BSUS_TYPES}
              values={values}
              withAll={false}
              onChange={handleSetValue}
              innerError={innerError}
              dataMarker={'bsus_aggregation_type'}
            />
          )}
          {params?.includes('bsus_eic') && values?.bsus_aggregation_type === 'agg_gen_units' && (
            <ReportSelectField
              id={'bsus_eic'}
              label={t('FIELDS.BSUS_EIC')}
              data={bsus_eics}
              values={values}
              onChange={handleSetValue}
              innerError={innerError}
              dataMarker={'bsus_eic'}
              withAll={false}
              ignoreI18
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          paddingTop: '0 !important',
          px: 3,
          '&>button': {
            minWidth: 204,
            textTransform: 'uppercase',
            fontSize: 12
          }
        }}
      >
        <BlueButton onClick={handleClose}>{t('CONTROLS.CANCEL')}</BlueButton>
        <GreenButton onClick={handleInnerSubmit} disabled={!values?.on_date}>
          {t('CONTROLS.FORM')}
        </GreenButton>
      </DialogActions>
    </StyledDialog>
  );
};
