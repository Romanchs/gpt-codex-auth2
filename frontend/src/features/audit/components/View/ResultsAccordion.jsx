import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { onUpdateViewData, useAuditViewData } from '../../slice';
import { checkPermissions } from '../../../../util/verifyRole';
import { AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES } from '../../index';
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import React, { useMemo } from 'react';
import CircleButton from '../../../../Components/Theme/Buttons/CircleButton';
import { useUpdateAuditMutation } from '../../api';
import Typography from '@mui/material/Typography';

const ResultsAccordion = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data = useAuditViewData();
  const results = data?.results || {};
  const isCanceled = data?.status === 'CANCELED';
  const isEditable = !isCanceled && checkPermissions(AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES);

  const removeInfo = (name, index) => {
    const updatedValues = [...results[name].slice(0, index), ...results[name].slice(index + 1)];
    setUpdatedData(name, updatedValues);
  };

  const setUpdatedData = (name, values) => {
    const validValues = values.length === 0 || (values.length === 1 && values[0] === '') ? undefined : values;
    const updatedResults = { ...results, [name]: validValues };
    const nonEmptyResults = Object.fromEntries(Object.entries(updatedResults).filter((v) => v[1]));
    dispatch(onUpdateViewData({ ...data, results: Object.keys(nonEmptyResults).length > 0 ? nonEmptyResults : null }));
  };

  const handleInput = (name, index, value) => {
    const values = results?.[name] ? results?.[name]?.slice(0) : [];
    if (index === values.length) values.push(value);
    else values[index] = value;

    if (index === values.length - 2 && values.at(-2).length < 11 && values.at(-1).length === 0) values.pop();

    setUpdatedData(name, values);
  };

  return (
    <Accordion>
      <AccordionSummary>{t('AUDIT.RESULTS')}</AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <ViolationAccordion
          title={t('AUDIT.FIELDS.NON_ADMISSION')}
          results={results?.non_admission}
          type={'non_admission'}
          isEditable={isEditable}
          onRemove={removeInfo}
          onChange={handleInput}
        />
        <ViolationAccordion
          title={t('AUDIT.FIELDS.RESULT_DOCUMENTS')}
          results={results?.documents}
          type={'documents'}
          isEditable={isEditable}
          onRemove={removeInfo}
          onChange={handleInput}
        />
        <ViolationAccordion
          title={t('AUDIT.FIELDS.RESULT_ACCOUNTING')}
          results={results?.accounting}
          type={'accounting'}
          isEditable={isEditable}
          onRemove={removeInfo}
          onChange={handleInput}
        />
        <ViolationAccordion
          title={t('AUDIT.FIELDS.RESULT_COUNTERS')}
          results={results?.counters}
          type={'counters'}
          isEditable={isEditable}
          onRemove={removeInfo}
          onChange={handleInput}
        />
        <ViolationAccordion
          title={t('AUDIT.FIELDS.RESULT_DKO_COMPLIANCE')}
          results={results?.dko_compliance}
          type={'dko_compliance'}
          isEditable={isEditable}
          onRemove={removeInfo}
          onChange={handleInput}
        />
        <ViolationAccordion
          title={t('AUDIT.FIELDS.RESULT_INFO_COMPLIANCE')}
          results={results?.info_compliance}
          type={'info_compliance'}
          isEditable={isEditable}
          onRemove={removeInfo}
          onChange={handleInput}
        />
        <ViolationAccordion
          title={t('AUDIT.FIELDS.RESULT_MANAGEMENT_COMPLIANCE')}
          results={results?.dko_management}
          type={'dko_management'}
          isEditable={isEditable}
          onRemove={removeInfo}
          onChange={handleInput}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default ResultsAccordion;

const ViolationAccordion = ({ title, type, results, isEditable, onChange, onRemove }) => {
  const { t } = useTranslation();
  const res = useUpdateAuditMutation({ fixedCacheKey: 'audit-update' });
  const error = res[1]?.error?.data;

  const inputs = useMemo(() => {
    if (!isEditable) return results;
    if (!results) return [''];
    if (results?.at(-1)?.length < 10) return results;
    return [...results, ''];
  }, [results, isEditable]);

  const getAccordionData = () => {
    if (!isEditable && (!results || results?.length === 0))
      return <Typography variant="body2" sx={{ color: '#A5BAC7' }}>{t('AUDIT.NO_VIOLATIONS')}</Typography>;

    return inputs?.map((value, index) => (
      <ViolationInput
        key={index}
        dataMarker={`violation-${index}`}
        label={t('AUDIT.VIOLATION_NUMBER', {number: index + 1})}
        value={value}
        isEditable={isEditable}
        onRemove={() => onRemove(type, index)}
        onChange={(value) => onChange(type, index, value)}
        isNewViolation={index === inputs?.length - 1}
        error={error?.results?.[type]?.[index]}
        helperText={isEditable && index === inputs.length - 1 && t('AUDIT.VIOLATION_VERIFY_MSG')}
      />
    ));
  };

  return (
    <Accordion sx={{ m: '1px', borderRadius: '0 !important' }}>
      <AccordionSummary sx={{ background: 'none' }}>{title}</AccordionSummary>
      <AccordionDetails>{getAccordionData()}</AccordionDetails>
    </Accordion>
  );
};

const ViolationInput = ({
  label,
  value,
  onChange,
  onRemove,
  isEditable,
  isNewViolation,
  error,
  helperText,
  dataMarker
}) => {
  const {t} = useTranslation();

  return (
    <Box display={'flex'} alignItems={'baseline'} gap={2} my={1.5}>
      <StyledInput
        label={label}
        value={value}
        onChange={({ target }) => onChange(target.value)}
        max={600}
        error={error || (!isNewViolation && value.length < 10)}
        dataMarker={dataMarker}
        helperText={helperText}
        multiline
      />
      {isEditable && (
        <CircleButton
          size={'small'}
          type={'delete'}
          dataMarker={`delete-${dataMarker}`}
          onClick={onRemove}
          title={t('AUDIT.DELETE_VIOLATION')}
          disabled={isNewViolation}
        />
      )}
    </Box>
  );
};
