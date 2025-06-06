import Grid from '@material-ui/core/Grid';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  clearPonInformingList,
  clearPonRequestTko,
  getPonProvideActualDko,
  getPonProvideActualDkoGTS
} from '../../../../actions/ponActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import TableSelect from '../../../Tables/TableSelect';
import StyledInput from '../../../Theme/Fields/StyledInput';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { TYPE_OF_ACCOUNTING_POINT } from '../../../../util/directories';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'mp', label: 'EIC_CODE_AP', minWidth: 150 },
  { id: 'customer_status', label: 'GRID_CUSTOMER__STATUS', minWidth: 100 },
  { id: 'mga_id', label: 'FIELDS.METERING_GRID_AREA_EIC', minWidth: 100 },
  { id: 'type_accounting_point', label: 'FIELDS.TYPE_ACCOUNTING_POINT', minWidth: 100 },
  { id: 'addkod4', label: 'FIELDS.ADDKOD4', minWidth: 100 },
  { id: 'in_ts', label: 'IN', minWidth: 100 },
  { id: 'out_ts', label: 'OUT', minWidth: 100 }
];

const customerStatusOptions = [
  { value: 'Юрособа', label: 'LEGAL_ENTITY' },
  { value: 'Фізособа', label: 'INDIVIDUAL' }
];

export const PROVIDE_ACTUAL_DKO_ACCEPT_ROLES = [
  'АКО',
  'АКО_Процеси',
  'АКО_ППКО',
  'АКО_Користувачі',
  'АКО_Довідники',
  'СВБ'
];

const ProvideActualDko = ({ dispatch, loading, data, notFound, listLoading, activeRoles }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { uid } = useParams();
  const timeout = useRef(null);
  const [search, setSearch] = useState({});
  const [params, setParams] = useState({
    page: 1,
    size: 25,
    point_type: 'installation_ap',
    product_type: 'active',
    period_from: null,
    period_to: null,
    subprocess_uid: uid
  });
  const [gts, setGts] = useState({});

  useEffect(() => {
    if (checkPermissions('PROCESSES.PON.PROVIDE_ACTUAL_DKO.ACCESS', PROVIDE_ACTUAL_DKO_ACCEPT_ROLES)) {
      dispatch(
        getPonProvideActualDko(uid, ({ start_date, end_date }) =>
          setParams((prev) => ({
            ...prev,
            period_from: start_date,
            period_to: end_date
          }))
        )
      );
    } else {
      navigate('/processes');
    }

    return () => {
      dispatch(clearPonRequestTko());
      dispatch(clearPonInformingList());
    };
  }, [dispatch, navigate, uid, activeRoles]);

  useEffect(() => {
    if (!params?.period_from || !params?.period_to) return;
    dispatch(getPonProvideActualDkoGTS(params, setGts));
  }, [dispatch, params]);

  // useEffect(() => {
  //   dispatch(getPonInformingList(uid, listParams));
  // }, [dispatch, listParams, uid]);

  // const handleStart = () => {
  //   dispatch(startPonProvideActualDko(uid));
  // };

  // const handleDownload = () => {
  //   dispatch(downloadPonProvideActualDkoFile(uid, `Історичні ДКО за заявкою №${data?.id}`));
  // };

  // const handleUpdateParams = (params) => {
  //   dispatch(setPonInformingListParams({...listParams, ...params}));
  // };

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    if (!value || value.length === 0 || value.length > 3) {
      timeout.current = setTimeout(() => {
        if (value) {
          setParams({ ...params, [id]: value, page: 1 });
        } else {
          const { [id]: value, ...newParams } = params;
          setParams({ ...newParams, page: 1 });
        }
      }, 500);
    }
  };

  const getSearchField = (id) => {
    switch (id) {
      case 'in_ts':
      case 'out_ts':
        return null;
      case 'customer_status':
        return (
          <TableSelect
            value={search[id]}
            data={customerStatusOptions}
            id={id}
            onChange={onSearch}
            minWidth={80}
            ignoreI18={false}
          />
        );
      case 'type_accounting_point':
        return (
          <TableSelect
            value={search[id]}
            data={Object.entries(TYPE_OF_ACCOUNTING_POINT).map(([value, label]) => ({ value, label: t(label) }))}
            id={id}
            onChange={onSearch}
            minWidth={80}
          />
        );
      default:
        return <input value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  const getTableData = (id, value) => {
    if (id === 'type_accounting_point') {
      return t(TYPE_OF_ACCOUNTING_POINT[value]);
    }
    if (id === 'customer_status') {
      return i18n.exists(value) ? t(value) : value || '';
    }
    return value;
  };

  return (
    <Page
      pageName={
        data?.id && !loading ? t('PAGES.PROVIDE_ACTUAL_DKO_ID', { id: data?.id }) : t('PAGES.PROVIDE_ACTUAL_DKO')
      }
      backRoute={'/processes'}
      faqKey={'PROCESSES__RESPONSE_ACTUAL_DKO'}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
      loading={loading || listLoading}
    >
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} lg={8}>
            <StyledInput label={t('FIELDS.SUPPLIER_NAME')} disabled value={data?.supplier_last_resort?.full_name} />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <StyledInput label={t('FIELDS.COMPANY_USREOU')} disabled value={data?.supplier_last_resort?.usreou} />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <StyledInput
              label={t('FIELDS.AP_NUMBER_MOVE_TO_PON')}
              disabled
              value={data?.tko_number_move_to_pon?.toString()}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={2}>
            <StyledInput
              label={t('FIELDS.TERMINATION_SUPPLY_AT')}
              disabled
              value={data?.termination_supply_at && moment(data?.termination_supply_at).format('DD.MM.yyyy')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput
              label={t('FIELDS.MESSAGE_DATE')}
              disabled
              value={data?.receipt_at && moment(data?.receipt_at).format('DD.MM.yyyy • HH:mm')}
            />
          </Grid>
          <Grid item xs={12} lg={7}>
            <StyledInput label={t('FIELDS.BALANCE_SUPPLIER')} disabled value={data?.current_supplier?.full_name} />
          </Grid>
        </Grid>
      </div>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id}>
                {id === 'in_ts' || id === 'out_ts' ? (
                  <p>
                    {t(label)} (
                    {params.product_type === 'active' ? t('FIELDS.ACTIVE_DIMENSION') : t('FIELDS.REACTIVE_DIMENSION')})
                  </p>
                ) : (
                  <p>{t(label)}</p>
                )}
                {getSearchField(id)}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {gts?.data?.length > 0 ? (
            gts?.data?.map((row, index) => (
              <TableRow key={'row' + index} hover data-marker="table-row" className="body__table-row">
                {columns.map(({ id }) => (
                  <TableCell key={'cell' + id} data-marker={id}>
                    {getTableData(id, row[id])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <NotResultRow span={8} text={t('NOTHING_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...gts}
        loading={loading}
        params={params}
        onPaginate={(newParams) => setParams({ ...params, ...newParams })}
      />
    </Page>
  );
};

const mapStateToProps = ({ pon: { requestTko, informingList }, user }) => ({
  loading: requestTko.loading,
  data: requestTko.data,
  notFound: requestTko.notFound,
  listLoading: informingList.loading,
  list: informingList.data,
  listParams: informingList.params,
  activeRoles: user.activeRoles
});

export default connect(mapStateToProps)(ProvideActualDko);
