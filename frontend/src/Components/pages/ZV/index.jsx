import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import clsx from 'clsx';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { zvGetList } from '../../../actions/zvActions';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../Global/Page';
import NotResultRow from '../../Theme/Table/NotResultRow';
import { Pagination } from '../../Theme/Table/Pagination';
import { StyledTable } from '../../Theme/Table/StyledTable';
import { useExpandRowStyles } from '../Admin/AdminTable';
import Filter from '../../Theme/Table/Filter';
import Grid from '@mui/material/Grid';
import FormInput from '../../../Forms/fields/FormInput';
import FormDatePicker from '../../../Forms/fields/FormDatePicker';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import useViewDataLog from '../../../services/actionsLog/useViewDataLog';
import useSearchLog from '../../../services/actionsLog/useSearchLog';
import useViewDataCallbackLog from '../../../services/actionsLog/useViewDataCallbackLog';
import StickyTableHead from '../../Theme/Table/StickyTableHead';

const columns = [
  { id: 'eic_zv', title: 'FIELDS.EIC_CODE_ZV', minWidth: 140 },
  { id: 'eic_y1', title: 'FIELDS.EIC_CODE_TYPE_Y1', minWidth: 140 },
  { id: 'eic_x1', title: 'FIELDS.EIC_CODE_TYPE_X1', minWidth: 140 },
  { id: 'owner_name_1', title: 'OWNER_NAME_1', minWidth: 200 },
  { id: 'eic_y_w2', title: 'FIELDS.EIC_CODE_TYPE_Y_W2', minWidth: 140 },
  { id: 'eic_x2', title: 'FIELDS.EIC_CODE_TYPE_X2', minWidth: 140 },
  { id: 'owner_name_2', title: 'OWNER_NAME_2', minWidth: 140 }
];

const filters = [
  { id: 'short_name_ppko', title: 'ODKO_SHORT_NAME', xs: 12, minWidth: 400 },
  { id: 'eic_odko', title: 'FIELDS.EIC_PPKO_ODKO', xs: 12, width: 200 },
  { id: 'starts_at', title: 'FIELDS.DATE_START', xs: 6, type: 'date', width: 200 },
  { id: 'ends_at', title: 'FIELDS.DATE_END', xs: 6, type: 'date', width: 200 }
];

const LOG_TAG = ['Відповідальні ППКО за ZV'];
export const ZV_ACCEPT_ROLES = ['АКО', 'АКО_Процеси', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Довідники'];

const Zv = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { relation_id } = useSelector(({ user }) => user.activeRoles[0]);
  const { loading, data } = useSelector(({ zv }) => zv);
  const [params, setParams] = useState({ page: 1, size: 25 });
  const [search, setSearch] = useState({});
  const timeout = useRef(null);
  const filtersList = useMemo(() => filters.map((i) => i.id), []);

  const viewDataLog = useViewDataLog(LOG_TAG);
  const onPaginateLog = useViewDataCallbackLog(LOG_TAG);
  const searchLog = useSearchLog(LOG_TAG);

  useEffect(() => {
    if (checkPermissions('ZV.ACCESS', ZV_ACCEPT_ROLES)) {
      dispatch(zvGetList(params));
      viewDataLog();
    } else {
      navigate('/');
    }
  }, [dispatch, navigate, relation_id, params]);

  const onSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      const newParams = { ...params, page: 1, size: 25, [id]: value };
      for (const i in newParams) if (newParams[i] === '') delete newParams[i];
      setParams(newParams);
      searchLog();
    }, 500);
  };

  const handleFilter = (filters) => {
    const newFilters = { ...params, ...filters, page: 1 };
    const includedFilters = filters ? Object.keys(filters) : [];
    for (const id of filtersList) {
      if (!includedFilters.includes(id)) {
        delete newFilters[id];
      }
    }
    setParams(newFilters);
    searchLog();
  };

  const handlePaginate = (p) => {
    setParams({ ...params, ...p });
    onPaginateLog();
  };

  return (
    <Page
      pageName={t('MANAGEMENT_OF_RESPONSIBLE_PPKO_ON_ZV')}
      backRoute={'/'}
      loading={loading}
      faqKey={'INFORMATION_BASE__ZV'}
    >
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, title, minWidth }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id}>
                <p>{t(title)}</p>
                <input type="text" value={search[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />
              </TableCell>
            ))}
            <Filter
              modalHeader={t('FILTERS')}
              name={'zv-filter-form'}
              unmount={true}
              autoApply={false}
              onChange={handleFilter}
            >
              {filters.map((i) => (
                <Grid key={i.id} item xs={i.xs}>
                  {i.type === 'date' ? (
                    <FormDatePicker label={t(i.title)} name={i.id} outFormat={'YYYY-MM-DD'} />
                  ) : (
                    <FormInput label={t(i.title)} name={i.id} />
                  )}
                </Grid>
              ))}
            </Filter>
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.data?.length > 0 ? (
            data?.data?.map((row, index) => <Row {...row} key={index} />)
          ) : (
            <NotResultRow span={8} text={t('NO_USERS')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination loading={loading} params={params} onPaginate={handlePaginate} {...data} />
    </Page>
  );
};

