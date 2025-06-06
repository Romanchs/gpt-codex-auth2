import { Divider } from '@material-ui/core';
import Box from '@mui/material/Box';
import CheckedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import UncheckedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { generalSettingsReport } from '../../../../actions/gtsActions';
import { DropDownInput } from '../../../../Forms/fields/DropDownInput';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { FIELDS_SIZE, REPORT_TYPE } from '../constants';
import moment from 'moment/moment';
import SelectField from '../../../Theme/Fields/SelectField';
import MultiSelect from '../../../Theme/Fields/MultiSelect';
import { useMultiselectStyles } from '../filterStyles';
import { useTranslation } from 'react-i18next';
import { LightTooltip } from '../../../Theme/Components/LightTooltip';
import { useLazySearchGTSReportByParamsQuery } from '../api';
import {
  setFieldsData,
  setSearchingData,
  settingsReportByProperties,
  setIsChangedFilterReportByParams
} from '../slice';
import { FIELD_TYPE, getPairByName } from '../utils';
import DateInput from './DateInput';
import AsyncMultiAutocomplete from '../../../Theme/Fields/AsyncMultiAutocomplete';

const ReportByParams = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const initError = useSelector((store) => store.gtsSlice.initError);
  const fieldSettings = useSelector((store) => store.gtsSlice.fieldSettings);
  const fieldsData = useSelector((store) => store.gtsSlice.fields);

  const paramsfilters = useSelector((store) => store.gtsSlice.filters);
  const reportSettings = useSelector((store) => store.gts.reportSettings);
  const filters = Object.keys(paramsfilters).length ? paramsfilters : reportSettings;

  const hasNonEmptyValueFilter = (filter) => {
    return Object.values(filter).some((field) => {
      if (field.type === 'MULTISELECT' || field.type === 'MUILTISEARCH') {
        return Array.isArray(field.value) && field.value.length > 0;
      }
      return field.value !== undefined && field.value !== null && field.value !== '';
    });
  };

  useEffect(() => {
    dispatch(setIsChangedFilterReportByParams(hasNonEmptyValueFilter(fieldsData)));
  });

  useEffect(() => {
    dispatch(generalSettingsReport(REPORT_TYPE.BY_PARAMS));
  }, [dispatch]);

  useEffect(() => {
    if (!filters.point_type && !filters.point_species) return;
    dispatch(
      settingsReportByProperties({
        type: REPORT_TYPE.BY_PARAMS,
        params: {
          point_species: filters.point_species || '',
          point_type: filters.point_type || 'InstallationAccountingPoint'
        }
      })
    );
  }, [dispatch, filters.point_type, filters.point_species]);

  return (
    <div className={'boxShadow'} style={{ padding: 16, paddingBottom: 8, marginBottom: 16, marginTop: 8 }}>
      <Typography variant={'h2'} color={'textPrimary'} style={{ marginBottom: 12 }}>
        {t('GTS_REPORT_BY_PARAMS')}:
      </Typography>
      <Divider style={{ marginBottom: 8 }} />
      <Grid container spacing={2} style={{ paddingTop: 12, paddingBottom: 12 }}>
        {fieldSettings.map(
          ({
            key: name,
            values: options,
            default: defaultValue,
            type,
            api_path: apiPath,
            label,
            label_en,
            related_key
          }) => (
            <Grid
              item
              xs={FIELDS_SIZE?.[name]?.xs || 12}
              sm={FIELDS_SIZE?.[name]?.sm || 6}
              md={FIELDS_SIZE?.[name]?.md || 3}
              key={name}
            >
              <Fields
                type={type}
                name={name}
                defaultValue={defaultValue}
                options={options}
                label={i18n.language === 'en' ? label_en : label}
                apiPath={apiPath}
                error={initError?.[name]}
                related_key={related_key}
              />
            </Grid>
          )
        )}
      </Grid>
    </div>
  );
};

export default ReportByParams;

// const getStatusIcon = (isSearch, isFound, isError) =>
//   (isSearch || isFound || isError) && (
//     <InputAdornment position="end">
//       {isSearch && <AutorenewIcon className={'rotating'} />}
//       {isFound && <CheckCircleRoundedIcon style={{ color: '#388e3c' }} />}
//       {isError && <ErrorOutlinedIcon style={{ color: '#f44336' }} />}
//     </InputAdornment>
//   );

