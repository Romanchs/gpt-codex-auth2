import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { handleClose } from './loggerSlice';

const Logger = () => {
  const dispatch = useDispatch();
  const { open, status, body, endpoint } = useSelector((store) => store.logger);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        dispatch(handleClose());
        clearTimeout(t);
      }, 10000);
    }
  }, [open, dispatch]);

  if (!open) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 0, 0, 0.9)',
        pointerEvents: 'none',
        p: 1,
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 99999,
        fontWeight: 900
      }}
    >
      <p>Status - {status}</p>
      <p>Endpoint - {endpoint}</p>
      <p>Body - {body}</p>
    </Box>
  );
};

export default Logger;
