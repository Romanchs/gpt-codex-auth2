import { Box, TableRow } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { useDispatch, useSelector } from 'react-redux';
import { openNotification, setSelected } from './slice';
import { useDeleteNotificationMutation } from './api';
import MarkEmailUnreadRoundedIcon from '@mui/icons-material/MarkEmailUnreadRounded';
import DraftsRoundedIcon from '@mui/icons-material/DraftsRounded';
import moment from 'moment';
import { useState } from 'react';

const Row = ({ notification }) => {
  const { subject, id, read, created_at } = notification;
  const dispatch = useDispatch();
  const selected = useSelector((store) => store.notifications.selected);
  const isSelected = Boolean(selected.includes(id));
  const [onDelete] = useDeleteNotificationMutation({ fixedCacheKey: 'delete-notifications' });
  const [hover, setHover] = useState(false);

  const handleChange = () => {
    dispatch(setSelected(isSelected ? selected.filter((i) => i !== id) : [...selected, notification.id]));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete([id]);
  };

  return (
    <TableRow
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      hover
      data-marker="table-row"
      className="body__table-row"
      sx={() => readsSx(read)}
      onClick={() => dispatch(openNotification(notification))}
    >
      <TableCell align={'center'} onClick={(e) => e.stopPropagation()}>
        <Checkbox
          sx={{ p: 0 }}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<TaskAltRoundedIcon color={'orange'} />}
          checked={isSelected}
          onChange={handleChange}
          data-marker={'checkbox'}
          data-status={isSelected ? 'active' : 'inactive'}
        />
      </TableCell>
      <TableCell>
        <p>
          <span style={{ display: 'inline-block', lineHeight: 1, verticalAlign: 'top', marginRight: 12 }}>
            {read ? <DraftsRoundedIcon fontSize={'small'} /> : <MarkEmailUnreadRoundedIcon fontSize={'small'} />}
          </span>
          {subject}
        </p>
      </TableCell>
      <TableCell align={'right'}>
        {read && hover ? (
          <Box sx={{ my: -0.25 }}>
            <CircleButton type={'delete'} size={'small'} onClick={handleDelete} />
          </Box>
        ) : (
          <p>
            {created_at
              ? moment(created_at).format(
                  moment(created_at).isAfter(moment().startOf('day')) ? 'HH:mm' : 'DD.MM.yyyy • HH:mm'
                )
              : ''}
          </p>
        )}
      </TableCell>
    </TableRow>
  );
};

export default Row;

const readsSx = (read) => ({
  '& p': {
    fontWeight: read ? 400 : 700,
    color: read ? '#999' : 'inherit'
  },
  '& > *': read
    ? {
        backgroundColor: '#F5F5F5 !important',
        borderColor: '#eee !important'
      }
    : null,

  '&:hover > *': read
    ? {
        backgroundColor: '#D1EDF3 !important'
      }
    : null
});
