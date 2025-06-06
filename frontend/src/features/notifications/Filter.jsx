import { useTranslation } from 'react-i18next';
import { useNotificationTemplatesQuery } from './api';
import { Autocomplete, Stack, TextField } from '@mui/material';
import moment from 'moment';
import DatePicker from '../../Components/Theme/Fields/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { BlueButton } from '../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../Components/Theme/Buttons/GreenButton';
import Dialog from '@mui/material/Dialog';
import * as React from 'react';
import { useState } from 'react';
import { toggleFilter } from './slice';
import Slide from '@mui/material/Slide';
import SelectField from '../../Components/Theme/Fields/SelectField';

const OPTIONS = {
  ACTIVE_CUSTOMER_AP: 'GROUPS.ACTIVE_CUSTOMER_AP',
  DELETION_ARCHIVING_AP: 'GROUPS.DELETE_ARCHIVE_AP',
  END_SUPPLY: 'GROUPS.END_SUPPLY',
  REQUEST_DKO: 'NOTIFICATIONS.REQUEST_DKO',
  CHANGE_SUPPLIER: 'GROUPS.SUPPLIER_TO_SUPPLIER',
  CHANGE_SUPPLIER_TO_SLR: 'GROUPS.CHANGE_SUPPLIER_TO_PON',
  PUP: 'NOTIFICATIONS.PUP',
  CORRECTION_ARCHIVING_TS: 'GROUPS.CORRECTION_ARCHIVING_TS',
  MANAGER_OF_PROCESSING_PROCESSES_DKO: 'PAGES.PROCESS_MANAGER',
  OBTAINING_YOUR_OWN_AP: 'GROUPS.EXPORT_TKO',
  CONNECT_DISCONNECT_AP: 'GROUPS.CONNECT_DISCONNECT_TKO',
  EXTENSION_OF_THE_CONTRACT_TERM: 'GROUPS.PROLONGATION_TKO_END_SUPPLYING',
  REGISTRATION_OF_PPKO: 'NOTIFICATIONS.REGISTRATION_OF_PPKO',
  SERVICE_MESSAGES: 'NOTIFICATIONS.SERVICE_MESSAGES',
  SYSTEM_REQUESTS: 'NOTIFICATIONS.SYSTEM_REQUESTS',
  DISPUTES_OVER_THE_CHARACTERISTICS_AND_DKO_FOR_AP: 'PAGES.DISPUTES',
  MS_TS_CHECK_TS_BY_Z: 'NOTIFICATIONS.MS_TS_CHECK_TS_BY_Z',
  MS_TS_CHECK_TS_BY_ZV: 'NOTIFICATIONS.MS_TS_CHECK_TS_BY_ZV',
  TERMINATION_METERING_SERVICE: 'NOTIFICATIONS.TERMINATION_METERING_SERVICE'
};

const Filter = ({ onChange }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const open = useSelector((store) => store.notifications.openFilter);
  const { data } = useNotificationTemplatesQuery(null, { skip: !open });
  const [state, setState] = useState({ template: null, type: 'all', date: null });
  const right = window.innerWidth > 2000 ? (window.innerWidth - 1800) / 2 : 20;

  const handleClose = () => {
    if (open) {
      dispatch(toggleFilter());
    }
  };

  const handleChangeTemplate = (e, template) => {
    setState((state) => ({ ...state, template }));
  };

  const handleChange = (type) => {
    setState((state) => ({ ...state, type }));
  };

  const handleChangeDate = (date) => {
    setState((state) => ({ ...state, date }));
  };

  const handleReset = () => {
    setState({ template: null, type: 'all', date: null });
    onChange({
      template_group: undefined,
      created_at: undefined,
      read: undefined
    });
    handleClose();
  };

  const handleSubmit = () => {
    const { template, type, date } = state;
    const reads = ['read', 'unread'];
    onChange({
      template_group: template?.group || undefined,
      created_at: date && moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : undefined,
      read: reads.includes(type) ? type === 'read' : undefined
    });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          position: 'absolute',
          borderRadius: 2,
          zIndex: 3,
          right,
          top: 35,
          p: 3,
          pt: 4,
          width: 600,
          maxWidth: '85vw'
        }
      }}
      TransitionComponent={Transition}
    >
      <Stack spacing={3}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={data ?? []}
          getOptionLabel={(option) => t(OPTIONS[option.group])}
          getOptionKey={(option) => option.group}
          noOptionsText={t('NOTHING_FOUND')}
          value={state.template || null}
          onChange={handleChangeTemplate}
          ListboxProps={{ sx: { maxHeight: 200 } }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('FIELDS.TEMPLATE')}
              inputProps={{
                ...params.inputProps,
                'data-marker': 'template-input'
              }}
            />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} data-marker={'template-option'}>
                {t(OPTIONS[option.group])}
              </li>
            );
          }}
        />
        <SelectField
          dataMarker={'type'}
          onChange={handleChange}
          label={t('FIELDS.TYPE')}
          withAll
          value={state.type || null}
          data={[
            { label: 'NOTIFICATIONS.READ', value: 'read' },
            { label: 'NOTIFICATIONS.UNREAD', value: 'unread' }
          ]}
        />
        <DatePicker
          onChange={handleChangeDate}
          label={t('FIELDS.DATE')}
          maxDate={moment()}
          value={state.date ?? null}
          dataMarker={'date'}
        />
        <Stack direction={'row'} spacing={2} justifyContent={'stretch'} sx={{ pt: 3 }}>
          <BlueButton data-marker={'button_reset'} fullWidth onClick={handleReset}>
            {t('CONTROLS.RESET')}
          </BlueButton>
          <GreenButton data-marker={'button_apply'} fullWidth onClick={handleSubmit}>
            {t('CONTROLS.APPLY')}
          </GreenButton>
        </Stack>
      </Stack>
    </Dialog>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default Filter;
