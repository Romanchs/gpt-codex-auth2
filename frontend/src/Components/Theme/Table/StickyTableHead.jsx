import { styled } from '@mui/system';
import TableHead from '@mui/material/TableHead';

const StickyTableHead = styled(TableHead)({
  position: 'sticky',
  top: 0,
  zIndex: 2
});

export default StickyTableHead;