const Fields = ({ type, label, name, defaultValue, options, apiPath, error, related_key }) => {
  const { i18n } = useTranslation();
  return (
    <>
      {(type === 'text' || type === 'int' || type === 'float') && (
        <Input name={name} label={label} int={type === 'int'} float={type === 'float'} error={error} />
      )}
      {type === 'pair_all' && (
        <InputAll name={name} label={label} int={name?.startsWith('metering_point_amount')} error={error} />
      )}
      {type === 'select' && (
        <SelectInput
          name={name}
          label={label}
          defaultValue={defaultValue}
          options={options.map((option) => ({
            value: option.value,
            label: i18n.language === 'en' ? option.value : option.label
          }))}
          disabled={!options}
          error={error}
        />
      )}
      {type === 'multiselect' && (
        <MultiSelectInput
          name={name}
          label={label}
          defaultValue={[defaultValue]}
          options={options.map((option) => ({
            value: option.value,
            label: i18n.language === 'en' ? option.value : option.label
          }))}
          disabled={!options}
          error={error}
        />
      )}
      {type === 'datetime' && <DateInnerInput name={name} label={label} error={error} />}
      {type === 'search' && <SearchInput label={label} name={name} apiPath={apiPath} error={error} />}
      {type === 'multi_search' && (
        <MultiplySearchInput related_key={related_key} label={label} name={name} apiPath={apiPath} error={error} />
      )}
    </>
  );
};

const InputAll = ({ label, name, int, error }) => {
  const dispatch = useDispatch();
  const searching = useSelector((store) => store.gtsSlice.searching);
  const pairs = useSelector((store) => store.gtsSlice.pairs);
  const value = useSelector((store) => store.gtsSlice.fields[name]?.value);

  const handleClick = () => {
    const checked = value === 'Всі' ? '' : 'Всі';
    const pairField = pairs[name];
    dispatch(
      setFieldsData({
        [name]: { type: FIELD_TYPE.INPUTALL, value: checked },
        [pairField]: { type: FIELD_TYPE.INPUTALL, value: checked }
      })
    );
  };

  const handleOnChange = ({ target: { value: v } }) => {
    const pairData = { [name]: { type: FIELD_TYPE.INPUTALL, value: v } };
    if (value === 'Всі') {
      pairData[name].value = v = '';
      pairData[pairs[name]] = { type: FIELD_TYPE.INPUTALL, value: '' };
    }
    if ((v && int && !/^\d+$/.test(v)) || (v && !int && (!/^[0-9]*\.?[0-9]*$/.test(v) || Number(v) > 999999))) {
      return;
    }
    dispatch(setFieldsData(pairData));
  };

  return (
    <Box
      sx={{
        position: 'relative',
        '& .MuiFormLabel-root.MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
          maxWidth: 'calc(100% - 35px)'
        }
      }}
    >
      <StyledInput label={label} value={value} onChange={handleOnChange} disabled={searching.loading} error={error} />
      <LightTooltip title={'Обрати всі'} arrow disableTouchListener disableFocusListener>
        <Box
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            height: '22px',
            zIndex: 1,
            '&>svg': {
              cursor: 'pointer',
              fontSize: '22px'
            }
          }}
        >
          {value === 'Всі' ? (
            <CheckedIcon onClick={handleClick} sx={{ color: '#F28C60' }} />
          ) : (
            <UncheckedIcon onClick={handleClick} sx={{ color: '#4A5B7A' }} />
          )}
        </Box>
      </LightTooltip>
    </Box>
  );
};

const Input = ({ label, name, int, float, error }) => {
  const dispatch = useDispatch();
  const searching = useSelector((store) => store.gtsSlice.searching);
  const value = useSelector((store) => store.gtsSlice.fields[name]?.value);

  const handleOnChange = ({ target: { value } }) => {
    if (!value) {
      dispatch(setFieldsData({ [name]: { type: FIELD_TYPE.INPUT, value } }));
      return;
    }
    if (
      (value && int && !/^\d+$/.test(value)) ||
      (value && float && (!/^[0-9]*\.?[0-9]*$/.test(value) || Number(value) > 999999))
    ) {
      return;
    }
    dispatch(setFieldsData({ [name]: { type: FIELD_TYPE.INPUT, value } }));
  };

  return (
    <StyledInput label={label} value={value} onChange={handleOnChange} disabled={searching.loading} error={error} />
  );
};

const SearchInput = ({ label, name, apiPath, error }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const searching = useSelector((store) => store.gtsSlice.searching);
  const pairs = useSelector((store) => store.gtsSlice.pairs);
  const value = useSelector((store) => store.gtsSlice.fields[name]?.value);

  const ref = useRef();
  const [getSearch, { currentData, isFetching }] = useLazySearchGTSReportByParamsQuery();

  const renderListItem = (item, index, list, onSelect) => {
    return (
      <div className={'supplier-list--item'} key={`supplier-search-${index}`} onClick={() => onSelect(item)}>
        {item.option}
      </div>
    );
  };

  const updatePairData = (item, value) => {
    const pairData = getPairByName(pairs, name, item);
    for (const k in pairData) pairData[k] = { type: FIELD_TYPE.SEARCH, value: pairData[k] };
    dispatch(setFieldsData(pairData));
    dispatch(setSearchingData({ field: name, value, loading: false }));
  };

  const handleInputChange =
    (name) =>
    ({ target: { value } }) => {
      updatePairData({}, value);
      clearTimeout(ref.current);

      if (value.length >= 3) {
        dispatch(setSearchingData({ field: name, value, loading: true }));
        ref.current = setTimeout(() => {
          getSearch({ apiPath, name, value });
        }, 1000);
      }
    };

  const handleSelect = (item) => updatePairData(item, '');

  return (
    <DropDownInput
      label={label}
      value={(searching.field === name && searching.value) || value}
      error={error}
      onChange={handleInputChange(name)}
      open={searching.field === name && searching.loading}
      list={currentData}
      listItem={renderListItem}
      onSelect={handleSelect}
      isFetching={isFetching}
      controlledFetching
      emptyMessage={t('NO_DATA_FOUND_BY_PARAMS')}
      // disabled={isFetching}
    />
  );
};

