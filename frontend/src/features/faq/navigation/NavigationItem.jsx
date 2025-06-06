import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';

const NavigationItem = ({ open, onClick, text, children, isChild, active = false }) => {
  return (
    <>
      <ListItemButton onClick={onClick} sx={{ py: 0, pr: 1, pl: isChild ? 3 : 1 }}>
        {children && (
          <ListItemIcon sx={{ minWidth: 28 }}>
            {open ? (
              <ExpandLessRounded sx={{ color: '#F28C60', fontSize: 24 }} />
            ) : (
              <ExpandMoreRounded sx={{ color: '#567691', fontSize: 24 }} />
            )}
          </ListItemIcon>
        )}
        <ListItemText primary={text} sx={{ color: active ? '#F28C60' : '#4A5B7A' }} />
      </ListItemButton>
      {children && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>{children}</List>
        </Collapse>
      )}
    </>
  );
};

export default NavigationItem;
