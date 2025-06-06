import makeStyles from '@material-ui/core/styles/makeStyles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { LightTooltip } from '../Components/LightTooltip';

const Toggle = ({title, size, color, dataMarker, setSelected, selected, disabled}) => {
  const classes = useStyles();

  return (
    <LightTooltip title={title} data-marker={dataMarker} arrow disableTouchListener disableFocusListener>
      <span>
        <ToggleButton
          onChange={() => setSelected(!selected)}
          className={clsx(classes.root, classes.root + '--' + size, classes.root + '--' + color)}
          disabled={disabled}
          selected={selected}
          value={'toggle'}
        >
          <span className='toggle-switcher'></span>
        </ToggleButton>
      </span>
    </LightTooltip>
  );
};

Toggle.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
  color: PropTypes.oneOf(['green', 'orange', 'red', 'green-red']),
  dataMarker: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  disabled: PropTypes.bool
};

Toggle.defaultProps = {
  size: 'medium',
  color: 'green',
  disabled: false
};

export default Toggle;

const useStyles = makeStyles(() => ({
  root: {
    padding: 2,
    borderRadius: 24,
    border: 'none',
    boxSizing: 'border-box',
    transition: '.35s',
    '&.Mui-selected .toggle-switcher': {
      transform: 'translateX(12px)'
    },
    '& .toggle-switcher': {
      display: 'block',
      borderRadius: 50,
      backgroundColor: '#FFFFFF',
      transition: '.3s',
      transform: 'translateX(-12px)',
      '&:hover': {
        backgroundColor: '#F6FFCC'
      },
    },
    '&--small': {
      width: 46,
      height: 22,
      '& .toggle-switcher': {
        width: 18,
        height: 18
      }
    },
    '&--medium': {
      width: 56,
      height: 32,
      '& .toggle-switcher': {
        width: 28,
        height: 28,
      }
    },
    '&--green': {
      backgroundColor: '#9db99f',
      '&:hover': {
        backgroundColor: '#9cc99f'
      },
      '&.Mui-selected': {
        backgroundColor: '#008C0C',
        '&:hover': {
          backgroundColor: '#0e7c17'
        }
      },
      '&.Mui-disabled': {
        backgroundColor: '#b3ddb6'
      }
    },
    '&--orange': {
      backgroundColor: '#ffbb80',
      '&:hover': {
        backgroundColor: '#ffad66'
      },
      '&.Mui-selected': {
        backgroundColor: '#ff9840',
        '&:hover': {
          backgroundColor: '#ff7700'
        }
      },
      '&.Mui-disabled': {
        backgroundColor: '#ddcab3'
      }
    },
    '&--red': {
      backgroundColor: '#ff4850',
      '&:hover': {
        backgroundColor: '#ff2929'
      },
      '&.Mui-selected': {
        backgroundColor: '#ff3030',
        '&:hover': {
          backgroundColor: '#ff6666'
        }
      },
      '&.Mui-disabled': {
        backgroundColor: '#ddb3b3'
      }
    },
    '&--green-red': {
      backgroundColor: '#ff0000',
      '&:hover': {
        backgroundColor: '#ee0000'
      },
      '&.Mui-disabled': {
        backgroundColor: '#ddb3b3'
      },
      '&.Mui-selected': {
        backgroundColor: '#008C0C',
        '&:hover': {
          backgroundColor: '#0e7c17'
        },
        '&.Mui-disabled': {
          backgroundColor: '#b3ddb6'
        }
      }
    }
  }
}));
