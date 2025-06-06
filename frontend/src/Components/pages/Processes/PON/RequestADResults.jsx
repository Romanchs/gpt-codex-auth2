import Page from '../../../Global/Page';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { clearPonRequestDkoResults, getPonRequestActualDkoResults } from '../../../../actions/ponActions';
import { StyledTable } from '../../../Theme/Table/StyledTable';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import NotResultRow from '../../../Theme/Table/NotResultRow';
import makeStyles from '@material-ui/core/styles/makeStyles';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const times = new Array(12).fill(null).map((i, index) => ({
  keyAM: index,
  keyPM: index + 12,
  timeAM: `${index < 10 ? '0' : ''}${index}:00`,
  timePM: `${index + 12}:00`
}));

export const RequestADResults = () => {
  const {t} = useTranslation();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const { loading, data } = useSelector(({ pon }) => pon.requestDkoResults);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    dispatch(getPonRequestActualDkoResults(uid));
    return () => dispatch(clearPonRequestDkoResults());
  }, [dispatch, uid]);

  return (
    <Page
      pageName={t('PAGES.GTS_UPLOAD_RESULTS')}
      backRoute={`/processes/pon/request-actual-dko/${uid}`}
      loading={loading}
      faqKey={'GTS__GTS_UPLOAD_RESULTS'}
    >
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell style={{ minWidth: 120 }}>
              {t('FIELDS.EIC_CODE')}:
              <input type="text" value={filter} onChange={({ target }) => setFilter(target.value)} />
            </TableCell>
            <TableCell style={{ minWidth: 120, paddingBottom: 34 }}>Дата:</TableCell>
            <TableCell style={{ minWidth: 920, paddingBottom: 34 }} colSpan={12}>
              {t('FIELDS.HOURLY_STATUS')}:
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.filter((i) => i?.eic?.includes(filter)).length === 0 ? (
            <NotResultRow text={t('AP_NOT_FOUND')} span={14} small />
          ) : (
            data.filter((i) => i?.eic?.includes(filter))?.map((d, index) => <Row {...d} key={'row-' + index} />)
          )}
        </TableBody>
      </StyledTable>
    </Page>
  );
};

const rowStyles = makeStyles(() => ({
  status: {
    display: 'inline-block',
    verticalAlign: 'sub',
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8
  },
  date: {
    padding: '5px 8px',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 20,
    '&:first-child': {
      marginBottom: 12
    }
  }
}));

const Row = ({ eic = '', date = moment().format('yyyy-MM-DD'), data = [] }) => {
  const classes = rowStyles();
  return (
    <>
      <TableRow data-marker="table-row" className="body__table-row">
        <TableCell data-marker={'eic'} data-status={data.length === 0 ? 'send_done' : 'send_failed'}>
          <span
            className={classes.status}
            style={{ backgroundColor: data.length === 0 ? '#008C0C' : '#FF0000' }}
          ></span>
          {eic}
        </TableCell>
        <TableCell data-marker={'date'}>{moment(date).format('DD.MM.yyyy')}</TableCell>
        {times.map(({ keyAM, keyPM, timeAM, timePM }) => (
          <TableCell align={'center'} key={keyAM}>
            <div className={classes.date} style={{ backgroundColor: data.indexOf(keyAM) > -1 ? '#ff0000' : '#008C0C' }} data-marker={'hour'} data-status={data.indexOf(keyAM) > -1 ? 'failed' : 'done'}>
              {timeAM}
            </div>
            <div className={classes.date} style={{ backgroundColor: data.indexOf(keyPM) > -1 ? '#ff0000' : '#008C0C' }} data-marker={'hour'} data-status={data.indexOf(keyPM) > -1 ? 'failed' : 'done'}>
              {timePM}
            </div>
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};
