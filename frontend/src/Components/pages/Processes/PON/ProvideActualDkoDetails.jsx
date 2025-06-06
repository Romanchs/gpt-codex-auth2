import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getPonProvideActualDkoTkoDetail } from '../../../../actions/ponActions';
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

    '& .MuiTable-root:last-child tr:not(.MuiTableRow-head):last-child': {
      '& td, & th': {
        borderBottom: 'none'
      }
    }
  }
}));

// const times = new Array(12).fill(null).map((i, index) => ({
//   keyAM: index + 1,
//   keyPM: index + 13
// }));

const ProvideActualDkoDetails = ({ dispatch, activeRoles, data, loading, notFound }) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const { uid, tko_uid } = useParams();
  const classes = useStyles();

  useEffect(() => {
    if (
      checkPermissions('PROCESSES.PON.PROVIDE_ACTUAL_DKO.ACCESS', [
        'АКО',
        'АКО_Процеси',
        'АКО_ППКО',
        'АКО_Користувачі',
        'АКО_Довідники',
        'СВБ'
      ])
    ) {
      dispatch(getPonProvideActualDkoTkoDetail(uid, tko_uid));
    } else {
      navigate('/processes');
    }
    return () => dispatch({ type: CLEAR_PON_INFORMING_DETAIL });
  }, [dispatch, navigate, activeRoles]);

  return (
    <Page
      pageName={t('PAGES.PROVIDE_ACTUAL_DKO')}
      backRoute={`/processes/pon/provide-actual-dko/${uid}`}
      loading={loading}
      notFoundMessage={notFound && t('REQUEST_NOT_FOUND')}
    >
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 24 }}>
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
      <TableContainer component={Paper} className={classes.table} elevation={0}>
        <Table size="small" data-marker={'AM_table'}>
          <TableHead>
            <TableRow data-marker={'hour'}>
              <TableCell align={'center'}>{data?.data[0]?.date + ' (1-12)'}</TableCell>
              {data?.data[0]?.data?.slice(0, 12)?.map((time) => (
                <TableCell key={time?.hour} align={'center'} style={{ minWidth: 80 }} data-marker={time?.hour}>
                  {time?.hour}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow data-marker={'IN'}>
              <TableCell variant={'head'} align={'center'}>
                IN
              </TableCell>
              {data?.data[0]?.data?.slice(0, 12)?.map((time, index) => (
                <TableCell
                  key={'body_in_' + time.hour}
                  align={'center'}
                  style={{ minWidth: 80 }}
                  data-marker={index + 1}
                >
                  {time?.in || '-'}
                </TableCell>
              ))}
            </TableRow>
            <TableRow data-marker={'OUT'}>
              <TableCell variant={'head'} align={'center'}>
                OUT
              </TableCell>
              {data?.data[0]?.data?.slice(0, 12)?.map((time, index) => (
                <TableCell
                  key={'body_out_' + time.hour}
                  align={'center'}
                  style={{ minWidth: 80 }}
                  data-marker={index + 1}
                >
                  {time?.out || '-'}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
        <Table size="small" data-marker={'PM_table'}>
          <TableHead>
            <TableRow data-marker={'hour'}>
              <TableCell align={'center'}>{data?.data[0]?.date + ' (13-24)'}</TableCell>
              {data?.data[0]?.data?.slice(12)?.map((time) => (
                <TableCell key={time?.hour} align={'center'} style={{ minWidth: 80 }} data-marker={time?.hour}>
                  {time?.hour}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow data-marker={'IN'}>
              <TableCell variant={'head'} align={'center'}>
                IN
              </TableCell>
              {data?.data[0]?.data?.slice(12)?.map((time, index) => (
                <TableCell
                  key={'body_in_' + time.hour}
                  align={'center'}
                  style={{ minWidth: 80 }}
                  data-marker={index + 13}
                >
                  {time?.in || '-'}
                </TableCell>
              ))}
            </TableRow>
            <TableRow data-marker={'OUT'}>
              <TableCell variant={'head'} align={'center'}>
                OUT
              </TableCell>
              {data?.data[0]?.data?.slice(12)?.map((time, index) => (
                <TableCell
                  key={'body_out_' + time.hour}
                  align={'center'}
                  style={{ minWidth: 80 }}
                  data-marker={index + 13}
                >
                  {time?.out || '-'}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
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

export default connect(mapStateToProps)(ProvideActualDkoDetails);
