import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import Statuses from '../../../Components/Theme/Components/Statuses';
import Grid from '@material-ui/core/Grid';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import { useCreateActivateDeactivateTkoMutation } from './api';
import { ACTION_TYPES, ACTIVATE_AP_LOG, DEACTIVATE_AP_LOG } from './data';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from "../../../i18n/i18n";
import useInitProcessLog from '../../../services/actionsLog/useInitProcessLog';

const process_types = [
  { value: ACTION_TYPES.activating, label: i18n.t('ACTIVATING_AP')},
  { value: ACTION_TYPES.deactivating, label: i18n.t('DEACTIVATING_AP') }
];

const pointTypesList = [
  { value: 'InstallationAccountingPoint', label: 'POINT_TYPE.InstallationAccountingPoint' },
  { value: 'SubmeteringPoint', label: 'POINT_TYPE.SubmeteringPoint' }
];

export const useDatePickerStyles = makeStyles(() => ({
  root: {
    '& .MuiInputBase-root.MuiOutlinedInput-root>input': {
      color: '#4A5B7A'
    }
  }
}));

export const ACTIVATING_DEACTIVATING_INITIALIZATION_ACCEPT_ROLES = ['АТКО'];

const ActivateDeactivateTKO = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const classes = useDatePickerStyles();
  const { full_name, activeOrganization } = useSelector(({ user }) => user);
  const [create, { isFetching: isCreating, error }] = useCreateActivateDeactivateTkoMutation();
  const [processType, setProcessType] = useState(null);
  const [pointType, setPointType] = useState(null);
  const initProcessLog = useInitProcessLog();

  const onChangeActionType = (status) => {
    setProcessType(status);
  };

  const handleInit = () => {
    create(processType === ACTION_TYPES.activating ? {
      process_type: processType,
      point_type: pointType
    } : {process_type: processType}).then((res) => {
      initProcessLog(processType === ACTION_TYPES.activating ? ACTIVATE_AP_LOG : DEACTIVATE_AP_LOG, res?.data?.uid);
      navigate(`/processes/activating-deactivating/${res?.data?.uid}`);
    });
  };

  return (
    <>
      <Page
        pageName={t('PAGES.ACTIVATE_DEACTIVATE_AP')}
        backRoute={'/processes'}
        faqKey={'PROCESSES__ACTIVATING_DEACTIVATING_AP'}
        loading={isCreating}
        acceptPermisions={'PROCESSES.ACTIVATING_DEACTIVATING.INITIALIZATION'}
        acceptRoles={ACTIVATING_DEACTIVATING_INITIALIZATION_ACCEPT_ROLES}
        controls={
          <>
            <CircleButton type={'create'} title={t('CONTROLS.TAKE_TO_WORK')} onClick={handleInit} disabled={!pointType && processType === ACTION_TYPES.activating || !processType}
            />
          </>
        }
      >
        <Statuses statuses={['NEW', 'IN_PROCESS', 'FORMED', 'DONE', 'CANCELED']} currentStatus={'NEW'} />
        <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 16 }}>
          <Grid container spacing={3} alignItems={'flex-start'}>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.USER_INITIATOR')} readOnly value={full_name} />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.START_WORK_DATE')} disabled value={null} />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.FORMED_AT')} disabled value={null} />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <StyledInput label={t('FIELDS.COMPLETE_DATETIME')} disabled value={null} />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <SelectField onChange={onChangeActionType} value={processType} label={'Тип дії'} data={process_types} />
            </Grid>
            <Grid item xs={12} md={6} lg={3} className={classes.root}>
              <StyledInput label={t('FIELDS.PLANNED_DATE_OF_ACTION_AP')} disabled value={null} />
            </Grid>
            <Grid item xs={12} md={6} lg={6} className={classes.root}>
              <StyledInput label={t('FIELDS.INITIATOR_COMPANY')} disabled value={activeOrganization?.name} />
            </Grid>
            {
              processType === ACTION_TYPES.activating &&
              <Grid item xs={12} md={6} lg={3}>
                <SelectField
                  dataMarker={'point_type'}
                  label={t('FIELDS.POINT_TYPE')}
                  data={pointTypesList}
                  value={pointType}
                  onChange={setPointType}
                  error={error?.data?.point_type}
                />
              </Grid>
            }
          </Grid>
        </div>
      </Page>
    </>
  );
};

export default ActivateDeactivateTKO;