const SelectInput = ({ label, name, defaultValue, options, error }) => {
  const dispatch = useDispatch();
  const searching = useSelector((store) => store.gtsSlice.searching);
  const value = useSelector((store) => store.gtsSlice.fields[name]?.value);

  const handleOnChange = (value) => {
    dispatch(setFieldsData({ [name]: { type: FIELD_TYPE.SELECT, value } }));
  };

  return (
    <SelectField
      label={label}
      value={value || defaultValue}
      data={options || []}
      onChange={handleOnChange}
      disabled={searching.loading}
      error={error}
      ignoreI18
    />
  );
};

const MultiSelectInput = ({ label, name, options, error }) => {
  const dispatch = useDispatch();
  const searching = useSelector((store) => store.gtsSlice.searching);
  const classes = useMultiselectStyles();
  const value = useSelector((store) => store.gtsSlice.fields[name]?.value);

  const handleOnChange = (data) => {
    dispatch(setFieldsData({ [name]: { type: FIELD_TYPE.MULTISELECT, value: data } }));
  };

  return (
    <MultiSelect
      className={classes.multiselect}
      label={label}
      value={value || []}
      list={options || []}
      disabled={searching.loading}
      onChange={handleOnChange}
      error={error}
      ignoreI18
    />
  );
};

const DateInnerInput = ({ name, label, error }) => {
  const dispatch = useDispatch();

  const handleOnChange = (value) => {
    dispatch(setFieldsData({ [name]: { type: FIELD_TYPE.DATE, value: value || '' } }));
  };

  const handleChangeAll = (isChecked) => {
    dispatch(setFieldsData({ [name]: { type: FIELD_TYPE.DATE, value: isChecked ? null : '' } }));
  };

  return (
    <DateInput
      label={label || ''}
      onInput={handleOnChange}
      onChecked={handleChangeAll}
      minDate={moment('2019-07-01')}
      error={error}
      dataMarker={name}
    />
  );
};

const MultiplySearchInput = ({ label, name, error, apiPath, related_key }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const pairs = useSelector((store) => store.gtsSlice.pairs);
  const value = useSelector((store) => store.gtsSlice.fields[name]?.value);

  const getPairByName = (pairs, name, item) => {
    const secondParam = pairs[name] || name;
    if (Array.isArray(item)) {
      return {
        [secondParam]: item.map((i) => ({
          label: i.label,
          value: i.value
        })),
        [name]: item.map((i) => ({
          label: i.label,
          value: i.value
        }))
      };
    }
  };

  const handleChange = (selectedValues) => {
    let filteredValues = selectedValues;
    const lastSelected = selectedValues[selectedValues.length - 1];
    if (lastSelected && lastSelected.value === 'null' && lastSelected.label === t('ALL')) {
      filteredValues = [lastSelected];
    } else {
      filteredValues = selectedValues.filter((item) => !(item.value === 'null' && item.label === t('ALL')));
    }
    const pairData = getPairByName(pairs, name, filteredValues || []);
    for (const k in pairData) pairData[k] = { type: FIELD_TYPE.MUILTISEARCH, value: pairData[k], related_key };
    dispatch(setFieldsData(pairData));
    dispatch(setSearchingData({ field: name, value: filteredValues, loading: false }));
  };

  const labelSelectedOptions = (option) => {
    const parts = option.label?.split(':') || [];
    if (parts.length > 1) {
      return name.endsWith('__name') ? parts[0].split('|')[0] : parts[1];
    }
    return option.label;
  };

  return (
    <>
      <AsyncMultiAutocomplete
        label={label}
        name={name}
        value={value ?? []}
        onSelect={handleChange}
        error={error}
        apiPath={'searchMultiReportByParams'}
        searchBy={'value'}
        dataMarker={name}
        searchStart={3}
        disablePortal={false}
        freeSolo={false}
        isOptionEqualToValue={(o, v) => o.value === v.value}
        searchParams={{ apiPath, name }}
        filterOptions={(items) => {
          return items;
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            return (
              <Chip
                key={index}
                label={labelSelectedOptions(option)}
                size="small"
                {...getTagProps({ index })}
                style={{
                  height: '17px',
                  margin: '1px 0 0 0 !important'
                }}
              />
            );
          })
        }
      />
    </>
  );
};
