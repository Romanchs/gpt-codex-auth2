import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import GetAppRounded from '@mui/icons-material/GetAppRounded';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FormInput from '../../../Forms/fields/FormInput';
import Form from '../../../Forms/Form';
import { clearForm } from '../../../Forms/formActions';
import api from '../../../util/api';
import { saveAsFile } from '../../../util/files';
import { checkPermissions } from '../../../util/verifyRole';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { Card } from '../../../Components/Theme/Components/Card';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { ACTION, DISPUTE_AKO_ALLOWED_ROLES, DISPUTE_ALLOWED_ROLES } from '../constants';
import { disputesActions } from '../disputes.slice';
import { useDisputeStyles } from '../styles';
import { useTranslation } from 'react-i18next';

export const DisputesEntityDkoAko = ({
  uid,
  decision_at,
  decision_by,
  decision_file_uid,
  decision_file_name,
  decision_text,
  hasDecisionSend
}) => {
  const {t} = useTranslation();
  const classes = useDisputeStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const { disputeDecision } = useSelector(({ forms }) => forms);

  useEffect(() => {
    if (!checkPermissions('DISPUTES.DKO_ENTITY.TABS.AKO', DISPUTE_ALLOWED_ROLES)) {
      navigate('/');
    }

    return () => dispatch(clearForm('disputeDecision'));
  }, [dispatch, navigate, relation_id]);

  const handleDownload = () => {
    api.disputes
      .getFile(decision_file_uid)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, decision_file_name, res.headers['content-type'] || '');
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = () => {
    dispatch(
      disputesActions.doActionDko({
        uid,
        action: ACTION.AKO_DECISION_SEND,
        params: { message: disputeDecision?.decision_text }
      })
    );
  };

  return (
    <>
      {(checkPermissions('DISPUTES.DKO_ENTITY.TABS.AKO.FUNCTIONS.ADD_DECISION', DISPUTE_AKO_ALLOWED_ROLES) ||
        decision_text) && (
        <Card title={t('DECISION')}>
          {checkPermissions('DISPUTES.DKO_ENTITY.TABS.AKO.FUNCTIONS.ADD_DECISION', DISPUTE_AKO_ALLOWED_ROLES) &&
            !decision_text && (
              <Form name={'disputeDecision'}>
                <Grid container spacing={3} alignItems={'center'}>
                  <Grid item xs>
                    <FormInput name={'decision_text'} label={t('FIELDS.DECISION_TEXT')} disabled={!hasDecisionSend} multiline />
                  </Grid>
                  <Grid item xs={'auto'}>
                    <CircleButton
                      type={'send'}
                      title={t('CONTROLS.SEND')}
                      disabled={!disputeDecision?.decision_text}
                      onClick={handleSubmit}
                    />
                  </Grid>
                </Grid>
              </Form>
            )}

          {decision_text && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledInput label={t('FIELDS.DECISION_TEXT')} value={decision_text || '-'} readOnly multiline clipboard />
              </Grid>
              <Grid item xs>
                <StyledInput label={t('FIELDS.USER_FULL_NAME')} value={decision_by || '-'} readOnly />
              </Grid>
              <Grid item xs>
                <StyledInput
                  label={t('FIELDS.PUBLICATION_DATETIME')}
                  value={decision_at ? moment(decision_at).format('DD.MM.yyyy • HH:mm') : '-'}
                  readOnly
                />
              </Grid>

              {decision_file_name && (
                <Grid item xs className={classes.formGroup}>
                  <StyledInput label={t('FIELDS.FILENAME')} value={decision_file_name || '-'} readOnly />
                  <Button className={classes.download_file} onClick={handleDownload}>
                    <GetAppRounded titleAccess={t('CONTROLS.DOWNLOAD_FILE')} />
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Card>
      )}
    </>
  );
};
