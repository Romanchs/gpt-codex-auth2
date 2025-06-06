import { CircularProgress } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import AutorenewRounded from '@mui/icons-material/AutorenewRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { gtsUpdateReportByZV, gtsVerifyZvCode } from '../../../../actions/gtsActions';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import { WhiteButton } from '../../../Theme/Buttons/WhiteButton';
import SelectField from '../../../Theme/Fields/SelectField';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';
import useImportFileLog from '../../../../services/actionsLog/useImportFileLog';
import { GTS_LOG_TAGS } from '../../../../services/actionsLog/constants';
import { setIsLoadTKO } from '../slice';

const ADD_ONE = 'ADD_ONE';
const ADD_ALL = 'ADD_ALL';

const VERIFY = {
  LOADING: 'VERIFY_LOADING',
  SUCCESS: 'VERIFY_SUCCESS',
  EMPTY: 'VERIFY_EMPTY'
};

const AddByZVDialog = (params) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { report_uid, loading } = useSelector(({ gts }) => gts);
  const [type, setType] = useState(ADD_ONE);
  const [value, setValue] = useState('');
  const [verifyState, setVerifyState] = useState('');
  const [uid, setUid] = useState('');

  const importFileLog = useImportFileLog(GTS_LOG_TAGS);

  const handleOnChange = ({ target: { value } }) => {
    if (verifyState === VERIFY.LOADING || value.length > 16) {
      return;
    }
    setValue(value);
    if (value.length === 16) {
      setVerifyState(VERIFY.LOADING);
      dispatch(
        gtsVerifyZvCode(
          value,
          (uid) => {
            setVerifyState(VERIFY.SUCCESS);
            setUid(uid);
          },
          () => setVerifyState(VERIFY.EMPTY)
        )
      );
    } else if (verifyState) {
      setUid('');
      setVerifyState('');
    }
  };

  const handleAdd = () => {
    dispatch(
      gtsUpdateReportByZV(type === ADD_ONE ? { add_tko: uid } : { selected_all_tko: true }, () => {
        dispatch(setIsLoadTKO(true));
        setValue('');
        setVerifyState('');
        setUid('');
        params.onClose();
      })
    );
    importFileLog();
  };

  return (
    <ModalWrapper header={t('ADD_BY_ZV_DIALOG_TITLE')} {...params}>
      <div style={{ width: 500, paddingTop: 24 }}>
        <SelectField
          value={type}
          data={[
            { value: ADD_ONE, label: t('BY_EIC') },
            { value: ADD_ALL, label: t('ALL_EIC') }
          ]}
          onChange={setType}
          dataMarker={'type'}
        />
        {type === ADD_ONE && (
          <StyledInput
            label={t('FIELDS.EIC_CODE')}
            style={{ marginTop: 24 }}
            onChange={handleOnChange}
            value={value}
            error={
              verifyState === VERIFY.EMPTY &&
              (report_uid ? t('VERIFY_MSG.EIC_CODE_NOT_FOUND_OR_ADDED') : t('VERIFY_MSG.EIC_CODE_NOT_FOUND'))
            }
            endAdornment={
              <InputAdornment position="end">
                {verifyState === VERIFY.LOADING && <AutorenewRounded className={'rotating'} />}
                {verifyState === VERIFY.SUCCESS && <CheckCircleRounded style={{ color: '#388e3c' }} />}
                {verifyState === VERIFY.EMPTY && <ErrorRounded style={{ color: '#f44336' }} />}
              </InputAdornment>
            }
          />
        )}
        {type === ADD_ALL && (
          <Typography variant={'body1'} style={{ paddingTop: 16, paddingBottom: 12 }} color={'error'}>
            {t('CREATE_GTS_REPORT_BY_ALL_EIC_WARNING')}
          </Typography>
        )}
      </div>
      <Grid container spacing={2} style={{ paddingTop: 32 }}>
        <Grid item xs={12} sm={6}>
          <WhiteButton style={{ width: '100%' }} onClick={params.onClose}>
            {t('CONTROLS.CANCEL')}
          </WhiteButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <CircularProgress color={'secondary'} size={28} />
            </div>
          ) : (
            <BlueButton
              style={{ width: '100%' }}
              onClick={handleAdd}
              disabled={(type === ADD_ONE && verifyState !== VERIFY.SUCCESS) || loading}
            >
              {t('CONTROLS.ADD')}
            </BlueButton>
          )}
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default AddByZVDialog;
