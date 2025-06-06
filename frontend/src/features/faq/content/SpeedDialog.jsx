import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Typography, useMediaQuery } from '@mui/material';
import { MOCK_UID, STATUS } from '../data';
import { useNavigate, useParams } from 'react-router-dom';
import { memo } from 'react';
import { toggleCopyDialog, toggleDeleteDialog, toggleEditDialog, togglePublishDialog, useFaqLanguage } from '../slice';
import { mainApi } from '../../../app/mainApi';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const SpeedDialog = memo(() => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uid } = useParams();
  const language = useFaqLanguage();
  const { currentData } = mainApi.endpoints.faqTemplates.useQueryState({ language });
  const isMock = uid === MOCK_UID;
  const template = currentData?.find((i) => i.uid === uid);
  const isDefault = template && template.status === STATUS.DEFAULT;
  const isDraft = template && template.status === STATUS.DRAFT;
  const showLeft = useMediaQuery('(max-height:600px)');

  const handleEdit = () => {
    navigate('edit');
  };

  const handleDelete = () => {
    dispatch(toggleDeleteDialog(template));
  };

  const handleCopy = () => {
    dispatch(toggleCopyDialog(template));
  };
  const handleSetting = () => {
    dispatch(toggleEditDialog(template));
  };
  const handlePublish = () => {
    dispatch(togglePublishDialog(template));
  };

  return (
    <SpeedDial
      direction={showLeft ? 'left' : 'up'}
      ariaLabel="SpeedDialog"
      sx={{ position: 'absolute', bottom: 32, right: 32 }}
      FabProps={{
        color: 'blue',
        'data-marker': 'more-menu-speed-dial'
      }}
      icon={<SpeedDialIcon sx={{ '&>svg': { fontSize: 25 } }} />}
    >
      {isDraft && (
        <SpeedDialAction
          icon={<DeleteRoundedIcon />}
          tooltipTitle={<Typography variant={'body2'}>{t('CONTROLS.DELETE')}</Typography>}
          onClick={handleDelete}
        />
      )}
      {!isDefault && !isMock && (
        <SpeedDialAction
          icon={isDraft ? <PublishRoundedIcon /> : <ArchiveRoundedIcon />}
          tooltipTitle={
            <Typography variant={'body2'}>{isDraft ? t('CONTROLS.PUBLISH') : t('CONTROLS.MAKE_A_DRAFT')}</Typography>
          }
          onClick={handlePublish}
        />
      )}
      {!isMock && (
        <SpeedDialAction
          icon={<ContentCopyRoundedIcon />}
          tooltipTitle={<Typography variant={'body2'}>{t('CONTROLS.COPY')}</Typography>}
          onClick={handleCopy}
        />
      )}
      {!isDefault && !isMock && (
        <SpeedDialAction
          icon={<TuneRoundedIcon />}
          tooltipTitle={<Typography variant={'body2'}>{t('CONTROLS.PAGE_SETTINGS')}</Typography>}
          onClick={handleSetting}
        />
      )}
      <SpeedDialAction
        icon={<EditNoteRoundedIcon />}
        tooltipTitle={<Typography variant={'body2'}>{t('CONTROLS.EDIT_CONTENT')}</Typography>}
        onClick={handleEdit}
      />
    </SpeedDial>
  );
});

export default SpeedDialog;
