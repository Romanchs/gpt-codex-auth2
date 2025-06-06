import makeStyles from '@material-ui/core/styles/makeStyles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { clearPonRequests, getPonRequests, setPonRequestsParams } from '../../../../actions/ponActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import SearchDate from '../../../Tables/SearchDate';
import TableSelect from '../../../Tables/TableSelect';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const RequestsTable = ({
  dispatch,
  loading,
  params,
  data,
  pageName,
  request_type,
  company_name,
  basePath,
  activeRoles
}) => {
  const { t } = useTranslation();
  const columns = [
    { id: 'executor_company', label: company_name, minWidth: 300 },
    { id: 'id', label: t('FIELDS.REQUEST_ID'), minWidth: 80 },
    { id: 'in_work', label: t('FIELDS.TAKED_TO_WORK'), minWidth: 100 },
    { id: 'is_answered', label: t('FIELDS.IS_ANSWERED'), minWidth: 100 },
    { id: 'finished_at', label: t('FIELDS.ANSWET_DATE'), minWidth: 130 },
    { id: 'must_be_finished_at', label: t('FIELDS.MUST_BE_FINISHED_AT'), minWidth: 130 }
  ];
  const { uid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [timeOut, setTimeOut] = useState(null);
  const [search, setSearch] = useState(params);

  useEffect(() => {
    if (
      checkPermissions('PROCESSES.PON.MAIN.FUNCTIONS.SHOW_DETAILS', [
        'АКО',
        'АКО_Процеси',
        'АКО_ППКО',
        'АКО_Користувачі',
        'АКО_Довідники'
      ])
    ) {
      dispatch(getPonRequests(uid, request_type, params));
    } else {
      navigate('/');
    }
  }, [dispatch, navigate, uid, params, activeRoles]);

  useEffect(() => {
    return () => dispatch(clearPonRequests());
  }, [dispatch]);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        dispatch(setPonRequestsParams({ [key]: value, page: 1 }));
      }, 1000)
    );
  };

  const getSearch = (id) => {
    switch (id) {
      case 'finished_at':
      case 'must_be_finished_at':
        return <SearchDate onSearch={onSearch} column={{ id: id }} formatDate={''} />;
      case 'in_work':
      case 'is_answered':
        return (
          <TableSelect
            value={search[id]}
            data={[
              { label: t('CONTROLS.YES'), value: 'Так' },
              { label: t('CONTROLS.NO'), value: 'Ні' }
            ]}
            id={id}
            onChange={onSearch}
            minWidth={80}
          />
        );
      default:
        return <input type="text" value={search?.[id] || ''} onChange={({ target }) => onSearch(id, target.value)} />;
    }
  };

  return (
    <Page pageName={pageName} backRoute={`/processes/pon/${uid}`} loading={loading}>
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, label, minWidth }) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={id} align={'left'}>
                <p>{label}</p>
                {getSearch(id)}
              </TableCell>
            ))}
            {data?.show_supplier_state && (
              <TableCell style={{ minWidth: 150 }} className={'MuiTableCell-head'} align={'left'}>
                <p>{t('SUPPLIERS.DEFAULT_STATUS')}</p>
                <TableSelect
                  value={search?.supplier_state}
                  data={[
                    { label: t('SUPPLIERS.PRE_DEFAULT_STATUS'), value: 'Переддефолт' },
                    { label: t('SUPPLIERS.DEFAULT_STATUS'), value: 'Дефолт' }
                  ]}
                  id={'supplier_state'}
                  onChange={onSearch}
                />
              </TableCell>
            )}
            <TableCell className={'MuiTableCell-head'} style={{ minWidth: 50 }}></TableCell>
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.data?.length === 0 ? (
            <NotResultRow span={data?.show_supplier_state ? 8 : 7} text={t('PROCESSES_NOT_FOUND')} loading={loading} />
          ) : (
            data?.data?.map((rowData, rowIndex) => (
              <Row
                key={`row-${rowIndex}`}
                data={rowData}
                onClick={() =>
                  navigate(`/processes/pon/${basePath}${rowData?.uid}`, {
                    state: { from: location }
                  })
                }
              />
            ))
          )}
        </TableBody>
      </StyledTable>
      <Pagination {...data} loading={loading} params={params} onPaginate={(p) => dispatch(setPonRequestsParams(p))} />
    </Page>
  );
};

const useStyles = makeStyles(() => ({
  request: {
    margin: '0 auto',
    backgroundColor: 'rgba(209, 237, 243, 0.5)',
    width: 56,
    padding: 5,
    fontSize: 12,
    lineHeight: 1.2,
    borderRadius: 24,
    textAlign: 'center',
    fontWeight: 500
  },
  danger: {
    color: '#FF4850'
  },
  success: {
    color: '#008C0C'
  }
}));

const Row = ({ data, onClick }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <>
      <TableRow data-marker="table-row" className="body__table-row">
        <TableCell data-marker="executor_company">{data?.executor_company}</TableCell>
        <TableCell align={'center'} data-marker="number-statement">
          {data?.id}
        </TableCell>
        <TableCell align={'center'} data-marker="status-in_work">
          <div
            className={clsx(
              classes.request,
              data?.in_work && data.in_work.toUpperCase() === 'NO' ? classes.danger : classes.success
            )}
          >
            {t(`CONTROLS.${data?.in_work}`)}
          </div>
        </TableCell>
        <TableCell align={'center'} data-marker="status-is_answered">
          <div
            className={clsx(
              classes.request,
              data?.is_answered && data.is_answered.toUpperCase() === 'NO' ? classes.danger : classes.success
            )}
          >
            {t(`CONTROLS.${data?.is_answered}`)}
          </div>
        </TableCell>
        <TableCell data-marker="date-finished_at">
          {data?.finished_at ? moment(data.finished_at).format('DD.MM.YYYY • HH:mm') : '— • —'}
        </TableCell>
        <TableCell data-marker="date-must_be_finished_at">
          {data?.must_be_finished_at ? moment(data.must_be_finished_at).format('DD.MM.YYYY • HH:mm') : '— • —'}
        </TableCell>
        {data?.supplier_state && (
          <TableCell data-marker="supplier_state">{t(`SUPPLIERS.${data?.supplier_state}`)}</TableCell>
        )}
        <TableCell>
          <CircleButton type={'link'} onClick={onClick} size={'small'} title={t('CONTROLS.GO_TO')} />
        </TableCell>
      </TableRow>
    </>
  );
};

const mapStateToProps = ({ pon: { requests }, user }) => ({
  loading: requests.loading,
  params: requests.params,
  data: requests.data,
  error: requests.error,
  activeRoles: user.activeRoles
});

export default connect(mapStateToProps)(RequestsTable);
