import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';
import { useDelegateMutation } from './api';
import { useTranslation } from 'react-i18next';

const DelegateBtn = ({ process_uid, onStarted, onFinished, onSuccess, disabled }) => {
  const {t} = useTranslation();
  const [delegate, { isLoading, reset }] = useDelegateMutation();

  const handleDelegate = () => {
    onStarted();
    delegate(process_uid).then((res) => {
      onFinished();
      reset();
      if (!res?.error) onSuccess();
    });
  };

  return (
    <CircleButton
      color={'orange'}
      title={t('CONTROLS.DELEGATE')}
      icon={<SyncAltRoundedIcon />}
      onClick={handleDelegate}
      dataMarker={'delegate'}
      disabled={isLoading || disabled}
    />
  );
};

export default DelegateBtn;
