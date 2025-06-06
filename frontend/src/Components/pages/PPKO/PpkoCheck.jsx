import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { clearPpkoCheck, getPpkoCheckById, savePpkoCheck, updatePpkoCheck } from '../../../actions/ppkoActions';
import Page from '../../Global/Page';
import CancelModal from '../../Modal/CancelModal';
import CircleButton from '../../Theme/Buttons/CircleButton';
import DatePicker from '../../Theme/Fields/DatePicker';
import RadioGroupButton from '../../Theme/Fields/RadioGroupButton';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative'
  },
  error: {
    color: '#f90000',
    fontSize: 10,
    lineHeight: 1.2,
    margin: '0 14px',
    position: 'absolute',
    bottom: '-100%',
    left: 0
  }
}));

const PpkoCheck = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  let { id } = useParams();
  let { hash } = useLocation();
  const navigate = useNavigate();
  const { error, ppkoCheck } = useSelector(({ ppko }) => ppko);
  const [modalState, setModalState] = useState(false);
  const [result, setResult] = useState({
    ppko: null,
    last_check_date: null,
    warning: null,
    repeated_warning: null,
    sanctions: null
  });

  useEffect(() => {
    if (id && hash.substring(1)) {
      dispatch(getPpkoCheckById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (ppkoCheck) {
      setResult({ ...ppkoCheck, id: +hash.substring(1) });
    }
  }, [dispatch, ppkoCheck]);

  useEffect(() => {
    return () => dispatch(clearPpkoCheck());
  }, [dispatch]);

  const handleSaveCheck = () => {
    if (ppkoCheck === null) {
      dispatch(savePpkoCheck({ ...result, ppko: +id }, (link) => navigate(`/ppko/check/${link}#${id}`)));
    } else {
      dispatch(updatePpkoCheck(result, id));
    }
  };

  const handleRedirect = () => {
    setModalState(false);
    navigate(`/ppko/${hash.substring(1) ? hash.substring(1) : id}`);
  };

  const handleOpenWarningModal = () => {
    if (
      ppkoCheck !== null &&
      (result.last_check_date !== ppkoCheck.last_check_date ||
        result.warning !== ppkoCheck.warning ||
        result.repeated_warning !== ppkoCheck.repeated_warning ||
        result.sanctions !== ppkoCheck.sanctions)
    ) {
      setModalState(true);
    } else if (
      ppkoCheck === null &&
      (result.last_check_date !== null ||
        result.warning !== null ||
        result.repeated_warning !== null ||
        result.sanctions !== null)
    ) {
      setModalState(true);
    } else {
      navigate(`/ppko/${hash.substring(1) ? hash.substring(1) : id}`);
    }
  };

  const handleCloseModal = () => {
    setModalState(false);
  };

  return (
    <Page
      pageName={t('PAGES.PPKO_CHECK')}
      backRoute={handleOpenWarningModal}
      controls={<CircleButton type={'create'} title={t('CONTROLS.SAVE')} onClick={handleSaveCheck} />}
    >
      <div className={'ppko-form'}>
        <section>
          <h4>{t('PPKO_CHECK_RESULT')}</h4>
          <div className={'form-section'}>
            <Grid container spacing={3}>
              <Grid item xs={2}>
                <Picker
                  label={t('PPKO_CHECK_RESULT_DATA.LAST_CHECK_DATE')}
                  value={result?.last_check_date}
                  maxDate={moment()}
                  onChange={(v) =>
                    setResult({
                      ...result,
                      last_check_date: v
                    })
                  }
                  error={error?.response?.data?.last_check_date}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container alignItems={'center'}>
                  <Grid item xs={4} className={classes.root}>
                    <p style={{ marginBottom: 0 }}>{t('PPKO_CHECK_RESULT_DATA.CHECK_WARNING')}</p>
                    {error?.response?.data?.warning && (
                      <span className={classes.error}>{error?.response?.data?.warning}</span>
                    )}
                  </Grid>
                  <Grid item xs={1}>
                    <RadioGroupButton
                      value={'–  ТАК'}
                      label={`–  ${t('CONTROLS.YES').toUpperCase()}`}
                      data-marker={`warning`}
                      data-status={`warning-${result.warning === null ? false : result.warning}`}
                      onChange={() => setResult({ ...result, warning: true })}
                      checked={result.warning === null ? false : result.warning}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <RadioGroupButton
                      value={'–  НІ'}
                      label={`–  ${t('CONTROLS.NO').toUpperCase()}`}
                      data-marker={`warning`}
                      data-status={`warning-${result.warning === null ? false : !result.warning}`}
                      onChange={() => setResult({ ...result, warning: false })}
                      checked={result.warning === null ? false : !result.warning}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container alignItems={'center'}>
                  <Grid item xs={4} className={classes.root}>
                    <p style={{ marginBottom: 0 }}>{t('PPKO_CHECK_RESULT_DATA.CHECK_REPEATED_WARNING')}</p>
                    {error?.response?.data?.repeated_warning && (
                      <span className={classes.error}>{error?.response?.data?.repeated_warning}</span>
                    )}
                  </Grid>
                  <Grid item xs={1}>
                    <RadioGroupButton
                      value={'–  ТАК'}
                      label={`–  ${t('CONTROLS.YES').toUpperCase()}`}
                      data-marker={`repeated_warning`}
                      data-status={`repeated_warning-${
                        result.repeated_warning === null ? false : result.repeated_warning
                      }`}
                      onChange={() => setResult({ ...result, repeated_warning: true })}
                      checked={result.repeated_warning === null ? false : result.repeated_warning}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <RadioGroupButton
                      value={'–  НІ'}
                      label={`–  ${t('CONTROLS.NO').toUpperCase()}`}
                      data-marker={`repeated_warning`}
                      data-status={`repeated_warning-${
                        result.repeated_warning === null ? false : !result.repeated_warning
                      }`}
                      onChange={() => setResult({ ...result, repeated_warning: false })}
                      checked={result.repeated_warning === null ? false : !result.repeated_warning}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container alignItems={'center'}>
                  <Grid item xs={4} className={classes.root}>
                    <p style={{ marginBottom: 0 }}>{t('PPKO_CHECK_RESULT_DATA.SANCTIONS_AFTER_CHECK')}</p>
                    {error?.response?.data?.sanctions && (
                      <span className={classes.error}>{error?.response?.data?.sanctions}</span>
                    )}
                  </Grid>
                  <Grid item xs={1}>
                    <RadioGroupButton
                      value={'–  ТАК'}
                      label={`–  ${t('CONTROLS.YES').toUpperCase()}`}
                      data-marker={`sanctions`}
                      data-status={`sanctions-${result.sanctions === null ? false : result.sanctions}`}
                      onChange={() => setResult({ ...result, sanctions: true })}
                      checked={result.sanctions === null ? false : result.sanctions}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <RadioGroupButton
                      value={'–  НІ'}
                      label={`–  ${t('CONTROLS.NO').toUpperCase()}`}
                      data-marker={`sanctions`}
                      data-status={`sanctions-${result.sanctions === null ? false : !result.sanctions}`}
                      onChange={() => setResult({ ...result, sanctions: false })}
                      checked={result.sanctions === null ? false : !result.sanctions}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <CancelModal
            text={t('CONFIRM_LEAVE_PPKO_CHECK')}
            open={modalState}
            onClose={handleCloseModal}
            onSubmit={handleRedirect}
          />
        </section>
      </div>
    </Page>
  );
};

const Picker = ({ onChange, value, ...props }) => {
  const handleOnChange = (v) => {
    if (v && moment(v).isValid()) {
      onChange(v);
    }
    if (!v) {
      onChange(null);
    }
  };

  return <DatePicker {...props} value={value ? moment(value) : null} onChange={handleOnChange} />;
};

export default PpkoCheck;
