import { useDispatch, useSelector } from 'react-redux';
import { ModalWrapper } from '../../Components/Modal/ModalWrapper';
import { closeSecurityDialog } from './slice';
import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const SecurityHandlerDialog = () => {
  const dispatch = useDispatch();
  const { open, data } = useSelector((store) => store.securityHandler);

  const handleClose = () => {
    dispatch(closeSecurityDialog());
  };

  return (
    <ModalWrapper open={open} onClose={handleClose} maxWidth={'lg'}>
      <Box>
        <Typography variant="h5" component="div" color={'error'} sx={{ fontWeight: 700, textAlign: 'center' }}>
          Ваш запит було заблоковано у звʼязку з політикою безпеки.
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, my: 1.5, textAlign: 'center' }}>
          Зверніться до служби підтримки за адресою:{' '}
          <a href="mailto:support.datahub@ua.energy">support.datahub@ua.energy</a>
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, mb: 1 }}>
          Повідомлення безпеки:
        </Typography>
      </Box>
      <Paper sx={{ p: 1.5, bgcolor: '#eee' }} elevation={5}>
        <Box
          data-marker={'blocked-by-security'}
          dangerouslySetInnerHTML={{
            __html: data.replace("<a href='javascript:history.back();'>[Go Back]</a>", '')
          }}
        />
      </Paper>
    </ModalWrapper>
  );
};

export default SecurityHandlerDialog;
