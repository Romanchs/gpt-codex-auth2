import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  clearAdminTemplates,
  createTemplates,
  createUser,
  generateLogin,
  generateLoginSuccess,
  getTemplates,
  getUserById,
  getUserByIdSuccess,
  resetPassword,
  updateUserById
} from '../../../actions/adminActions';
import { enqueueSnackbar } from '../../../actions/notistackActions';
import FormInput from '../../../Forms/fields/FormInput';
import Form from '../../../Forms/Form';
import { clearForm } from '../../../Forms/formActions';
import { getEnv } from '../../../util/getEnv';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../Global/Page';
import { ModalWrapper } from '../../Modal/ModalWrapper';
import { DangerButton } from '../../Theme/Buttons/DangerButton';
import { WhiteButton } from '../../Theme/Buttons/WhiteButton';
import RoleDialog from './RoleDialog';
import RolesTable from './RolesTable';
import SecuritySettings from './SecuritySettings';
import TemplatesSettings from './TemplatesSettings';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CircleButton from '../../Theme/Buttons/CircleButton';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { Card } from '../../Theme/Components/Card';

const AddUser = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, generatedLogin, currentUser, userListUpdated, error, templatesListChecked, templatesList } =
    useSelector((store) => store.admin);
  const activeRoles = useSelector((store) => store.user.activeRoles);
  const [openDialog, setOpenDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [relations, setRelations] = useState([]);
  const [security, setSecurity] = useState({
    otp_required: true,
    esign_required: false,
    esign_org_required: false,
    user_type: { code: 1 },
    ip_addresses: null,
    tax_id: []
  });
  const [formData, setFormData] = useState(null);
  const [isArchived, setArchived] = useState(false);
  const [errors, setErrors] = useState(error?.response?.data);
  const [timeOut, setTimeOut] = useState(null);
  const [availableTemplates, setAvailableTemplates] = useState(null);
  const { env } = getEnv();
  const { activeField } = useSelector(({ forms }) => forms);

  const isActualData = Boolean(
    currentUser &&
      JSON.stringify({
        ...currentUser,
        ...formData,
        ...security,
        user_relations: relations
      }) === JSON.stringify(currentUser)
  );

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkPermissions('USER_MANAGE.CONTROLS.ADD_USER', 'АКО_Користувачі')) {
      navigate('/');
    }
  }, [activeRoles, navigate]);

  useEffect(() => {
    if (error?.response?.data) {
      setErrors(error.response.data);
    }
    if (!error) {
      setErrors(null);
    }
  }, [error]);

  useEffect(() => {
    if (id && !currentUser) {
      dispatch(getUserById(id));
      if (env !== 'prod') dispatch(getTemplates(id));
    }
    if (currentUser) {
      setRelations(currentUser.user_relations);
      setSecurity({
        otp_required: currentUser?.otp_required,
        esign_required: currentUser?.esign_required,
        esign_org_required: currentUser?.esign_org_required,
        user_type: currentUser?.user_type || security.user_type,
        ip_addresses: currentUser?.ip_addresses,
        tax_id: currentUser?.tax_id
      });
    }
    setArchived(!(currentUser?.is_active || !id));
  }, [env, currentUser, dispatch, id]);

  const handleSaveTemplates = () => {
    if (currentUser?.uid) {
      const data = {
        user_uid: currentUser?.uid,
        available_tempates: availableTemplates
      };
      dispatch(createTemplates(data, currentUser?.uid, templatesListChecked?.available_tempates));
    }
  };

  const handleClearTemplates = () => {
    if (currentUser?.uid) {
      dispatch(getTemplates(currentUser?.uid));
    }
  };

  useEffect(() => {
    if (userListUpdated) {
      id
        ? dispatch(
            enqueueSnackbar({
              message: t('USER_DATA_IS_SAVED'),
              options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                autoHideDuration: 5000
              }
            })
          )
        : handleExit();
    }
  }, [userListUpdated, dispatch]);

  const verifyFormInput = (data, name, messages) => {
    if (activeField !== name) {
      return {};
    }
    for (const message of messages) {
      if (message.verify(data[name])) {
        return { [name]: message.text };
      }
    }
    return { [name]: undefined };
  };

  const handleFormChange = (res) => {
    setFormData(res);
    setErrors({
      ...errors,
      ...verifyFormInput(res, 'phone', [
        { verify: (v) => !v?.startsWith('+380'), text: t('VERIFY_MSG.PHONE_START_WITH') },
        { verify: (v) => v && isNaN(v) && v !== '+', text: t('VERIFY_MSG.ONLY_NUMBERS') },
        { verify: (v) => v.length > 13, text: t('VERIFY_MSG.PHONE_MAX_LEN') }
      ]),
      ...verifyFormInput(res, 'first_name', [{ verify: (v) => !v || !v.trim(), text: t('VERIFY_MSG.EMPTY_FIELDS') }]),
      ...verifyFormInput(res, 'last_name', [
        {
          verify: (v) => !v || !v.trim(),
          text: t('VERIFY_MSG.EMPTY_FIELDS')
        }
      ]),
      ...verifyFormInput(res, 'middle_name', [{ verify: (v) => !v || !v.trim(), text: t('VERIFY_MSG.EMPTY_FIELDS') }]),
      ...verifyFormInput(res, 'email', [{ verify: (v) => !v }])
    });
  };

  useEffect(
    () => () => {
      dispatch(clearForm('add-user-form'));
      dispatch(getUserByIdSuccess(null));
      dispatch(generateLoginSuccess(''));
      if (env !== 'prod') dispatch(clearAdminTemplates());
    },
    [dispatch, env]
  );

  useEffect(() => {
    if (templatesListChecked?.available_tempates && env !== 'prod') {
      setAvailableTemplates(templatesListChecked?.available_tempates);
    }
  }, [dispatch, templatesListChecked, env]);

  useEffect(() => {
    if (formData?.last_name && formData?.first_name && formData?.middle_name && !id) {
      clearTimeout(timeOut);
      setTimeOut(
        setTimeout(() => {
          dispatch(
            generateLogin({
              last_name: formData.last_name,
              first_name: formData.first_name,
              middle_name: formData.middle_name
            })
          );
        }, 300)
      );
    }
  }, [dispatch, formData?.last_name, formData?.first_name, formData?.middle_name]);

  const handleExit = () => {
    dispatch(clearForm('add-user-form'));
    dispatch(getUserByIdSuccess(null));
    navigate('/admin/user');
  };

  const handleAddRelation = (rel) => {
    setRelations([...relations, rel]);
  };

  const handleSecurityChange = (data) => {
    setSecurity(data);
  };

  const handleCreate = () => {
    if (id) {
      dispatch(
        updateUserById(id, {
          ...formData,
          ...security,
          user_relations: relations.map((rel) => ({
            ...rel,
            role: { uid: rel.role.uid }
          }))
        })
      );
    } else {
      dispatch(
        createUser({
          ...formData,
          ...security,
          user_relations: relations.map((rel) => ({ ...rel, role: { uid: rel.role.uid } }))
        })
      );
    }
  };

  const updateRelation = (relation) => {
    setRelations(relations.map((rel) => (rel.id === relation.id ? relation : rel)));
  };

  const handleResetPassword = () => {
    dispatch(resetPassword(id));
    setOpenResetDialog(false);
  };

  const validate = () =>
    !(
      !formData?.first_name ||
      !formData?.last_name ||
      !formData?.middle_name ||
      !formData?.username ||
      !formData?.email ||
      (errors && Object.values(errors).filter((i) => i).length > 0) ||
      relations.length < 1
    );

  return (
    <Page
      pageName={isArchived ? t('SHOW_ARCHIVE_USER') : id ? t('EDIT_USER') : t('CREATE_USER')}
      backRoute={'/admin/user'}
      loading={loading}
      controls={
        !isArchived && (
          <>
            {id && currentUser && (
              <CircleButton
                color={'red'}
                icon={<KeyRoundedIcon />}
                title={currentUser?.otp_required ? t('REMOVE_PASSWORD_AND_2FA') : t('REMOVE_PASSWORD')}
                dataMarker={'reset-password'}
                onClick={() => {
                  if (isActualData) {
                    setOpenResetDialog(true);
                  } else {
                    dispatch(
                      enqueueSnackbar({
                        message: t('NOTIFICATIONS.UNSAVED_CHANGES'),
                        options: {
                          key: new Date().getTime() + Math.random(),
                          variant: 'warning',
                          autoHideDuration: 5000
                        }
                      })
                    );
                  }
                }}
                disabled={moment(currentUser?.res_pwd_req_at).diff(moment()) / 60000 > -5}
              />
            )}
            <CircleButton
              type={'add'}
              title={t('CONTROLS.ADD_ROLE')}
              onClick={() => setOpenDialog(true)}
              dataMarker={'add-role'}
            />
            <CircleButton
              type={'save'}
              title={t('CONTROLS.SAVE')}
              onClick={handleCreate}
              disabled={!validate() || loading || isActualData}
            />
          </>
        )
      }
    >
      <Box>
        <Typography
          variant={'h6'}
          sx={{
            fontWeight: 600,
            fontSize: '15px',
            lineHeight: '20px',
            pl: '8px',
            color: '#6c7d9a',
            mb: '9px'
          }}
        ></Typography>
        <Card title={`${t('USER_DATA')}:`}>
          <Form name={'add-user-form'} onChange={handleFormChange} errors={errors}>
            <Grid container spacing={3} alignItems={'flex-start'}>
              <Grid item xs={12} sm={6} lg={3}>
                <FormInput
                  name={'last_name'}
                  label={t('FIELDS.LAST_NAME')}
                  disabled={isArchived}
                  value={id ? currentUser?.last_name : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <FormInput
                  name={'first_name'}
                  label={t('FIELDS.FIRST_NAME')}
                  disabled={isArchived}
                  value={id ? currentUser?.first_name : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <FormInput
                  name={'middle_name'}
                  label={t('FIELDS.MIDDLE_NAME')}
                  disabled={isArchived}
                  value={id ? currentUser?.middle_name : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <FormInput
                  name={'username'}
                  label={t('FIELDS.USERNAME')}
                  disabled={true}
                  value={id ? currentUser?.username : generatedLogin}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <FormInput name={'email'} label={'E-mail'} disabled={isArchived} value={id ? currentUser?.email : ''} />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <FormInput
                  name={'phone'}
                  label={t('FIELDS.PHONE')}
                  disabled={isArchived}
                  value={id ? currentUser?.phone : '+380'}
                  max={13}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <SecuritySettings security={security} onChange={handleSecurityChange} currentUser={currentUser} />
              </Grid>
              {id && env !== 'prod' && (
                <Grid item xs={12} sm={6} lg={3}>
                  <TemplatesSettings
                    availableTemplates={availableTemplates}
                    templatesList={templatesList}
                    setAvailableTemplates={setAvailableTemplates}
                    handleSaveTemplates={handleSaveTemplates}
                    handleClearTemplates={handleClearTemplates}
                  />
                </Grid>
              )}
            </Grid>
          </Form>
        </Card>
        {relations.length > 0 && <RolesTable relations={relations} onChange={updateRelation} disabled={isArchived} />}
      </Box>
      <RoleDialog
        open={openDialog}
        relations={relations}
        handleClose={() => setOpenDialog(false)}
        addRole={handleAddRelation}
      />
      <ModalWrapper
        open={openResetDialog}
        header={t('REMOVE_PASSWORD_FOR_USER', { username: currentUser?.username })}
        onClose={() => setOpenResetDialog(false)}
      >
        <Box sx={{ pt: 3 }}>
          <Typography component={'p'} sx={{ mb: 1 }}>
            {currentUser?.otp_required
              ? t('REMOVE_PASSWORD_AND_2FA_COFIRMATION', { email: currentUser?.email })
              : t('REMOVE_PASSWORD_COFIRMATION', { email: currentUser?.email })}
            .
          </Typography>
        </Box>
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
          <WhiteButton onClick={() => setOpenResetDialog(false)}>Скасувати</WhiteButton>
          <DangerButton onClick={handleResetPassword}>
            {currentUser?.otp_required ? t('REMOVE_PASSWORD_AND_2FA') : t('REMOVE_PASSWORD')}
          </DangerButton>
        </Stack>
      </ModalWrapper>
    </Page>
  );
};

export default AddUser;
