import { Dialog, Box, IconButton, Typography } from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import { BlueButton } from '../../../Components/Theme/Buttons/BlueButton';

export const BaseSettingsDialog = ({ open, onClose, children, handleSave, title, isLoading }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} maxWidth={'lg'} style={{ zIndex: 999 }}>
      <Box sx={styles.root}>
        <IconButton onClick={onClose} sx={styles.close} data-marker={'close-dialog'}>
          <CloseRounded />
        </IconButton>
        <Typography component={'h4'} sx={styles.header}>
          {title}
        </Typography>
        <Box sx={styles.content}>{children}</Box>
        <Box sx={styles.controls}>
          <BlueButton style={styles.controls__button} onClick={onClose}>
            {t('CONTROLS.CANCEL')}
          </BlueButton>
          <GreenButton disabled={isLoading} style={styles.controls__button} onClick={handleSave}>
            {isLoading ? `${t('SAVING')}...` : t('CONTROLS.SAVE')}
          </GreenButton>
        </Box>
      </Box>
    </Dialog>
  );
};

BaseSettingsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool
};

const styles = {
  root: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: '32px 40px 40px'
  },
  close: {
    position: 'absolute',
    right: 12,
    top: 12,
    '& svg': {
      fontSize: 19
    }
  },
  header: {
    color: '#0D244D',
    fontSize: 15,
    fontWeight: 500,
    lineHeight: 1.4,
    pr: 2.5,
    letterSpacing: 0.15
  },
  content: {
    mt: 4
  },
  controls: {
    mt: 5,
    display: 'flex',
    justifyContent: 'center',
    gap: 3
  },
  controls__button: {
    minWidth: 204,
    textTransform: 'uppercase',
    fontSize: 12
  }
};
