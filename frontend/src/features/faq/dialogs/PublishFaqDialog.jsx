import { useDispatch, useSelector } from 'react-redux';
import CancelModal from '../../../Components/Modal/CancelModal';
import { togglePublishDialog } from '../slice';
import { STATUS } from '../data';
import { useTranslation } from 'react-i18next';
import { useUpdateFaqMutation } from '../api';

const PublishFaqDialog = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { open, data } = useSelector((store) => store.faq.publishDialog);
  const isDraft = data?.status === STATUS.DRAFT;
  const [onUpdate, { isLoading }] = useUpdateFaqMutation();

  const handleClose = () => {
    dispatch(togglePublishDialog(data));
  };

  const handleSubmit = () => {
    onUpdate({
      uid: data?.uid,
      new_status: isDraft ? STATUS.PUBLISHED : STATUS.DRAFT
    }).then(handleClose);
  };

  return (
    <CancelModal
      onClose={handleClose}
      onSubmit={handleSubmit}
      text={t(`MODALS.${isDraft ? 'PUBLISH_TEMPLATE' : 'ARCHIVE_TEMPLATE'}`, { data: data ? data.template_name : '' })}
      open={open}
      submitType={'green'}
      disabledSubmit={isLoading}
    />
  );
};

export default PublishFaqDialog;
