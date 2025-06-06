import Paper from '@mui/material/Paper';
import { AppBar, Box, Typography } from '@mui/material';

const PaperWithAppBar = ({ header, children }) => {
  return (
    <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', mb: 2 }}>
      <AppBar sx={{ position: 'relative', px: 3, py: 1.75, zIndex: 2 }} color={'blue'} elevation={0}>
        <Typography variant={'body1'}>{header}</Typography>
      </AppBar>
      <Box sx={{ position: 'relative', px: 3, py: 2 }}>{children}</Box>
    </Paper>
  );
};

export default PaperWithAppBar;
