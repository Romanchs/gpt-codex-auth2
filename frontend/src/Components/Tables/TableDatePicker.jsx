import Box from '@mui/material/Box';
import DatePicker from '../Theme/Fields/DatePicker';
import propTypes from 'prop-types';

const TableDatePicker = ({ label = '', value = '', id, onChange, minWidth, ...props }) => {
  return (
    <Box
      sx={{
        mt: '5px',
        borderRadius: 1,
        bgcolor: '#FFFFFF',
        '& .MuiFormControl-root .MuiInputBase-root': {
          p: '3px 0px 3px 4px',
          borderRadius: 1,
          borderColor: 'transparent',
          '&.Mui-focused': {
            borderColor: 'transparent'
          },
          '& input': {
            mt: 0,
            p: '5px 7px 4.75px',
            border: 'none',
            fontSize: 12
          }
        }
      }}
    >
      <DatePicker label={label} value={value} id={id} onChange={onChange} minWidth={minWidth} {...props} />
    </Box>
  );
};

TableDatePicker.propTypes = {
  onChange: propTypes.func.isRequired,
  label: propTypes.string,
  value: propTypes.oneOfType([propTypes.object, propTypes.string]),
  id: propTypes.string,
  minWidth: propTypes.number
};

export default TableDatePicker;
