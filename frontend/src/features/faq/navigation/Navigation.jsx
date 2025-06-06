import { NAV_WIDTH, useRoutes } from '../data';
import List from '@mui/material/List';
import { forwardRef, useMemo } from 'react';
import { Box } from '@mui/material';
import Chapter from './Chapter';
import { useIsFaqAdmin } from '../utils';

const Navigation = forwardRef(({ open }, ref) => {
  const routes = useRoutes();
  const isAdmin = useIsFaqAdmin();

  const availableRoutes = useMemo(
    () => (isAdmin ? routes : routes.filter((i) => i.pages.find((p) => p.visible))),
    [isAdmin, routes]
  );

  return (
    <List
      ref={ref}
      component="div"
      sx={{
        height: 'calc(100% - 44px)',
        width: open ? NAV_WIDTH : 0,
        transition: 'width 0.25s ease',
        boxShadow: '0px 4px 10px 0px #92929240',
        bgcolor: '#F8FAFF',
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'absolute',
        left: 0,
        zIndex: 2
      }}
    >
      <Box sx={{ width: NAV_WIDTH }}>
        {availableRoutes.map((ch) => (
          <Chapter key={ch.route} {...ch} />
        ))}
      </Box>
    </List>
  );
});

export default Navigation;
