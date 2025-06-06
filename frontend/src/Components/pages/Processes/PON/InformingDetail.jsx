import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getPonInformingDetails } from '../../../../actions/ponActions';
import { CLEAR_PON_INFORMING_DETAIL } from '../../../../actions/types';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  table: {
    marginBottom: 24,
    borderRadius: 10,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    '& td, & th': {
      borderBottom: '1px solid #4A5B7A',
      fontSize: 12,
      paddingTop: 12,
      paddingBottom: 12,
      color: '#567691',
      '&.MuiTableCell-head': {
        backgroundColor: '#D1EDF3',
        color: '#0D244D'
      }
    },

    '& tr:not(.MuiTableRow-head):last-child': {
      '& td, & th': {
        borderBottom: 'none'
      }
    }
  }
}));

const months = [
  { key: 'january', label: '01', minWidth: 80, align: 'center' },
  { key: 'february', label: '02', minWidth: 80, align: 'center' },
  { key: 'march', label: '03', minWidth: 80, align: 'center' },
  { key: 'april', label: '04', minWidth: 80, align: 'center' },
  { key: 'may', label: '05', minWidth: 80, align: 'center' },
  { key: 'june', label: '06', minWidth: 80, align: 'center' },
  { key: 'july', label: '07', minWidth: 80, align: 'center' },
  { key: 'august', label: '08', minWidth: 80, align: 'center' },
  { key: 'september', label: '09', minWidth: 80, align: 'center' },
  { key: 'october', label: '10', minWidth: 80, align: 'center' },
  { key: 'november', label: '11', minWidth: 80, align: 'center' },
  { key: 'december', label: '12', minWidth: 80, align: 'center' }
];

const InformingDetail = ({ dispatch, activeRoles, data, loading, notFound }) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const { uid, tko_uid } = useParams();
  const classes = useStyles();

  useEffect(() => {
    if (
      checkPermissions('PROCESSES.PON.INFORMING.ACCESS', [
        'АКО',
        'АКО_Процеси',
        'АКО_ППКО',
        'АКО_Користувачі',
        'АКО_Довідники',
        'СВБ'
      ])
    ) {
      dispatch(getPonInformingDetails(uid, tko_uid));
    } else {
      navigate('/processes');
    }
    return () => dispatch({ type: CLEAR_PON_INFORMING_DETAIL });
  }, [dispatch, navigate, activeRoles]);

  return (
    <Page
      pageName={t('PAGES.INFORMING')}
      backRoute={`/processes/pon/informing/${uid}`}
      loading={loading}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
    >
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StyledInput label={t('FIELDS.TKO_EIC')} disabled value={data?.eic} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StyledInput label={t('FIELDS.CONNECTION_STATUS')} disabled value={data?.connection_status} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StyledInput label={t('FIELDS.AP_CUSTOMER_CODE')} disabled value={data?.owner_code} />
          </Grid>
        </Grid>
      </div>
      {data?.data.map((yearData) => (
        <TableContainer key={yearData?.year} component={Paper} className={classes.table} elevation={0}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align={'center'}>{t('FIELDS.MONTH')} / {t('FIELDS.YEAR')}</TableCell>
                {months.map(({ key, minWidth, label }) => (
                  <TableCell
                    key={'head_' + key}
                    align={'center'}
                    style={{ minWidth }}
                  >{`${label}.${yearData?.year}`}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell variant={'head'} align={'center'}>
                  IN
                </TableCell>
                {months.map(({ key, minWidth }) => (
                  <TableCell key={'body_in_' + key} align={'center'} style={{ minWidth }}>
                    {yearData[key].in || '-'}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell variant={'head'} align={'center'}>
                  OUT
                </TableCell>
                {months.map(({ key, minWidth }) => (
                  <TableCell key={'body_out_' + key} align={'center'} style={{ minWidth }}>
                    {yearData[key].out || '-'}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </Page>
  );
};

const mapStateToProps = ({ user, pon }) => ({
  activeRoles: user.activeRoles,
  data: pon.informing.data,
  loading: pon.informing.loading,
  notFound: pon.informing.notFound,
  error: pon.informing.error
});

export default connect(mapStateToProps)(InformingDetail);
