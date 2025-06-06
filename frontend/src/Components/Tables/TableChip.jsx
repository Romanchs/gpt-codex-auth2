import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

const TableChip = styled(({ isAnswer, ...props }) => <Chip {...props} />)(({ theme, isAnswer, label }) => ({
  backgroundColor: isAnswer ? 'rgba(209, 237, 243, 0.49)' : 'rgba(86, 118, 145, 1)',
  color: isAnswer ? (label.toLowerCase() === 'так' ? '#008C0C' : '#FF4850') : '#fff',
  fontSize: 12,
  fontWeight: 400,
  height: theme.spacing(3),
  padding: '0 10px'
}));

export default TableChip;
