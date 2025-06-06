import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Page from '../../Components/Global/Page';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../Components/Theme/Components/Statuses';
import { Box, styled } from '@mui/material';
import Grid from '@mui/material/Grid';
import DatePicker from '../../Components/Theme/Fields/DatePicker';
import SelectField from '../../Components/Theme/Fields/SelectField';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import {
  useReportGrexelDefaultDataQuery,
  useReportGrexelFormMutation,
  useReportGrexelInfoQuery,
  useReportGrexelPublishMutation
} from './api';
import Table from './Table';
import MultiSelect from '../../Components/Theme/Fields/MultiSelect';

const StyledMultiSelect = styled(MultiSelect)({
  '& .MuiInputBase-input': {
    height: 20.5,
    color: '#4A5B7A'
  },
  '& .MuiFormLabel-root': {
    top: 1.4,
    color: '#A9B9C6',
    fontSize: 14,
    fontWeight: 400,
    opacity: 0.9
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '1px solid #D1EDF3 !important'
    },
    '&.Mui-disabled': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e9edf6 !important'
      },
      '& .MuiInputBase-input': {
        '-webkit-text-fill-color': '#808ca1',
        color: '#808ca1'
      }
    }
  },
  '& .MuiFormLabel-root.Mui-disabled': {
    color: '#B0BEC5 !important'
  }
});

const defaultFormData = {
  valid_to_by_change: null,
  valid_to_on_date: null,
  customer_type: [],
  fuel: [],
  generation: [],
  type_of_accounting_point: []
};

export const REPORT_GREXEL_ACCEPT_ROLES = ['АКО_Процеси'];

const aguGenerationsConditionOption = {
  F01000000: ['T010000', 'T010100', 'T010101', 'T010102', 'T010103', 'T010200'],
  F01050100: ['T020000', 'T020001', 'T020002']
};

