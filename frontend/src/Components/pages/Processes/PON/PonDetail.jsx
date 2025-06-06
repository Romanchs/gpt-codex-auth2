import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import CircleButton from '../../../Theme/Buttons/CircleButton';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 24
  },
  title: {
    color: '#0D244D',
    fontSize: 15,
    lineHeight: 1.2,
    fontWeight: 400,
    marginBottom: 16,
    paddingLeft: 4
  },
  dataBlock: {
    backgroundColor: '#344A8B',
    borderRadius: 8,
    padding: '8px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  data: {
    width: '90%',
    marginRight: 8,
    '&>div': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#fff',
      borderBottom: '1px solid #D1EDF3',
      '&:last-child': {
        borderBottom: 'none'
      },
      '&>span': {
        flex: '40px',
        fontSize: 18,
        fontWeight: 300,
        lineHeight: '31px',
        textAlign: 'center',
        '&:first-child': {
          textAlign: 'left',
          lineHeight: '12px',
          flex: 25,
          fontSize: 11,
          fontWeight: 400
        }
      }
    }
  },
  defaultBlock: {
    width: '100%',
    marginRight: 8,
    '&>div': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#fff',
      borderBottom: '1px solid #D1EDF3',
      '&:last-child': {
        borderBottom: 'none'
      },
      '&>span': {
        position: 'relative',
        flex: '82px',
        width: 82,
        fontSize: 18,
        fontWeight: 300,
        lineHeight: '31px',
        textAlign: 'center',
        '&:first-child': {
          width: 'auto',
          textAlign: 'left',
          lineHeight: '12px',
          fontSize: 11,
          fontWeight: 400
        }
      }
    }
  },
  predefault: {
    borderRight: '1px solid #D1EDF3'
  },
  label: {
    display: 'block',
    position: 'absolute',
    width: 'calc(100% - 4px)',
    padding: '2px 3px',
    borderRadius: 5,
    fontSize: 10,
    lineHeight: 1,
    top: -15,
    left: 2,
    '&.predefault': {
      backgroundColor: '#68D060'
    },
    '&.default': {
      backgroundColor: '#EF936C'
    }
  },
  path: {
    backgroundColor: '#fff',
    marginLeft: 12,
    '&:hover': {
      backgroundColor: '#fff'
    }
  }
}));

export default function PonDetail({
  requests_tko_data,
  requests_historical_dko,
  requests_actual_dko,
  informing_pon,
  tko_number,
  uid
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = useStyles();

  const requestsData = [
    {
      title: requests_tko_data ? `${t('PON.REQUESTS_TKO_DATA')}:` : `${t('PON.TKO_LIST')}:`,
      data: requests_tko_data ? requests_tko_data : tko_number,
      path: `/processes/pon/${uid}/${requests_tko_data ? 'requests-tko-data/' : 'tko-list'}`
    },
    {
      title: `${t('PON.REQUESTS_HISTORICAL_DKO')}:`,
      data: requests_historical_dko,
      path: `/processes/pon/${uid}/requests-historical-dko/`
    },
    {
      title: `${t('PON.REQUESTS_ACTUAL_DKO')}:`,
      data: requests_actual_dko,
      path: `/processes/pon/${uid}/requests-actual-dko/`
    },
    {
      title: `${t('PON.INFORMING')}:`,
      data: informing_pon,
      path: `/processes/pon/${uid}/informing/`
    }
  ];

  return (
    <div className={classes.root}>
      <Grid container alignItems={'center'} spacing={2}>
        {requestsData.map(({ title, data, path }, index) => (
          <Grid item xs={12} sm={6} lg={3} key={'requestsData' + index}>
            <h4 className={classes.title}>{title}</h4>
            <div className={classes.dataBlock}>
              {title === `${t('PON.TKO_LIST')}:` ? (
                <PonDetailItemNumber data={tko_number} />
              ) : (
                <PonDetailItemData data={data} />
              )}
              <CircleButton
                type={'next'}
                onClick={() => navigate(path)}
                size={'small'}
                title={t('CONTROLS.VIEW_DETAILS')}
              />
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

const PonDetailItemNumber = ({ data }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.data}>
      <div style={{ height: 32 }}></div>
      <div>
        <span>{t('IN_TOTAL')}</span>
        <span data-marker={'all'}>{data}</span>
      </div>
      <div style={{ height: 31 }}></div>
    </div>
  );
};

const PonDetailItemData = ({ data }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div className={clsx(data?.default ? classes.defaultBlock : classes.data)}>
      <div>
        <span>{t('IN_TOTAL')}</span>
        {data?.default ? (
          <>
            <span className={classes.predefault}>
              <span className={clsx(classes.label, 'predefault')}>{t('SUPPLIERS.PRE_DEFAULT_STATUS')}</span>
              <span data-marker={'all-predefault'}>{data?.predefault?.all}</span>
            </span>
            <span>
              <span className={clsx(classes.label, 'default')}>{t('SUPPLIERS.DEFAULT_STATUS')}</span>
              <span data-marker={'all-default'}>{data?.default?.all}</span>
            </span>
          </>
        ) : (
          <span data-marker={'all'}>{data?.done + data?.not_done || 0}</span>
        )}
      </div>
      <div>
        <span>{t('DONE')}</span>
        {data?.default ? (
          <>
            <span className={clsx('success--light', classes.predefault)} data-marker={'done-predefault'}>
              {data?.predefault?.done}
            </span>
            <span className={'success--light'} data-marker={'done-default'}>
              {data?.default?.done}
            </span>
          </>
        ) : (
          <span className={'success--light'} data-marker={'done'}>
            {data?.done || 0}
          </span>
        )}
      </div>
      <div>
        <span>{t('NOT_DONE')}</span>
        {data?.default ? (
          <>
            <span className={clsx('orange', classes.predefault)} data-marker={'reject-predefault'}>
              {data?.predefault?.not_done}
            </span>
            <span className={'orange'} data-marker={'reject-default'}>
              {data?.default?.not_done}
            </span>
          </>
        ) : (
          <span className={'orange'} data-marker={'reject'}>
            {data?.not_done || 0}
          </span>
        )}
      </div>
    </div>
  );
};
