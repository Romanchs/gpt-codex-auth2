import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const EditingList = ({ list, onChange }) => {
  const [innerList, setInnerList] = useState(list);
  const { t } = useTranslation();

  const handleAdd = () => {
    const data = [...innerList, ''];
    setInnerList(data);
    onChange(data);
  };

  const handleDelete = (index) => {
    const data = innerList.filter((_, i) => i !== index);
    setInnerList(data);
    onChange(data);
  };

  const handleChange = (index, value) => {
    const data = innerList.map((text, i) => (i === index ? value : text));
    setInnerList(data);
    onChange(data);
  };

  return (
    <Stack spacing={3}>
      {innerList?.map((text, i) => (
        <Stack key={i} direction={'row'} spacing={3} alignItems={'center'}>
          <TextField
            label={`${t('FIELDS.USERNAME')} ${i === 0 ? '' : i}`}
            value={text}
            size={'small'}
            fullWidth
            onChange={({ target: { value } }) => handleChange(i, value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EditRounded sx={{ fill: '#C6C6C6' }} data-marker={'edit'} />
                </InputAdornment>
              )
            }}
          />
          <IconButton
            sx={(theme) => ({ boxShadow: theme.shadows[3] })}
            onClick={() => handleDelete(i)}
            data-marker={'delete'}
          >
            <DeleteRounded sx={{ fill: '#FF4850' }} />
          </IconButton>
        </Stack>
      ))}
      <Stack alignItems={'flex-end'}>
        <Button
          color={'success'}
          variant="contained"
          startIcon={<AddRounded />}
          sx={{ borderRadius: 4, fontWeight: 400 }}
          onClick={handleAdd}
        >
          {t('CONTROLS.ADD')}
        </Button>
      </Stack>
    </Stack>
  );
};

EditingList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired
};

export default EditingList;
