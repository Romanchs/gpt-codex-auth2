import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { changeSupplierInformingAkoInforming, clearCurrentProcess } from '../../../../actions/processesActions';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { useTranslation } from 'react-i18next';

const InformingAkoInforming = () => {
  const {t} = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uid } = useParams();
  const { currentProcess } = useSelector(({ processes }) => processes);

  useEffect(() => {
    dispatch(changeSupplierInformingAkoInforming(uid));
    return () => dispatch(clearCurrentProcess());
  }, [dispatch]);

  const requestsData = [
    {
      title: t('PREDICTABLE_CONSUMPTION_ODKO'),
      data: currentProcess?.predictable_consumption,
      type: 'predictable-consumption-odko'
    },
    {
      title: t('INFORMING_ATKO_FOR_CHANGE_SUPPLIER'),
      data: currentProcess?.informing_atko,
      type: 'informing-atko-for-change-supplier'
    },
    {
      title: t('CURRENT_SUPPLIER'),
      data: currentProcess?.informing_current_supplier,
      type: 'informing-current-supplier'
    },
    {
      title: t('REQUEST_ACTUAL_DKO'),
      data: currentProcess?.request_actual_dko,
      type: 'request-actual-dko'
    }
  ];

  const handleClick = (type) => () => {
    navigate(`/processes/informing-ako/${uid}/${type}`);
  };

  return (
    <div className={classes.root}>
      <Grid container alignItems={'center'} spacing={2}>
        {requestsData.map(({ title = '', data = null, type = '' }, index) => (
          <Grid item xs={12} sm={6} lg={3} key={'requestsData' + index}>
            <h4 className={classes.title}>{title}</h4>
            <div className={classes.dataBlock}>
              <div className={classes.data}>
                <div>
                  <span>{t('IN_TOTAL')}:</span>
                  <span data-marker={'all'}>{data?.all || 0}</span>
                </div>
                <div>
                  <span>{t('DONE')}:</span>
                  <span className={'success--light'} data-marker={'done'}>
                    {data?.done || 0}
                  </span>
                </div>
                <div>
                  <span>{t('NOT_DONE')}:</span>
                  <span className={'orange'} data-marker={'reject'}>
                    {data?.not_done || 0}
                  </span>
                </div>
              </div>
              <CircleButton type={'next'} onClick={handleClick(type)} size={'small'} title={t('CONTROLS.VIEW_DETAILS')} />
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default InformingAkoInforming;

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 18
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
          fontSize: 13,
          fontWeight: 400
        }
      }
    }
  }
}));
