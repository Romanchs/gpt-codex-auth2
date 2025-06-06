import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import moment from 'moment/moment';
import { VersionsByPeriodReport } from './VersionsByPeriodReport';

const MultyPairInput = ({ id, onChange, value, allValues, innerError }) => {
  const { t } = useTranslation();
  const [addValues, setAddValues] = useState({ value1: '', value2: '' });

  const handleChangeAddValues = (name, value) => {
    setAddValues({ ...addValues, [name]: value });
  };

  const clearAddValues = () => {
    setAddValues({ value1: '', value2: '' });
  };

  const handleAdd = () => {
    onChange(id, [...(value ?? []), addValues]);
    clearAddValues();
  };

  const handleDelete = (index) => {
    onChange(
      id,
      value.filter((_, i) => i !== index)
    );
  };

  const sortObject = (data) => {
    return data?.map((item) => sortFunction(item));
  };

  const sortFunction = (item) => {
    const values = Object.values(item).sort((a, b) => a.localeCompare(b));
    return Object.fromEntries(
      Object.keys(item).map((key, index) => [key, values[index]])
    );
  };

  const handleChange = (index, field, newValue) => {
    const updatedValue = [...value];
    updatedValue[index] = {
      ...updatedValue[index],
      [field]: newValue
    };
    onChange(id, updatedValue);
  };

  const isAddPairError = useMemo(() => {
    return sortObject(value)?.some((v) => v.value1 === sortFunction(addValues).value1 && v.value2 === sortFunction(addValues).value2);
  }, [value, addValues]);

  const findDuplicatesOnce = () => {
    const normalize = ({ value1, value2 }) => `${value1},${value2}`;

    const counts = sortObject(value).reduce((acc, item) => {
      const key = normalize(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const seen = new Set();
    return sortObject(value).filter((item) => {
      const key = normalize(item);
      return counts[key] > 1 && !seen.has(key) && seen.add(key);
    });
  };

  useEffect(() => {
    onChange(id, undefined);
    setAddValues({ value1: '', value2: '' });
  }, [allValues?.year, allValues?.month]);

  const isMaxSize = value?.length >= 50;

  return (
    <Box>
      <Typography>Змінюйте порівнювані пари значень для відображення у звіті</Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <VersionsField
          label={t('FIELDS.NEW_PAIR', { value: 1 })}
          value={addValues.value1}
          customFilter={(el) => el.value !== addValues.value2}
          onChange={(value) => handleChangeAddValues('value1', value)}
          error={isAddPairError}
          ignoreI18
          allValues={allValues}
          innerError={innerError}
          isDisabled={isMaxSize}
        />
        <VersionsField
          label={t('FIELDS.NEW_PAIR', { value: 2 })}
          value={addValues.value2}
          customFilter={(el) => el.value !== addValues.value1}
          onChange={(value) => handleChangeAddValues('value2', value)}
          error={isAddPairError}
          ignoreI18
          allValues={allValues}
          innerError={innerError}
          isDisabled={isMaxSize}
        />
        <CircleButton
          type={'add'}
          title={t('CONTROLS.ADD')}
          onClick={handleAdd}
          disabled={!addValues.value1 || !addValues.value2 || isAddPairError || isMaxSize}
        />
      </Box>
      {isAddPairError && (
        <Typography sx={{ color: '#f44336', mt: 0.5 }}>{t('VERIFY_MSG.UNIQUE_PAIR_REQUIRED')}</Typography>
      )}
      {Boolean(value?.length) && (
        <>
          <Box
            sx={{
              mt: 2,
              p: 2,
              border: '1px solid #E5EAEE',
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxHeight: 250,
              overflowX: 'auto'
            }}
          >
            {[...value]
              .map((item, originalIdx) => ({ item, originalIdx }))
              .reverse()
              .map(({ item, originalIdx }, idx) => (
                <Box key={originalIdx} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <VersionsField
                    label={t('FIELDS.PAIR_VALUE', { pairNumber: value.length - idx, value: 1 })}
                    value={item.value1}
                    customFilter={(el) => el.value !== item.value2}
                    onChange={(newValue) => handleChange(originalIdx, 'value1', newValue)}
                    error={findDuplicatesOnce().some((v) => v.value1 === sortFunction(item).value1 && v.value2 === sortFunction(item).value2)}
                    ignoreI18
                    allValues={allValues}
                    innerError={innerError}
                  />
                  <VersionsField
                    label={t('FIELDS.PAIR_VALUE', { pairNumber: value.length - idx, value: 2 })}
                    value={item.value2}
                    customFilter={(el) => el.value !== item.value1}
                    onChange={(newValue) => handleChange(originalIdx, 'value2', newValue)}
                    error={findDuplicatesOnce().some((v) => v.value1 === sortFunction(item).value1 && v.value2 === sortFunction(item).value2)}
                    ignoreI18
                    allValues={allValues}
                    innerError={innerError}
                  />
                  <CircleButton
                    type={'delete'}
                    title={t('CONTROLS.DELETE')}
                    onClick={() => handleDelete(originalIdx)}
                    dataMarker={`delete-${originalIdx + 1}`}
                  />
                </Box>
              ))}
          </Box>
          {Boolean(findDuplicatesOnce().length) && (
            <Typography sx={{ color: '#f44336', mt: 0.5 }}>{t('VERIFY_MSG.ALL_PAIRS_MUST_BE_UNIQUE')}</Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default MultyPairInput;

const VersionsField = ({ label, allValues, value, onChange, innerError, customFilter, error, isDisabled }) => {
  return (
    <VersionsByPeriodReport
      label={label}
      onChange={onChange}
      value={value}
      error={error}
      customFilter={customFilter}
      isDisabled={isDisabled}
      from_date={
        allValues?.year &&
        allValues?.month &&
        moment({ year: allValues.year, month: allValues.month - 1 })
          .startOf('month')
          .format('YYYY-MM-DD')
      }
      to_date={
        allValues?.year &&
        allValues?.month &&
        moment({ year: allValues.year, month: allValues.month - 1 })
          .endOf('month')
          .format('YYYY-MM-DD')
      }
      datesError={{ from: innerError?.period_from, to: innerError?.period_to }}
    />
  );
};
