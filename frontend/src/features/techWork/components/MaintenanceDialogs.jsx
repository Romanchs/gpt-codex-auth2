import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import InfoRounded from '@mui/icons-material/InfoRounded';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { ModalWrapper } from '../../../Components/Modal/ModalWrapper';
import { GreenButton } from '../../../Components/Theme/Buttons/GreenButton';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';

const MaintenanceDialogs = ({ data }) => {
  const { t } = useTranslation();
  const completedId = Number(localStorage.getItem('TECH_WORK_COMPLETED'));
  const plannedId = Number(localStorage.getItem('TECH_WORK_PLANNED'));

  const isCompleted = Boolean(data?.last_completed && data?.last_completed?.id !== completedId);
  const isPlanned = Boolean(
    data?.planned?.notify_dt &&
      data?.planned?.id !== plannedId &&
      moment(data?.planned?.notify_dt).isBefore(moment().add(1, 'seconds'))
  );

  const [open, setOpen] = useState({
    TECH_WORK_COMPLETED: isCompleted,
    TECH_WORK_PLANNED: isPlanned
  });

  useEffect(() => {
    setOpen((prev) =>
      prev.TECH_WORK_COMPLETED !== isCompleted || prev.TECH_WORK_PLANNED !== isPlanned
        ? {
            TECH_WORK_COMPLETED: isCompleted,
            TECH_WORK_PLANNED: isPlanned
          }
        : prev
    );
  }, [data, isCompleted, isPlanned]);

  const handleClose = (type, id) => () => {
    localStorage.setItem(type, id);
    setOpen({ ...open, [type]: false });
  };

  return (
    <>
      <Modal
        isCompleted={true}
        open={open.TECH_WORK_COMPLETED}
        handleClose={handleClose('TECH_WORK_COMPLETED', data?.last_completed?.id)}
        text={[
          `${t('TECH_WORKS.MODALS.COMPLETED_DATE_TEXT')} ${
            data?.last_completed?.start_dt && moment(data?.last_completed?.start_dt).format('DD.MM.YYYY • HH:mm')
          } – ${
            data?.last_completed?.completed_at &&
            moment(data?.last_completed?.completed_at).format('DD.MM.YYYY • HH:mm')
          }`,
          t('TECH_WORKS.MODALS.COMPLETED_TEXT_1') + '.',
          '',
          t('TECH_WORKS.MODALS.COMPLETED_TEXT_2')
        ]}
        todolist={data?.last_completed?.todolist}
      />
      <Modal
        isCompleted={false}
        open={open.TECH_WORK_PLANNED}
        handleClose={handleClose('TECH_WORK_PLANNED', data?.planned?.id)}
        text={[
          t('TECH_WORKS.MODALS.PLANNED_TEXT_1') + '!',
          `${t('TECH_WORKS.MODALS.PLANNED_DATE_TEXT')} ${
            data?.planned?.start_dt && moment(data?.planned?.start_dt).format('DD.MM.YYYY • HH:mm')
          }`,
          `${t('TECH_WORKS.MODALS.PLANNED_TEXT_2')} ${
            data?.planned?.planned_end_dt && moment(data?.planned?.planned_end_dt).format('DD.MM.YYYY • HH:mm')
          }`,
          t('TECH_WORKS.MODALS.PLANNED_TEXT_3') + '.'
        ]}
        todolist={data?.planned?.todolist}
      />
    </>
  );
};

export default MaintenanceDialogs;

const Modal = ({ isCompleted, open, handleClose, text, todolist }) => (
  <ModalWrapper open={open} onClose={handleClose}>
    <Stack direction={'row'} sx={{ mb: 4.5, alignItems: 'center' }}>
      {isCompleted ? <InfoRounded sx={styles.iconInfo} /> : <ErrorRounded sx={styles.iconError} />}
      <Typography component="h4" sx={styles.title}>
        {i18n.t('TECH_WORKS.MODALS.BASE_TITLE')}
      </Typography>
    </Stack>
    {text.map((i, index) => (
      <Typography key={index} component="p" sx={{ ...styles.text, color: isCompleted ? '#219653' : '#FF0000' }}>
        {i}
      </Typography>
    ))}
    <Typography component="h5" sx={styles.list.title}>
      {(isCompleted
        ? i18n.t('TECH_WORKS.MODALS.BASE_COMPLETED_TITLE')
        : i18n.t('TECH_WORKS.MODALS.BASE_PLANNED_TITLE')) + ':'}
    </Typography>
    {todolist?.map(
      (i, index) =>
        (!isCompleted || i.is_completed) && (
          <Typography key={index} component="p" sx={styles.list.text}>
            {i.name}
          </Typography>
        )
    )}
    <Grid container sx={{ mt: 5, justifyContent: 'center' }}>
      <Grid item xs={6} align={'center'}>
        <GreenButton onClick={handleClose} style={{ width: '204px' }}>
          {i18n.t('CONTROLS.OK')}
        </GreenButton>
      </Grid>
    </Grid>
  </ModalWrapper>
);

const styles = {
  iconError: {
    '&.MuiSvgIcon-root': {
      width: 32,
      height: 32,
      color: '#FF0000'
    }
  },
  iconInfo: {
    '&.MuiSvgIcon-root': {
      width: 32,
      height: 32,
      color: '#223B82'
    }
  },
  title: {
    ml: 1,
    fontWeight: 500,
    fontSize: 15,
    color: '#0D244D'
  },
  text: {
    minHeight: 18,
    fontWeight: 400,
    fontSize: 12,
    textTransform: 'uppercase'
  },
  list: {
    title: {
      mt: 4,
      mb: 2,
      fontSize: 12,
      fontWeight: 700,
      color: '#567691'
    },
    text: {
      mb: 3,
      position: 'relative',
      fontSize: 12,
      fontWeight: 400,
      color: '#567691',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-12px',
        left: 0,
        width: '100%',
        height: '1px',
        backgroundColor: '#E5EAEE'
      }
    }
  }
};
