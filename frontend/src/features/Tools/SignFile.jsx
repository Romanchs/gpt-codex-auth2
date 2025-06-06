import Page from '../../Components/Global/Page';
import { styled } from '@material-ui/core';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Stack, Typography } from '@mui/material';
import StyledInput from '../../Components/Theme/Fields/StyledInput';
import Paper from '@mui/material/Paper';
import { useSignTestFileMutation } from './api';
import { useState } from 'react';

const DEFAULT_STATE = {
  file_to_sign: null,
  e_sign: null,
  password: ''
};

const SignFile = () => {
  const [state, setState] = useState(DEFAULT_STATE);
  const [fetch, { isLoading, data, reset }] = useSignTestFileMutation();

  const handleChange = ({ target }) => {
    reset();
    const name = target.name;
    if (name === 'password') {
      setState({ ...state, password: target.value });
      return;
    }
    setState({ ...state, [name]: target.files.length ? target.files[0] : null });
    target.value = null;
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file_to_sign', state.file_to_sign);
    formData.append('e_sign', state.e_sign);
    formData.append('password', state.password);
    fetch(formData).then((i) => {
      if (i?.data === 'ok') {
        setState(DEFAULT_STATE);
        reset();
      }
    });
  };

  return (
    <Page pageName={'Підписання файлу КЕП'} backRoute={'/'} loading={isLoading}>
      <Paper sx={{ p: 4, width: 500, mx: 'auto', mt: 3 }}>
        <Stack spacing={3}>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            {state.file_to_sign?.name || 'Файл, який необхідно підписати'}
            <VisuallyHiddenInput type="file" name={'file_to_sign'} onChange={handleChange} />
          </Button>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            {state.e_sign?.name || 'Файл підпису (КЕП)'}
            <VisuallyHiddenInput type="file" name={'e_sign'} onChange={handleChange} />
          </Button>
          <StyledInput label={'Пароль до КЕП'} name={'password'} onChange={handleChange} value={state.password} />
          <Button
            variant="contained"
            color={'success'}
            disabled={!state.file_to_sign || !state.e_sign || !state.password}
            onClick={handleUpload}
          >
            Завантажити
          </Button>
        </Stack>
        {data?.details && (
          <Typography color={'error'} sx={{ mt: 2 }} align={'center'}>
            {data.details}
          </Typography>
        )}
      </Paper>
    </Page>
  );
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

export default SignFile;
