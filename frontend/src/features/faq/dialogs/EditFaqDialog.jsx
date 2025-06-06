import { useDispatch, useSelector } from 'react-redux';
import { Stack } from '@mui/material';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import { toggleEditDialog, useFaqLanguage } from '../slice';
import { useMemo, useState } from 'react';
import StyledInput from '../../../Components/Theme/Fields/StyledInput';
import RolesController from './components/RolesController';
import { STATUS } from '../data';
import { mainApi } from '../../../app/mainApi';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';
import { useTranslation } from 'react-i18next';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import { useUpdateFaqMutation } from '../api';

const EditFaqDialog = () => {
  const dispatch = useDispatch();
  const { open, data } = useSelector((store) => store.faq.editDialog);

  const handleClose = () => {
    dispatch(toggleEditDialog(data));
  };

  return (
    <ModalWrapper open={open} onClose={handleClose} header={`Налаштування сторінки ${data?.template_name}`} fullWidth>
      <Form data={data} onClose={handleClose} />
    </ModalWrapper>
  );
};

const Form = ({ data, onClose }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(data?.template_name || '');
  const [roles, setRoles] = useState(data?.roles || []);
  const language = useFaqLanguage();
  const { data: templates } = mainApi.endpoints.faqTemplates.useQueryState({ language });
  const [onUpdate, { isLoading }] = useUpdateFaqMutation();

  const usedRoles = useMemo(
    () =>
      templates
        ?.filter((i) => i.key === data?.key && i.status !== STATUS.DEFAULT && i?.uid !== data?.uid)
        .map((i) => i.roles)
        .flat(),
    [templates, data]
  );

  const handleSave = () => {
    onUpdate({
      uid: data?.uid,
      new_template_name: name,
      new_roles: roles
    }).then(onClose);
  };

  return (
    <Stack sx={{ mt: 2 }} spacing={3}>
      <StyledInput label={'Назва сторінки'} value={name} onChange={(e) => setName(e.target.value)} />
      <RolesController roles={roles} setRoles={setRoles} disableRoles={usedRoles} />
      <Stack direction={'row'} spacing={2} justifyContent={'space-between'} sx={{ pt: 2 }}>
        <BlueButton style={{ width: '45%' }} onClick={onClose}>
          {t('CONTROLS.CANCEL').toUpperCase()}
        </BlueButton>
        <GreenButton style={{ width: '45%' }} onClick={handleSave} disabled={!name || roles.length < 1 || isLoading}>
          {t('CONTROLS.SAVE').toUpperCase()}
        </GreenButton>
      </Stack>
    </Stack>
  );
};

export default EditFaqDialog;