const ReportGrexel = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const isInit = uid === 'init';
  const navigate = useNavigate();
  const { data: defaultData, isFetching } = useReportGrexelDefaultDataQuery(null, {
    refetchOnMountOrArgChange: true
  });
  const { data, isFetching: isFetchingInfo, refetch } = useReportGrexelInfoQuery(uid, {
    skip: isInit
  });
  const [onForm, { isLoading, reset }] = useReportGrexelFormMutation();
  const [onPublish, { isLoading: isPublishLoading }] = useReportGrexelPublishMutation()

  const [formData, setFormData] = useState(defaultFormData);
  const [form, setForm] = useState(null);

  const disabledForm = useMemo(() => {
    if (!moment(form?.valid_to_on_date).isValid() || moment(form?.valid_to_on_date).isAfter(moment())) {
      return true;
    }
    if (
      !form?.type_of_accounting_point ||
      !form?.fuel?.length ||
      !form?.generation?.length ||
      (form?.type_of_accounting_point === 'Combined' && !form?.active_consumer && !form?.aggr_gen_units)
    ) {
      return true;
    }
    if (form?.customer_type === undefined) {
      return true;
    }
    return (
      !moment(form?.valid_to_by_change).isValid() ||
      moment(form?.valid_to_by_change).isSameOrBefore(form?.valid_to_on_date)
    );
  }, [form]);

  useEffect(() => {
    if (defaultData) {
      setFormData(defaultData);
      if (isInit) {
        setForm(
          Object.fromEntries(
            Object.entries(defaultData)
              .map(([key, value]) => [
                key,
                Array.isArray(value) ? (key === 'generation' || key === 'fuel' ? null : value[0]?.value) : value
              ])
              .filter(
                ([key]) =>
                  !['active_consumer', 'aggr_gen_units', 'type_of_accounting_point', 'customer_type'].includes(key)
              )
          )
        );
      }
      if (!isInit && data) {
        setForm(
          Object.fromEntries(
            Object.keys(defaultData).map((key) => {
              if (key === 'generation' || key === 'fuel') {
                return [key, formData?.[key]?.filter((el) => Array.isArray(data[key]) && data[key].includes(el.value))];
              }
              return [key, data[key]];
            })
          )
        );
      }
    } else {
      setFormData(defaultFormData);
    }
  }, [defaultData, isInit, data, formData]);

  const handleOnChange = (name) => (value) => {
    const newValue = value === 'null' ? null : value;
    if (name === 'type_of_accounting_point') {
      const updatedForm = {
        ...form,
        type_of_accounting_point: newValue,
        fuel: [],
        generation: []
      };
      if (value === 'Production') {
        delete updatedForm['active_consumer'];
        delete updatedForm['aggr_gen_units'];
      }
      setForm(updatedForm);
      return;
    }
    if (name === 'fuel') {
      const updatedForm = {
        ...form,
        fuel: newValue,
        generation: []
      };
      setForm(updatedForm);
      return;
    }
    if (name === 'active_consumer') {
      const updatedForm = {
        ...form,
        active_consumer: newValue,
        aggr_gen_units: null,
        generation: [],
        fuel: []
      };
      setForm(updatedForm);
      return;
    }
    if (name === 'aggr_gen_units') {
      const updatedForm = {
        ...form,
        aggr_gen_units: newValue,
        generation: [],
        fuel: []
      };
      setForm(updatedForm);
      return;
    }
    setForm({ ...form, [name]: value === 'null' ? null : value });
  };

  const handleForm = () => {
    const requestData = {
      ...form,
      fuel: form.fuel.map((item) => item.value),
      generation: form.generation.map((item) => item.value)
    };
    onForm(requestData).then((res) => {
      if (res?.data?.uid) navigate(`/processes/report-grexel/${res.data.uid}`);
      reset();
    });
  };

  const handlePublish = () => {
    onPublish(uid).then(() => {
      refetch()
    });
  };

  const isMultiselectDisabled = useMemo(() => {
    if (!form?.type_of_accounting_point) return true;
    if (form.type_of_accounting_point === 'Combined') {
      return !form.aggr_gen_units;
    }
    return false;
  }, [form]);

  const filteredData = useMemo(() => {
    if (
      form?.type_of_accounting_point === 'Combined' &&
      form?.aggr_gen_units === 'так' &&
      form?.active_consumer === 'так'
    ) {
      const fuelOption = formData?.fuel?.filter((el) => ['F01000000', 'F01050100'].includes(el.value));
      const generationOptions = form?.fuel?.flatMap(({ value }) =>
        formData?.generation?.filter(({ value: genVal }) => aguGenerationsConditionOption[value].includes(genVal))
      );
      return { filteredFuel: fuelOption, filteredGeneration: generationOptions };
    }
    return { filteredFuel: formData?.fuel, filteredGeneration: formData?.generation };
  }, [form, formData]);

  return (
    <Page
      pageName={isInit ? t('SUBPROCESSES.REPORT_GREXEL') : t('PAGES.REPORT_GREXEL_BY_ID', { id: data?.id })}
      backRoute={'/processes'}
      acceptPermisions={isInit ? 'PROCESSES.REPORT_GREXEL.INITIALIZATION' : 'PROCESSES.REPORT_GREXEL.ACCESS'}
      acceptRoles={REPORT_GREXEL_ACCEPT_ROLES}
      faqKey={'PROCESSES__REPORT_GREXEL'}
      loading={isFetching || isLoading || isPublishLoading || isFetchingInfo}
      controls={
        <>
          {isInit && (
            <CircleButton type={'new'} title={t('CONTROLS.FORM')} onClick={handleForm} disabled={disabledForm} />
          )}
          {data?.can_publish && (
            <CircleButton type={'send'} title={t('CONTROLS.FINALIZE_AND_PUBLISH_REPORT')} onClick={handlePublish} disabled={disabledForm} />
          )}
        </>
      }
    >
      <Statuses statuses={['NEW', 'FORMED', 'DONE', 'COMPLETED']} currentStatus={isInit ? 'NEW' : data?.status} />
      <Box className={'boxShadow'} sx={{ p: 3, mt: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems={'flex-start'}>
          <Grid item xs={12} md={4} lg={3}>
            <DatePicker
              label={t('FIELDS.CUT_DATE')}
              clearable
              value={form?.valid_to_on_date}
              onChange={handleOnChange('valid_to_on_date')}
              disabled={!isInit}
              maxDate={moment()}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <DatePicker
              label={t('FIELDS.DATE_FOR_COMPARISON')}
              clearable
              value={form?.valid_to_by_change}
              onChange={handleOnChange('valid_to_by_change')}
              disabled={!isInit}
              maxDate={moment()}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <SelectField
              label={t('FIELDS.CUSTOMER_TYPE')}
              data={[{ value: 'null', label: t('ALL') }, ...formData.customer_type]}
              value={typeof form?.customer_type === typeof null ? 'null' : form?.customer_type}
              onChange={handleOnChange('customer_type')}
              disabled={!isInit}
              ignoreI18
              dataMarker={'customer_type'}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <SelectField
              label={t('PLATFORM.TYPE_OF_SITE')}
              data={formData.type_of_accounting_point}
              value={form?.type_of_accounting_point}
              onChange={handleOnChange('type_of_accounting_point')}
              disabled={!isInit}
              ignoreI18
              dataMarker={'type_of_accounting_point'}
            />
          </Grid>
          {form?.type_of_accounting_point === 'Combined' && (
            <>
              <Grid item xs={12} md={4} lg={3}>
                <SelectField
                  label={t('CHARACTERISTICS.ACTIVE_CONSUMER')}
                  data={formData.active_consumer}
                  value={form?.active_consumer}
                  onChange={handleOnChange('active_consumer')}
                  disabled={!isInit}
                  ignoreI18
                  dataMarker={'active_consumer'}
                />
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <SelectField
                  label={t('FIELDS.AGGREGATED_GENERATION_UNITS_PUP')}
                  data={
                    form?.active_consumer === 'ні'
                      ? [
                          {
                            label: 'Ні',
                            value: 'ні'
                          }
                        ]
                      : formData?.aggr_gen_units
                  }
                  value={form?.aggr_gen_units}
                  onChange={handleOnChange('aggr_gen_units')}
                  disabled={!isInit || !form?.active_consumer}
                  ignoreI18
                  dataMarker={'aggr_gen_units'}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} md={4} lg={3}>
            <StyledMultiSelect
              label={t('CHARACTERISTICS.FUEL_TYPE')}
              list={filteredData.filteredFuel}
              value={form?.fuel ?? []}
              onChange={handleOnChange('fuel')}
              disabled={!isInit || isMultiselectDisabled}
              popoverHeight={400}
              ignoreI18
              dataMarker={'fuel'}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <StyledMultiSelect
              label={t('CHARACTERISTICS.GENERATION_TYPE')}
              list={filteredData.filteredGeneration}
              value={form?.generation ?? []}
              onChange={handleOnChange('generation')}
              disabled={!isInit || isMultiselectDisabled || !form?.fuel?.length}
              popoverHeight={400}
              ignoreI18
              dataMarker={'generation'}
            />
          </Grid>
        </Grid>
      </Box>
      {!isInit && <Table />}
    </Page>
  );
};
export default ReportGrexel;
