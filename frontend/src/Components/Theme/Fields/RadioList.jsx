import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import makeStyles from '@material-ui/core/styles/makeStyles';
import propTypes from 'prop-types';

import RadioButton from './RadioButton';
import { useTranslation } from 'react-i18next';

const RadioList = ({ data, selected, setSelected, groupName, ignoreI18 = false }) => {
  const classes = useStyles();
  const {t} = useTranslation();
  
  const handleSelect = (key) => {
    setSelected && setSelected(selected.includes(key) ? selected.filter((i) => i !== key) : [...selected, key]);
  };

  return (
    <RadioGroup aria-label={groupName} name={groupName} className={classes.radioGroup}>
      <Grid container spacing={2} alignItems={'flex-start'}>
        {data?.map(([key, value], index) => (
          <Grid item xs={12} sm={2} md={1} key={index + key}>
            <FormControlLabel
              className={classes.radioField + (setSelected ? '' : ' ' + classes.radioField_unchanged)}
              label={ignoreI18 ? value : t(value)}
              onChange={() => handleSelect(key)}
              control={<RadioButton checked={selected?.some((i) => i === key)} />}
              data-status={selected?.filter((i) => i === key).length ? 'active' : 'inactive'}
              data-marker={`${groupName}-${index}`}
            />
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
};

const useStyles = makeStyles(() => ({
  radioGroup: {
    padding: '14px 26px 10px'
  },
  radioField: {
    color: '#4A5B7A',
    '&>span svg>path': {
      fill: '#A9B9C6'
    },
    '&[data-status="active"]': {
      '&>span svg>path': {
        fill: '#4A5B7A'
      }
    }
  },
  radioField_unchanged: {
    cursor: 'default',
    '&>span': {
      cursor: 'default'
    }
  }
}));

RadioList.propTypes = {
  data: propTypes.array.isRequired,
  selected: propTypes.array.isRequired,
  groupName: propTypes.string.isRequired,
  setSelected: propTypes.oneOfType([propTypes.func, propTypes.bool])
};

RadioList.defaultProps = {
  setSelected: false
};

export default RadioList;