export default Zv;

function Row({
  eic_zv = '',
  eic_y1 = '',
  eic_x1 = '',
  owner_name_1 = '',
  eic_y_w2 = '',
  eic_x2 = '',
  owner_name_2 = '',
  ppko_data = [],
  uid
}) {
  const { t } = useTranslation();
  const classes = useExpandRowStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow className={clsx(open && classes.rootOpen, classes.root)} data-marker={'table-row'}>
        <TableCell data-marker={'eic_zv'}>{eic_zv}</TableCell>
        <TableCell data-marker={'eic_y1'}>{eic_y1}</TableCell>
        <TableCell data-marker={'eic_x1'}>{eic_x1}</TableCell>
        <TableCell data-marker={'owner_name_1'}>{owner_name_1}</TableCell>
        <TableCell data-marker={'eic_y_w2'}>{eic_y_w2}</TableCell>
        <TableCell data-marker={'eic_x2'}>{eic_x2}</TableCell>
        <TableCell data-marker={'owner_name_2'}>{owner_name_2}</TableCell>
        <TableCell align={'right'}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            data-marker={open ? 'expand' : 'collapse'}
            sx={{
              fontSize: 21,
              border: open ? '1px solid #F28C60' : '1px solid #223B82',
              color: open ? '#F28C60' : '#223B82'
            }}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={`table-row--detail id-${uid}`}>
        <TableCell style={{ paddingBottom: 8, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={classes.detailContainer}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow className={classes.head}>
                    {filters.map((i) => (
                      <TableCell key={i.id} style={{ [i.width ? 'width' : 'minWidth']: i.width || i.minWidth }}>
                        {t(i.title)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ppko_data.length === 0 ? (
                    <TableRow className={classes.body}>
                      <TableCell colSpan={4} align={'center'}>
                        {t('NO_PPKO')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    ppko_data.map(
                      ({ eic_odko = '', short_name_ppko = '', starts_at = null, ends_at = null }, index) => (
                        <TableRow className={classes.body} key={'ppko-' + index}>
                          <TableCell data-marker={'short_name_ppko'}>{short_name_ppko}</TableCell>
                          <TableCell data-marker={'eic_odko'}>{eic_odko}</TableCell>
                          <TableCell data-marker={'starts_at'}>
                            {starts_at ? moment(starts_at).format('DD.MM.yyyy') : '–  •  –'}
                          </TableCell>
                          <TableCell data-marker={'ends_at'}>
                            {ends_at ? moment(ends_at).format('DD.MM.yyyy') : '–  •  –'}
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
