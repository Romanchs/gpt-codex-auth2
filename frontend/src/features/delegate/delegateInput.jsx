import StyledInput from '../../Components/Theme/Fields/StyledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';
import { LightTooltip } from '../../Components/Theme/Components/LightTooltip';
import { useState } from 'react';
import moment from 'moment';

const DelegateInput = ({ data, ...props }) => {
  const [open, setOpen] = useState(false);

  const showDelegate = data?.length > 0;

  return (
    <LightTooltip
      title={
        <ul style={{ paddingLeft: 20, paddingRight: 8 }}>
          {data?.slice().sort((a, b) => moment(a?.time).isBefore(b?.time) ? 1 : -1).map(({ time, username }, index) => (
              <li key={username + index}>
                {username} — {moment(time).format('DD.MM.yyyy • HH:mm')}
              </li>
            ))}
        </ul>
      }
      arrow
      onOpen={() => setOpen(showDelegate)}
      open={open}
      onClose={() => setOpen(false)}
      PopperProps={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -10]
            }
          }
        ]
      }}
    >
      <div>
        <StyledInput
          {...props}
          endAdornment={
            showDelegate && (
              <InputAdornment position={'end'} data-marker='delegate-history'>
                <SyncAltRoundedIcon />
              </InputAdornment>
            )
          }
        />
      </div>
    </LightTooltip>
  );
};

export default DelegateInput;
