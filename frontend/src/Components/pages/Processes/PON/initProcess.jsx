import Grid from '@material-ui/core/Grid';
import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
  clearPonProcessReducer,
  clearSearchPonSuppliers,
  createPon,
  getPonReasons,
  getPonSuppliers,
  searchPonSuppliers
} from '../../../../actions/ponActions';
import { DropDownInput } from '../../../../Forms/fields/DropDownInput';
import FormDatePicker from '../../../../Forms/fields/FormDatePicker';
import FormSelect from '../../../../Forms/fields/FormSelect';
import Form from '../../../../Forms/Form';
import { clearForm } from '../../../../Forms/formActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { useNavigate } from 'react-router-dom';
import Statuses from '../../../Theme/Components/Statuses';
import { useTranslation } from 'react-i18next';

export const INIT_PON_PERMISSION = 'PROCESSES.PON.INITIALIZATION';
export const INIT_PON_ACCEPT_ROLES = 'АКО_Процеси';

const InitProcess = ({ dispatch, ponList, reasons, suppliers, createdPon, creatingFetching, error, activeRoles }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [supplier, setSupplier] = useState({
    name: '',
    eic: '',
    usreou: ''
  });
  const [timeOut, setTimeOut] = useState(null);
  const [fetchForm, setFetchForm] = useState('');
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (!checkPermissions(INIT_PON_PERMISSION, INIT_PON_ACCEPT_ROLES)) {
      navigate('/');
      return;
    }
    dispatch(getPonSuppliers());
    dispatch(getPonReasons());
    return () => {
      dispatch(clearPonProcessReducer());
      dispatch(clearForm('init-pon'));
    };
  }, [dispatch, navigate, activeRoles]);

  useEffect(() => {
    setFetchForm('');
    if (error && error?.response?.data) {
      setErrors(Object.fromEntries(Object.entries(error?.response?.data).map(([k, v]) => [k, String(v)])));
    }
  }, [error]);

  useEffect(() => {
    if (createdPon?.uid) {
      navigate(`/processes/pon/${createdPon.uid}`);
    }
  }, [createdPon, navigate]);

  const handleChange = (values) => {
    setForm(values);
  };

  const handleSearchSupplier = ({ target: { name, value } }) => {
    setSupplier({ ...supplier, [name]: value });
    clearTimeout(timeOut);
    if (value?.length >= 3) {
      setFetchForm(name);
      setTimeOut(
        setTimeout(() => {
          dispatch(searchPonSuppliers({ [name]: value }));
        }, 1000)
      );
    } else {
      setFetchForm('');
      dispatch(clearSearchPonSuppliers());
    }
  };

  const onSelectSupplier = (supplier) => {
    setSupplier(supplier);
    setFetchForm('');
    setErrors(null);
  };

  const onCreate = () => {
    dispatch(
      createPon({
        ...form,
        current_supplier: supplier.uid
      })
    );
  };

  return (
    <Page
      pageName={t('PAGES.PON')}
      backRoute={'/processes'}
      loading={creatingFetching}
      faqKey={'PROCESSES__INITIALIZATION_PON_AUTO'}
      controls={
        <CircleButton
          type={'create'}
          title={t('CONTROLS.FORM')}
          disabled={
            !supplier.uid ||
            !form?.reason_termination_supply ||
            !form?.supplier_last_resort ||
            !form?.termination_supply_at ||
            creatingFetching
          }
          onClick={onCreate}
        />
      }
    >
      <Form name={'init-pon'} onChange={handleChange} errors={errors}>
        <Statuses statuses={['NEW', 'IN_PROCESS', 'DONE', 'CANCELED']} currentStatus={'NEW'} />
        <div className={'boxShadow'} style={{ padding: 24, marginTop: 16 }}>
          <Grid container alignItems={'flex-start'} spacing={3}>
            <Grid item xs={12} md={6}>
              <DropDownInput
                label={t('FIELDS.CURRENT_SUPPLIER')}
                name={'full_name'}
                onChange={handleSearchSupplier}
                value={supplier.full_name}
                open={fetchForm === 'full_name'}
                list={suppliers}
                onSelect={onSelectSupplier}
                error={errors?.current_supplier}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DropDownInput
                label={t('FIELDS.USREOU')}
                name={'usreou'}
                onChange={handleSearchSupplier}
                value={supplier.usreou}
                open={fetchForm === 'usreou'}
                list={suppliers}
                onSelect={onSelectSupplier}
                error={errors?.current_supplier}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DropDownInput
                label={t('FIELDS.EIC_CODE_INITIATOR')}
                name={'eic'}
                onChange={handleSearchSupplier}
                value={supplier.eic}
                open={fetchForm === 'eic'}
                list={suppliers}
                onSelect={onSelectSupplier}
                error={errors?.current_supplier}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <FormSelect
                label={t('FIELDS.SUPPLIER_LAST_RESORT')}
                name={'supplier_last_resort'}
                value={ponList?.length > 0 ? ponList[0]?.uid : ''}
                disabled={ponList?.length < 2}
                data={ponList.map((pon) => ({
                  value: pon.uid,
                  label: pon.short_name
                }))}
                defaultIndex={0}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormDatePicker
                label={t('FIELDS.DATE_OF_TERMINATION_SUPPLY')}
                name={'termination_supply_at'}
                minDate={moment()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormSelect
                label={t('FIELDS.REASON_TERMINATION_SUPPLY')}
                value={reasons?.length > 0 ? Object.keys(reasons[0])[0] : ''}
                disabled={reasons?.length < 2}
                name={'reason_termination_supply'}
                data={reasons.map((r) => ({
                  value: Object.keys(r)[0],
                  label: t('PON_REASONS.' + Object.keys(r)[0])
                }))}
                defaultIndex={0}
              />
            </Grid>
          </Grid>
        </div>
      </Form>
    </Page>
  );
};

const mapStateToProps = ({ pon, user }) => {
  return {
    ponList: pon.ponList,
    reasons: pon.reasons,
    suppliers: pon.suppliers,
    createdPon: pon.createdPon,
    creatingFetching: pon.creatingFetching,
    error: pon.error,
    activeRoles: user.activeRoles
  };
};

export default connect(mapStateToProps)(InitProcess);
