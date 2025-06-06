import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearCurrentProcess, initConnectDisconnect } from '../../../../actions/processesActions';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import Statuses from '../../../Theme/Components/Statuses';
import DatePicker from '../../../Theme/Fields/DatePicker';
import SelectField from '../../../Theme/Fields/SelectField';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { DISCONNECTION_REASONS } from './data';
import { useTranslation } from 'react-i18next';

export const ACTION_TYPES = {
  connected: 'CONNECT_TKO',
  disconnect: 'DISCONNECT_TKO'
};

export const useDatePickerStyles = makeStyles(() => ({
  root: {
    '& .MuiInputBase-root.MuiOutlinedInput-root>input': {
      color: '#4A5B7A'
    }
  }
}));

export const CONNECTING_DISCONNECTING_INITIALIZATION_ACCEPT_ROLES = ['АТКО'];

const ConnectingDisconnectingTKO = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const classes = useDatePickerStyles();
  const {
    activeOrganization,
    activeRoles: [{ relation_id }],
    full_name
  } = useSelector(({ user }) => user);
  const { loading, error } = useSelector(({ processes }) => processes);
  const [dataForInit, setDataForInit] = useState({
    action_type: 'CONNECT_TKO'
  });

  // Check roles & get data
  useEffect(() => {
    if (!checkPermissions('PROCESSES.CONNECTING_DISCONNECTING.INITIALIZATION', CONNECTING_DISCONNECTING_INITIALIZATION_ACCEPT_ROLES)) {
      navigate('/processes');
    }
  }, [dispatch, navigate, relation_id]);

  // Clear store after unmount
  useEffect(() => () => dispatch(clearCurrentProcess()), [dispatch]);

  const handleChangeType = (status) => {
    const newData = {};
    Object.entries(dataForInit).forEach(({ key, value }) => {
      if (status === ACTION_TYPES.disconnect && key === 'reason') {
        return;
      }
      newData[key] = value;
    });
    setDataForInit({
      ...newData,
      action_type: status === ACTION_TYPES.disconnect ? 'DISCONNECT_TKO' : 'CONNECT_TKO'
    });
  };

  const handleInit = () => {
    dispatch(initConnectDisconnect(dataForInit, (uid) => navigate(`/processes/connecting-disconnecting/${uid}`)));
  };

  return (
    <Page
      pageName={t('PAGES.CONNECT_DISCONNECT')}
      backRoute={'/processes'}
      faqKey={'PROCESSES__CONNECTING_DISCONNECTING'}
      loading={loading}
      controls={
        <CircleButton
          type={'create'}
          title={t('CONTROLS.TAKE_TO_WORK')}
          onClick={handleInit}
          disabled={loading || (dataForInit.action_type === 'DISCONNECT_TKO' && !dataForInit.reason)}
        />
      }
    >
      <Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'COMPLETED', 'CANCELED']} currentStatus={'NEW'} />
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
        <Grid container spacing={3} alignItems={'flex-start'}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.USER_INITIATOR')} readOnly value={full_name} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.FORMED_AT')} disabled value={null} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <StyledInput label={t('FIELDS.COMPLETE_DATETIME')} disabled value={null} />
          </Grid>
          {dataForInit.action_type === ACTION_TYPES.disconnect && (
            <Grid item xs={12} md={6} lg={3}>
              <SelectField
                onChange={(reason) => setDataForInit({ ...dataForInit, reason })}
                data={DISCONNECTION_REASONS.filter(
                  ({ value }) => value !== 'termination_of_supply' && value !== 'debt'
                )}
                label={t('FIELDS.DISCONNECTED_REASON')}
                value={dataForInit.reason}
                error={error?.reason}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} readOnly value={activeOrganization?.name} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <SelectField
              onChange={handleChangeType}
              data={[
                { value: ACTION_TYPES.connected, label: t('CONNECTION') },
                { value: ACTION_TYPES.disconnect, label: t('DISCONNECTION') }
              ]}
              label={t('FIELDS.ACTION_TYPE')}
              value={dataForInit.action_type}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} className={classes.root}>
            <DatePicker
              label={dataForInit.action_type === ACTION_TYPES.disconnect ? t('FIELDS.MUST_BE_DISCONNECTED_AT') : t('FIELDS.MUST_BE_CONNECTED_AT')}
              disabled
            />
          </Grid>
        </Grid>
      </div>
    </Page>
  );
};

export default ConnectingDisconnectingTKO;
