import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { actionsButtonStyles } from './styles';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { modalTypes } from '../constants';
import { useTranslation } from 'react-i18next';

const ActionsButton = ({ processData, selectTechAction }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const actionRules = processData?.admin_actions;
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (modalType) => (e) => {
    e.stopPropagation();
    setAnchorEl(null);
    if (modalType) selectTechAction({ modalType: modalType, processData: processData });
  };

  const isActive =
    actionRules?.change_status.length > 0 ||
    actionRules?.remove_ap ||
    actionRules?.restart ||
    actionRules?.change_must_be_finished_at;

  return (
    <div>
      <IconButton
        sx={actionsButtonStyles.buttonStyles}
        data-marker={'toggle-actions-menu'}
        disabled={!isActive}
        onClick={handleClick}
      >
        <MoreVertIcon sx={actionsButtonStyles.icon} />
      </IconButton>
      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose()}>
        {actionRules?.change_status.length > 0 && (
          <MenuItem
            onClick={handleClose(modalTypes.changeStatus)}
            data-marker={'change-status-action'}
            sx={actionsButtonStyles.menuItem}
          >
            <ImportExportIcon sx={actionsButtonStyles.green} />
            {t('CONTROLS.CHANGE_STATUS')}
          </MenuItem>
        )}
        {actionRules?.remove_ap && (
          <MenuItem onClick={handleClose(modalTypes.deleteTko)} sx={actionsButtonStyles.menuItem}>
            <DeleteIcon sx={actionsButtonStyles.red} />
            {t('CONTROLS.DELETE_AP')}
          </MenuItem>
        )}
        {actionRules?.restart && (
          <MenuItem onClick={handleClose(modalTypes.restart)} sx={actionsButtonStyles.menuItem}>
            <AutorenewIcon sx={actionsButtonStyles.orange} />
            {t('CONTROLS.RESTART')}
          </MenuItem>
        )}
        {actionRules?.change_must_be_finished_at && (
          <MenuItem onClick={handleClose(modalTypes.changeDueDate)} sx={actionsButtonStyles.menuItem}>
            <DateRangeIcon sx={actionsButtonStyles.grey} />
            {t('CONTROLS.CHANGE_EXECUTION_TERM')}
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default ActionsButton;
