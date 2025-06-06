import { useDispatch, useSelector } from 'react-redux';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import { toggleCopyDialog, useFaqLanguage } from '../slice';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import { useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import RolesController from './components/RolesController';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import { useTranslation } from 'react-i18next';
import { useCopyFaqMutation } from '../api';
import { STATUS, useRoutes } from '../data';
import { mainApi } from '../../../app/mainApi';
import { useNavigate } from 'react-router-dom';

const CopyFaqDialog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routes = useRoutes();
  const { t } = useTranslation();
  const language = useFaqLanguage();
  const { open, data } = useSelector((store) => store.faq.copyDialog);
  const { data: templates } = mainApi.endpoints.faqTemplates.useQueryState({ language });
  const [name, setName] = useState('');
  const [roles, setRoles] = useState([]);
  const [onCopy, { isLoading }] = useCopyFaqMutation();

  const usedRoles = useMemo(
    () =>
      templates
        ?.filter((i) => i.key === data?.key && i.status !== STATUS.DEFAULT)
        .map((i) => i.roles)
        .flat(),
    [templates, data]
  );

  const handleClose = () => {
    dispatch(toggleCopyDialog(data));
  };

  const handleCancel = () => {
    setName('');
    setRoles([]);
    handleClose();
  };

  const handleSave = () => {
    onCopy({
      uid: data?.uid,
      new_key: data?.key,
      new_template_name: name,
      new_status: STATUS.DRAFT,
      new_roles: roles,
      new_language: language
    }).then(async (res) => {
      if (res?.data?.uid) {
        const chapter = routes.find((i) => i.pages.some((p) => p.apiKey === data?.key));
        const page = chapter.pages.find((p) => p.apiKey === data?.key);
        setTimeout(() => {
          navigate(`/faq/${chapter.route}/${page.route}/${res.data.uid}`);
        }, 0);
        handleCancel();
      }
    });
  };

  const disabledSave = !name || roles.length < 1 || isLoading;

  return (
    <ModalWrapper open={open} onClose={handleClose} header={'Для продовження заповніть наступні поля'} fullWidth>
      <Stack sx={{ mt: 2 }} spacing={3}>
        <StyledInput label={'Назва сторінки'} value={name} onChange={(e) => setName(e.target.value)} />
        <RolesController roles={roles} setRoles={setRoles} disableRoles={usedRoles} />
        <Stack direction={'row'} spacing={2} justifyContent={'space-between'} sx={{ pt: 2 }}>
          <BlueButton style={{ width: '45%' }} onClick={handleCancel}>
            {t('CONTROLS.CANCEL').toUpperCase()}
          </BlueButton>
          <GreenButton
            style={{ width: '45%' }}
            onClick={handleSave}
            disabled={disabledSave}
            data-status={disabledSave ? 'disabled' : 'enabled'}
          >
            {t('CONTROLS.SAVE').toUpperCase()}
          </GreenButton>
        </Stack>
      </Stack>
    </ModalWrapper>
  );
};

export default CopyFaqDialog;
