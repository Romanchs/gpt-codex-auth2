import { useEffect, useState } from 'react';
import { BlueButton } from '../../Theme/Buttons/BlueButton';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import { ModalWrapper } from '../../Modal/ModalWrapper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { StyledSwitch } from '../../Theme/Fields/StyledSwitch';
import SelectField from '../../Theme/Fields/SelectField';
import { useDispatch, useSelector } from 'react-redux';
import { clearAdminError, updateApiKey } from '../../../actions/adminActions';
import StyledInput from '../../Theme/Fields/StyledInput';
import CircleButton from '../../Theme/Buttons/CircleButton';
import { Chip } from '@material-ui/core';
import { GreenButton } from '../../Theme/Buttons/GreenButton';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 24,
    '&>label': {
      display: 'block',
      marginBottom: 8
    }
  },
  userType: {
    marginTop: 8,
    marginBottom: 16
  },
  apiKeys: {
    '&>p': {
      marginTop: 8,
      color: '#6C7D9A',
      fontSize: 11,
      fontWeight: 'bold',
      paddingBottom: 4
    },
    '&>span': {
      display: 'flex',
      alignItems: 'start',

      '&>code': {
        display: 'block',
        color: '#fff',
        backgroundColor: '#555',
        padding: 3,
        borderRadius: 2
      },

      '&>button': {
        marginLeft: 12
      }
    }
  },
  addIP: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&>span': {
      marginLeft: 16,
      marginTop: 1
    }
  },
  ipRow: {
    display: 'flex',
    marginTop: 4,
    marginBottom: 8,
    alignItems: 'center',

    '&>p': {
      marginRight: 16
    }
  }
}));

const user_types = [
  {
    value: 1,
    label: 'FIELDS.ACTIVE_USER'
  },
  {
    value: 3,
    label: 'FIELDS.TECHNICAL_USER'
  }
];

