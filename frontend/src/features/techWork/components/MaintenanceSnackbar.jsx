import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import moment from 'moment';
import i18n from '../../../i18n/i18n';

const MaintenanceSnackbar = ({ data }) => {
  const diff =
    data?.planned?.notify_authorized_users &&
    data?.planned?.start_dt &&
    moment(data.planned.start_dt).unix() - moment().unix();

  if (typeof diff === 'number' && diff <= 900 && diff > 0) {
    return (
      <Box sx={styles.container}>
        <Stack direction={'row'} sx={{ alignItems: 'center' }}>
          <ErrorRounded sx={styles.icon} />
          <Typography component="p" sx={styles.text} data-marker="info-text">
            {moment(data.planned.start_dt).format('DD.MM.YYYY • HH:mm') +
              ' • ' +
              i18n.t('TECH_WORKS.SNACKBAR.DATE_TEXT')}
          </Typography>
        </Stack>
      </Box>
    );
  }
  return null;
};

export default MaintenanceSnackbar;

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: 372,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#F8DCDC',
    boxShadow: '0 4px 12px #0000001A',
    zIndex: 10,
    opacity: 0.9,
    pointerEvents: 'none'
  },
  icon: {
    '&.MuiSvgIcon-root': {
      width: 32,
      height: 32,
      color: '#FF0000'
    }
  },
  text: {
    ml: 1.5,
    fontWeight: 500,
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#0D244D'
  }
};
