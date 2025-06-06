import { useDispatch, useSelector } from 'react-redux';
import CancelModal from '../../../Components/Modal/CancelModal';
import { toggleDeleteDialog } from '../slice';
import { useTranslation } from 'react-i18next';
import { useDeleteFaqMutation } from '../api';

const DeleteFaqDialog = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const open = useSelector((store) => store.faq.deleteDialog.open);
  const data = useSelector((store) => store.faq.deleteDialog.data);
  const [fetch, { isLoading }] = useDeleteFaqMutation();

  const handleClose = () => {
    dispatch(toggleDeleteDialog(data));
  };

  const handleSubmit = () => {
    fetch({ uid: data?.uid }).then(() => handleClose());
  };

  return (
    <CancelModal
      onClose={handleClose}
      onSubmit={handleSubmit}
      text={t('MODALS.DELETE_DATA', { data: data ? data.template_name : '' })}
      open={open}
      submitType={'danger'}
      disabledSubmit={isLoading}
    />
  );
};

export default DeleteFaqDialog;