const SecuritySettings = ({ security, currentUser, onChange }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const error = useSelector(({ admin }) => admin.error?.response?.data);
  const { esign_required, otp_required, esign_org_required, user_type, ip_addresses, tax_id } = security;
  const classes = useStyles();
  const [newIpValue, setNewIpValue] = useState('');
  const [newTaxId, setNewTaxId] = useState('');
  const [newTaxIdError, setNewTaxIdError] = useState('');
  const [newIpError, setNewIpError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleUpdateApiKey = () => {
    dispatch(updateApiKey(currentUser?.uid));
  };

  useEffect(() => {
    setNewIpError(null);
  }, [newIpValue]);

  useEffect(() => {
    setNewTaxIdError(error?.tax_id ?? '');
    if (error && Object.keys(error).length === 1 && Object.keys(error)[0] === 'tax_id') {
      setOpen(true);
    }
  }, [error]);

  const handleAddNewIP = () => {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        newIpValue
      ) ||
      /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.test(
        newIpValue
      )
    ) {
      if (!ip_addresses) {
        onChange({ ...security, ip_addresses: [newIpValue] });
      } else if (ip_addresses.find((i) => i === newIpValue)) {
        setNewIpError(t('VERIFY_MSG.IPN_ADRESS_IS_USED'));
      } else {
        onChange({ ...security, ip_addresses: [...ip_addresses, newIpValue] });
        setNewIpError(null);
      }
    } else {
      setNewIpError(t('VERIFY_MSG.INVALID_IP_ADDRESS_FORMAT'));
    }
  };

  const handleAddNewTaxId = () => {
    if (!tax_id.find((i) => i === newTaxId)) {
      setNewTaxId('');
      setNewTaxIdError('');
      onChange({ ...security, tax_id: [...tax_id, newTaxId] });
    } else {
      setNewTaxIdError(t('VERIFY_MSG.IPN_IS_USED'));
    }
  };

  const handleRemove = (ip) => {
    onChange({ ...security, ip_addresses: ip_addresses.filter((i) => i !== ip) });
  };

  return (
    <>
      <BlueButton style={{ marginTop: 3, width: '100%' }} onClick={() => setOpen(true)}>
        <SettingsRounded />
        {t('CONTROLS.ADDITIONAL_SETTINGS')}
      </BlueButton>
      <ModalWrapper open={open} onClose={() => setOpen(false)} header={t('CONTROLS.ADDITIONAL_SETTINGS')}>
        <div className={classes.root}>
          <div className={classes.userType}>
            <SelectField
              data={user_types}
              disabled={Boolean(currentUser?.uid)}
              onChange={(code) => onChange({ ...security, user_type: { code }, tax_id: [] })}
              value={user_type.code}
            />
          </div>
          {user_type.code < 3 && (
            <>
              <StyledInput
                style={{ marginBottom: 24 }}
                max={10}
                label={t('FIELDS.TAX_ID_OR_PASSPORT_NUMBER')}
                value={tax_id[0]}
                dataMarker={'tax_id'}
                error={newTaxIdError}
                onChange={({ target }) => {
                  if (/^[А-Яа-яёЁЇїІіЄєҐґ0-9]+$/.test(target.value) || !target.value) {
                    onChange({ ...security, tax_id: target.value ? [target.value] : [] });
                    setNewTaxIdError('');
                    dispatch(clearAdminError());
                  }
                }}
              />
              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={esign_required}
                    data-marker={`swich-${esign_required ? 'on' : 'off'}`}
                    onChange={() =>
                      !esign_required &&
                      onChange({
                        ...security,
                        esign_required: true,
                        otp_required: false,
                        esign_org_required: false
                      })
                    }
                  />
                }
                label={t('CONTROLS.LOGIN_BY_ELRCTRONIC_SIGNATURE')}
              />
              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={esign_org_required}
                    data-marker={`swich-${esign_required ? 'on' : 'off'}`}
                    onChange={() =>
                      !esign_org_required &&
                      onChange({
                        ...security,
                        esign_required: false,
                        otp_required: false,
                        esign_org_required: true
                      })
                    }
                  />
                }
                label={t('CONTROLS.LOGIN_BY_ORGANIZATION_ELRCTRONIC_SIGNATURE')}
              />
              <FormControlLabel
                control={
                  <StyledSwitch
                    checked={otp_required}
                    data-marker={`swich-${otp_required ? 'on' : 'off'}`}
                    onChange={() =>
                      !otp_required &&
                      onChange({
                        ...security,
                        esign_required: false,
                        otp_required: true,
                        esign_org_required: false
                      })
                    }
                  />
                }
                label={t('CONTROLS.LOGIN_WITH_2_FA')}
              />
            </>
          )}
          {user_type.code === 3 && (
            <div className={classes.apiKeys}>
              <span className={classes.addIP}>
                <StyledInput
                  label={t('FIELDS.API_KEY')}
                  value={currentUser?.tech_users_keys || ''}
                  disabled
                  error={!currentUser?.tech_users_keys && `* ${t('WILL_BE_GENERATED_AFTER_SAVE')}`}
                />
                <CircleButton
                  type={'refresh'}
                  onClick={handleUpdateApiKey}
                  title={t('FIELDS.UPDATE_KEY')}
                  dataMarker={'renew'}
                  disabled={!currentUser?.tech_users_keys}
                />
              </span>
              <span className={classes.addIP}>
                <StyledInput
                  label={t('FIELDS.ADD_TAX_ID')}
                  value={newTaxId}
                  onChange={({ target }) => {
                    if (/^\d+$/.test(target.value) || !target.value) {
                      setNewTaxId(target.value);
                      setNewTaxIdError('');
                    }
                  }}
                  max={10}
                  error={newTaxIdError}
                />
                <CircleButton
                  type={'add'}
                  onClick={handleAddNewTaxId}
                  title={t('CONTROLS.ADD')}
                  disabled={newTaxId?.length < 10}
                  dataMarker={'add_tax'}
                />
              </span>
              {tax_id.length > 0 && (
                <>
                  <p>{t('FIELDS.TAX_IDS_LIST') + ':'}</p>
                  <Stack direction={'row'} spacing={1} sx={{ mb: 3 }} useFlexGap flexWrap={'wrap'}>
                    {tax_id.map((id) => (
                      <Chip
                        data-marker={'tax_id'}
                        key={id}
                        label={id}
                        color={'primary'}
                        onDelete={() => onChange({ ...security, tax_id: tax_id.filter((i) => i !== id) })}
                      />
                    ))}
                  </Stack>
                </>
              )}
              <span className={classes.addIP}>
                <StyledInput
                  label={t('FIELDS.ADD_IP')}
                  value={newIpValue}
                  onChange={({ target }) => setNewIpValue(target.value)}
                  error={newIpError}
                  max={48}
                />
                <CircleButton
                  type={'add'}
                  onClick={handleAddNewIP}
                  title={t('CONTROLS.ADD')}
                  disabled={newIpValue?.length < 8 || newIpError}
                  dataMarker={'add_ip'}
                />
              </span>
              {ip_addresses?.length > 0 && (
                <>
                  <p>{t('ALLOWED_IPS') + ':'}</p>
                  <Stack direction={'row'} spacing={1} useFlexGap flexWrap={'wrap'}>
                    {ip_addresses.map((ip) => (
                      <Chip
                        data-marker={'ip'}
                        key={ip}
                        label={ip}
                        color={'primary'}
                        onDelete={() => handleRemove(ip)}
                      />
                    ))}
                  </Stack>
                </>
              )}
            </div>
          )}
        </div>
        <GreenButton onClick={() => setOpen(false)} fullWidth style={{ marginTop: 28 }}>
          {t('CONTROLS.OK')}
        </GreenButton>
      </ModalWrapper>
    </>
  );
};

export default SecuritySettings;
