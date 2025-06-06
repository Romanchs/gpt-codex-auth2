import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { suppliersUpdateStatus } from '../../../../actions/suppliersActions';
import { SUPPLIERS } from '../../../../actions/types';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import DatePicker from '../../../Theme/Fields/DatePicker';
import SelectField from '../../../Theme/Fields/SelectField';
import { supplierReasons, supplierStatuses as statuses } from '../Main/models';
import Table from './Table';
import { useTranslation } from 'react-i18next';
import StyledInput from '../../../Theme/Fields/StyledInput';

const Transfer = () => {
  const { t } = useTranslation();
  const empty_value = '---';
  const dispatch = useDispatch();
  const { type } = useParams();
  const navigate = useNavigate();
  const { selected, loading, error } = useSelector(({ suppliers }) => suppliers);
  const [form, setForm] = useState({
    datetime_change: null,
    cause: empty_value,
    debt_type: empty_value
  });
  const reasons = useMemo(
    () => (selected.length > 0 ? supplierReasons[selected[0].status][type] : []),
    [selected, type]
  );
  const typesOfDebt = useMemo(() => reasons.find((i) => i.value === form.cause)?.typeOfDebt, [reasons, form.cause]);

  const isFromDefaultToActive =
    selected.every((i) => i.status === statuses.DEFAULT.value) && type === statuses.ACTIVE.value;

  console.log('form', form);

  useEffect(() => {
    if (!checkPermissions('SUPPLIERS.LIST.CONTROLS.CHANGE_STATUS', ['АР', 'АКО_Користувачі'])) {
      navigate('/');
    }
    if (!statuses[type] || selected.length === 0) {
      navigate('/suppliers');
    }
  }, [navigate, type, selected]);

  useEffect(
    () => () => {
      dispatch({
        type: SUPPLIERS.UPDATE_STATUS.STARTED,
        payload: { data: selected, selectedErrors: [] }
      });
    },
    [dispatch]
  );

  const handleSave = () => {
    dispatch(
      suppliersUpdateStatus(
        {
          datetime_change: form.datetime_change,
          cause: form.cause,
          status_from: selected[0].status,
          status_to: type,
          debt_type: form.debt_type === empty_value ? undefined : form.debt_type,
          party_registers: selected.map((i) => i.uid),
          comment: form.comment ? form.comment : undefined
        },
        () => {
          setForm({
            datetime_change: null,
            cause: empty_value,
            debt_type: empty_value
          });
        }
      )
    );
  };

  return (
    <Page
      pageName={t('STATUSES.TRANSFER_OF_UR_TO_STATUSES', { status: t(statuses[type]?.label) })}
      loading={loading}
      backRoute={'/suppliers'}
      controls={
        <CircleButton
          type={'done'}
          title={t('CONTROLS.DELEGATE')}
          disabled={
            !form.datetime_change ||
            form.cause === empty_value ||
            (typesOfDebt && typesOfDebt.length > 0 && form.debt_type === empty_value) ||
            (isFromDefaultToActive && !form.comment)
          }
          onClick={handleSave}
        />
      }
    >
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 24 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <DatePicker
              label={`${t('SUPPLIERS.DATE_ENTRY')} ${t(statuses[type]?.label).toLowerCase()}`}
              value={form.datetime_change}
              maxDate={moment()}
              onChange={(d) => setForm({ ...form, datetime_change: d })}
              error={error?.datetime_change?.length && error?.datetime_change[0]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={9}>
            <SelectField
              label={t('REASON')}
              value={form.cause}
              data={[{ value: empty_value, label: t('NOT_SELECTED') }, ...reasons]}
              onChange={(v) => setForm({ ...form, cause: v, debt_type: empty_value })}
              // error={form.cause === empty_value}
            />
          </Grid>
          {typesOfDebt && typesOfDebt?.length > 0 && (
            <Grid item xs={12} md={4} lg={12}>
              <SelectField
                label={t('SUPPLIERS.TYPE_OF_DEBT')}
                value={form.debt_type}
                data={[{ value: empty_value, label: t('NOT_SELECTED') }, ...typesOfDebt]}
                onChange={(v) => setForm({ ...form, debt_type: v })}
                // error={form.dept_type === empty_value}
              />
            </Grid>
          )}
          {isFromDefaultToActive && (
            <Grid item xs={12} md={4} lg={12}>
              <StyledInput
                name={'message'}
                label={t('FIELDS.COMMENT')}
                value={form.comment}
                multiline
                minRows={4}
                onChange={(v) => setForm({ ...form, comment: v.target.value })}
                dataMarker={'input_message'}
                error={error?.comment}
              />
            </Grid>
          )}
        </Grid>
      </div>
      <Table />
    </Page>
  );
};

export default Transfer;
