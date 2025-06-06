import { Checkbox, Grid } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import HighlightOffRounded from '@mui/icons-material/HighlightOffRounded';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setSuppliersParams } from '../../../../actions/suppliersActions';
import { SUPPLIERS } from '../../../../actions/types';
import FormDatePicker from '../../../../Forms/fields/FormDatePicker';
import FormInput from '../../../../Forms/fields/FormInput';
import FormSelect from '../../../../Forms/fields/FormSelect';
import { FIELDTYPE } from '../../../../Forms/fields/types';
import { checkPermissions } from '../../../../util/verifyRole';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import TableSelect from '../../../Tables/TableSelect';
import { DangerButton } from '../../../Theme/Buttons/DangerButton';
import { WhiteButton } from '../../../Theme/Buttons/WhiteButton';
import Filter from '../../../Theme/Table/Filter';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { CAUSES, DEPT_TYPES, supplierStatuses } from './models';
import Row from './Row';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { COMPARE_CODES } from '../../../../util/directories';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'checks', width: 50 },
  { id: 'status', title: 'FIELDS.STATUS', width: 135 },
  { id: 'usreou', title: 'FIELDS.USREOU', width: 100 },
  { id: 'eic', title: 'FIELDS.EIC_CODE_TYPE_X', width: 145 },
  { id: 'full_name', title: 'FIELDS.FULL_NAME' }
];

const filters = [
  {
    id: 'date_entry',
    type: FIELDTYPE.DATE,
    title: 'SUPPLIERS.DATE_ENTRY'
  },
  {
    id: 'cause_entry',
    type: FIELDTYPE.OPTION,
    title: 'SUPPLIERS.CAUSE_ENTRY',
    options: Object.keys(CAUSES).map((x) => ({
      value: x,
      label: CAUSES[x]
    }))
  },
  { id: 'updated_by', title: 'SUPPLIERS.USER_WHO_SET_STATUS' },
  {
    id: 'debt_type',
    type: FIELDTYPE.OPTION,
    title: 'SUPPLIERS.TYPE_OF_DEBT',
    options: Object.keys(DEPT_TYPES).map((x) => ({
      value: x,
      label: DEPT_TYPES[x]
    }))
  },
  { id: 'full_fields', title: 'SUPPLIERS.SEARCH_BY_EDRPOU_EIC', fullWidth: true }
];

const Table = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { params, data, selected, loading } = useSelector(({ suppliers }) => suppliers);
  const [timeOut, setTimeOut] = useState(null);
  const [search, setSearch] = useState(params);
  const [openClear, setOpenClear] = useState(false);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        dispatch(setSuppliersParams({ ...params, [key]: value, page: 1 }));
      }, 1000)
    );
  };

  const handleFilter = (filterValues) => {
    const filters = filterValues ? Object.keys(filterValues) : [];
    const newParams = {};
    Object.entries(params).forEach(([id, oldValue]) => {
      newParams[id] = filters.find((i) => i.id === id) ? oldValue : null;
    });
    dispatch(setSuppliersParams({ ...newParams, ...filterValues, page: 1, size: 25 }));
  };

  const handleClear = () => {
    dispatch({ type: SUPPLIERS.SET_SELECTED, payload: [] });
    setOpenClear(false);
  };

  const handleClearFilter = (formParams) => {
    const newParams = {};
    Object.entries(params).forEach(([id, oldValue]) => {
      newParams[id] = filters.find((i) => i.id === id) ? null : oldValue;
    });
    dispatch(setSuppliersParams({ ...newParams, ...formParams, page: 1, size: 25 }));
  };

  const getSearchField = (id) => {
    switch (id) {
      case 'checks':
        return (
          <Checkbox
            data-marker={'checkbox--clear'}
            checked={selected.length > 0}
            onChange={(event, checked) => !checked && setOpenClear(true)}
            icon={<HighlightOffRounded color={'primary'} />}
            checkedIcon={<HighlightOffRounded style={{ fontSize: 23 }} />}
            style={{
              marginLeft: -5,
              marginBottom: -4
            }}
          />
        );
      case 'status':
        return (
          <TableSelect
            value={search[id]}
            data={Object.values(supplierStatuses).map((i) => ({ ...i, label: t(i.label) }))}
            readOnly={loading}
            id={id}
            onChange={onSearch}
            minWidth={80}
          />
        );
      default:
        return (
          <input value={search[id] || ''} readOnly={loading} onChange={({ target }) => onSearch(id, target.value)} />
        );
    }
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ width, id, title }, index) => {
              if (!checkPermissions('SUPPLIERS.LIST.CONTROLS.CHANGE_STATUS', ['АР', 'АКО_Користувачі']) && id === 'checks') {
                return null;
              }
              return (
                <TableCell style={{ width }} className={'MuiTableCell-head'} key={'header' + index}>
                  {title && <p>{t(title)}</p>}
                  {getSearchField(id)}
                </TableCell>
              );
            })}
            <Filter
              name={'suppliers-filter-form'}
              onChange={handleFilter}
              unmount={true}
              autoApply={false}
              onClear={handleClearFilter}
              big
            >
              {filters.map((x) => (
                <Grid item xs={12} md={x?.fullWidth ? 12 : 6} key={x.id}>
                  {x.type === FIELDTYPE.OPTION && (
                    <FormSelect
                      label={t(x.title)}
                      name={x.id}
                      defaultIndex={0}
                      ignoreI18
                      data={x.options
                        .map((i) => ({
                          ...i,
                          label: t(i.label)
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label, COMPARE_CODES[i18n.language]))}
                    />
                  )}
                  {x.type === FIELDTYPE.DATE && (
                    <FormDatePicker label={t(x.title)} name={x.id} outFormat={'yyyy-MM-DD'} />
                  )}
                  {!x.type && <FormInput label={t(x.title)} name={x.id} />}
                </Grid>
              ))}
            </Filter>
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.data?.length > 0 ? (
            data.data.map((row) => (
              <Row
                {...row}
                key={row?.uid}
                selected={Boolean(selected.find((i) => i.uid === row?.uid))}
                can_select={Boolean(selected.length === 0 || selected[0].status === row?.status)}
              />
            ))
          ) : (
            <NotResultRow span={6} text={t('SUPPLIERS.NO_SUPPLIER_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <ModalWrapper
        open={openClear}
        maxWidth={'sm'}
        onClose={() => setOpenClear(false)}
        header={t('SUPPLIERS.REMOVE_SELECTED_SUPPLIERS')}
      >
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
          <WhiteButton onClick={() => setOpenClear(false)}>{t('CONTROLS.NO')}</WhiteButton>
          <DangerButton onClick={handleClear}>{t('CONTROLS.YES')}</DangerButton>
        </Stack>
      </ModalWrapper>
    </>
  );
};

export default Table;
