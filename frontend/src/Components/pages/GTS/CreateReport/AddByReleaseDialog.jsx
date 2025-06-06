import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import AutorenewRounded from '@mui/icons-material/AutorenewRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GTS } from '../../../../actions/types';
import { gtsVerifyTko, gtsUpdateReportByRelease } from '../../../../actions/gtsActions';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import { WhiteButton } from '../../../Theme/Buttons/WhiteButton';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';
import useImportFileLog from '../../../../services/actionsLog/useImportFileLog';
import { GTS_LOG_TAGS } from '../../../../services/actionsLog/constants';
import { setIsLoadTKO } from '../slice';

const VERIFY = {
  LOADING: 'VERIFY_LOADING',
  SUCCESS: 'VERIFY_SUCCESS',
  ERROR: 'VERIFY_ERROR'
};

const defaultState = { type: 'DEFAULT', data: '' };

const AddByReleaseDialog = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { reportByRelease } = useSelector(({ gts }) => gts);
  const [value, setValue] = useState('');
  const [verifyState, setVerifyState] = useState(defaultState);

  const importFileLog = useImportFileLog(GTS_LOG_TAGS);

  const handleOnClose = () => {
    setValue('');
    setVerifyState(defaultState);
    if (!reportByRelease?.tkos?.data?.length) {
      dispatch({ type: GTS.SET_UID_FOR_DIFFERENT_REPORTS, payload: '' });
    }
    onClose();
  };

  const handleOnChange = ({ target: { value } }) => {
    if (verifyState.type === VERIFY.LOADING || value.length > 16) {
      return;
    }
    setValue(value);
    if (value.length === 16) {
      setVerifyState({ type: VERIFY.LOADING });
      dispatch(
        gtsVerifyTko(
          'by-release',
          value,
          (data) => setVerifyState({ type: VERIFY.SUCCESS, data }),
          (data) => setVerifyState({ type: VERIFY.ERROR, data })
        )
      );
    } else if (verifyState.type !== defaultState.type) {
      setVerifyState(defaultState);
    }
  };

  const handleAdd = async () => {
    dispatch(gtsUpdateReportByRelease({ include_tko: verifyState.data }));
    dispatch(setIsLoadTKO(true));
    setValue('');
    setVerifyState(defaultState);
    onClose();
    importFileLog();
  };

  return (
    <ModalWrapper header={t('ENTER_THE_EIC_CODE_OF_THE_COMMERCIAL_AP')} open={open} onClose={handleOnClose}>
      <div style={{ width: 500, paddingTop: 24 }}>
        <StyledInput
          label={t('FIELDS.EIC_CODE')}
          onChange={handleOnChange}
          value={value}
          error={verifyState.type === VERIFY.ERROR && verifyState.data}
          style={{ marginBottom: 16 }}
          endAdornment={
            <InputAdornment position="end">
              {verifyState.type === VERIFY.LOADING && <AutorenewRounded className={'rotating'} />}
              {verifyState.type === VERIFY.SUCCESS && <CheckCircleRounded style={{ color: '#388e3c' }} />}
              {verifyState.type === VERIFY.ERROR && <ErrorRounded style={{ color: '#f44336' }} />}
            </InputAdornment>
          }
        />
      </div>
      <Grid container spacing={2} style={{ paddingTop: 32 }}>
        <Grid item xs={12} sm={6}>
          <WhiteButton style={{ width: '100%' }} onClick={handleOnClose}>
            {t('CONTROLS.CANCEL')}
          </WhiteButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <BlueButton style={{ width: '100%' }} onClick={handleAdd} disabled={verifyState.type !== VERIFY.SUCCESS}>
            {t('CONTROLS.ADD')}
          </BlueButton>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default AddByReleaseDialog;
