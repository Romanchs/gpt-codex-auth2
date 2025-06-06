import makeStyles from '@material-ui/core/styles/makeStyles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { changeSupplierInformingAkoDetails, clearCurrentProcess } from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import { Pagination } from '../../../Theme/Table/Pagination';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../../Theme/Table/StickyTableHead';

const columns = [
  { title: 'FIELDS.ORGANIZATION', minWidth: 300 },
  { title: 'FIELDS.REQUEST_ID', minWidth: 100 },
  { title: 'FIELDS.RESPONSIBLE_NAME', minWidth: 160 },
  { title: 'FIELDS.IS_ANSWERED', minWidth: 80 },
  { title: 'FIELDS.ANSWET_DATE', minWidth: 120 },
  { title: 'FIELDS.DEADLINE', minWidth: 120 }
];

const InformingAkoDetail = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const { uid, type } = useParams();
  const dispatch = useDispatch();
  const { relation_id } = useSelector(({ user }) => user.activeRoles[0]);
  const { loading, currentProcess, notFound } = useSelector(({ processes }) => processes);
  const [params, setParams] = useState({ page: 1, size: 25 });

  // Check roles & get data
  useEffect(() => {
    if (
      checkPermissions('PROCESSES.CHANGE_SUPPLIER.INFORMING_AKO_DETAIL.ACCESS', [
        'АКО_Процеси',
        'АКО',
        'АКО_Користувачі'
      ])
    ) {
      dispatch(changeSupplierInformingAkoDetails(uid, type, params));
    } else {
      navigate('/processes');
    }
  }, [relation_id, uid, type, params, navigate, dispatch]);

  // Clear store after unmount
  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  const getHeader = () => {
    switch (type) {
      case 'predictable-consumption-odko':
        return t('PAGES.PREDICTABLE_CONSUMPTION_ODKO');
      case 'informing-atko-for-change-supplier':
        return t('PAGES.INFORMING_ATKO_FOR_CHANGE_SUPPLIER');
      case 'informing-current-supplier':
        return t('PAGES.INFORMING_CURRENT_SUPPLIER');
      default:
        return t('PAGES.DKO_REQUEST_FOR_THE_DATE');
    }
  };

  return (
    <Page
      pageName={getHeader()}
      backRoute={() =>
        navigate(`/processes/informing-ako/${uid}`, {
          state: { tab: 'informing' }
        })
      }
      loading={loading}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
    >
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ title, minWidth }, index) => (
              <TableCell style={{ minWidth }} className={'MuiTableCell-head'} key={'head' + index}>
                {t(title)}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {currentProcess?.data?.length > 0 ? (
            currentProcess?.data.map((row, index) => (
              <TableRow data-marker="table-row" className="body__table-row" key={`row-${index}`}>
                <TableCell data-marker={'executor_company'}>{row?.executor_company}</TableCell>
                <TableCell data-marker={'id'}>{row?.id}</TableCell>
                <TableCell data-marker={'executor'}>{row?.executor}</TableCell>
                <TableCell data-marker={'is_answered'}>
                  <div
                    className={clsx(
                      classes.request,
                      row?.is_answered && row.is_answered.toUpperCase() === 'NO' ? classes.danger : classes.success
                    )}
                  >
                    {t(`CONTROLS.${row?.is_answered}`)}
                  </div>
                </TableCell>
                <TableCell data-marker={'finished_at'}>
                  {row?.finished_at && moment(row?.finished_at).format('DD.MM.yyyy • HH:mm')}
                </TableCell>
                <TableCell data-marker={'must_be_finished_at'}>
                  {row?.must_be_finished_at && moment(row?.must_be_finished_at).format('DD.MM.yyyy • HH:mm')}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <NotResultRow text={t('NO_DATA')} span={9} small />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...currentProcess}
        loading={loading}
        params={params}
        onPaginate={(v) => setParams({ ...params, ...v })}
      />
    </Page>
  );
};

export default InformingAkoDetail;

const useStyles = makeStyles(() => ({
  request: {
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
