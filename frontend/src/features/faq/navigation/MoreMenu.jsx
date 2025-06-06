import Menu from '@mui/material/Menu';
import { MOCK_UID, STATUS } from '../data';
import { MenuItem } from '@mui/material';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { toggleCopyDialog, toggleDeleteDialog, toggleEditDialog, togglePublishDialog } from '../slice';

const MoreMenu = ({ data, baseRoute, anchorEl, handleClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDefault = data.status === STATUS.DEFAULT;
  const isDraft = data.status === STATUS.DRAFT;

  const handleEdit = () => {
    handleClose();
    navigate(`${baseRoute}/${data?.uid}/edit`);
  };

  const handleDelete = () => {
    handleClose();
    dispatch(toggleDeleteDialog(data));
  };

  const handleCopy = () => {
    handleClose();
    dispatch(toggleCopyDialog(data));
  };

  const handleSettings = () => {
    handleClose();
    dispatch(toggleEditDialog(data));
  };

  const handlePublish = () => {
    handleClose();
    dispatch(togglePublishDialog(data));
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      sx={{
        '& .MuiButtonBase-root': { color: '#4A5B7A', minWidth: 200 },
        '& .MuiSvgIcon-root': { mr: 0.75, fontSize: 16 }
      }}
    >
      <MenuItem onClick={handleEdit}>
        <EditNoteRoundedIcon />
        {t('CONTROLS.EDIT_CONTENT')}
      </MenuItem>
      {!isDefault && (
        <MenuItem onClick={handleSettings}>
          <TuneRoundedIcon />
          {t('CONTROLS.PAGE_SETTINGS')}
        </MenuItem>
      )}
      {data?.uid !== MOCK_UID && (
        <MenuItem onClick={handleCopy}>
          <ContentCopyRoundedIcon />
          {t('CONTROLS.COPY')}
        </MenuItem>
      )}
      {!isDefault && (
        <MenuItem onClick={handlePublish}>
          {isDraft ? <PublishRoundedIcon /> : <ArchiveRoundedIcon />}
          {isDraft ? t('CONTROLS.PUBLISH') : t('CONTROLS.MAKE_A_DRAFT')}
        </MenuItem>
      )}
      {isDraft && (
        <MenuItem onClick={handleDelete}>
          <DeleteRoundedIcon />
          {t('CONTROLS.DELETE')}
        </MenuItem>
      )}
    </Menu>
  );
};

export default memo(MoreMenu);
