import { AppBar, Box, Stack } from '@mui/material';
import { NAV_WIDTH } from '../data';
import { setLanguage, useFaqLanguage } from '../slice';
import { useIsFaqAdmin } from '../utils';
import { useDispatch } from 'react-redux';
import I18Control from '../../../i18n/Control';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from './Breadcrumbs';

const Header = ({ openNav, setOpenNav }) => {
  const isAdmin = useIsFaqAdmin();
  const dispatch = useDispatch();
  const language = useFaqLanguage();

  return (
    <AppBar sx={{ position: 'relative', zIndex: 2 }} color={'blue'} elevation={0}>
      <Stack direction={'row'} alignItems={'center'}>
        <Box
          sx={{
            width: openNav ? NAV_WIDTH : 44,
            transition: 'width 0.2s ease',
            overflow: 'hidden'
          }}
        >
          <IconButton
            size="small"
            sx={{ mx: 1 }}
            onClick={() => setOpenNav(!openNav)}
            id={'faq-navigation-btn'}
            data-marker={'toggle-faq-menu'}
            data-status={openNav ? 'open' : 'closed'}
          >
            {openNav ? <RemoveRoundedIcon sx={{ color: '#fff' }} /> : <MenuRoundedIcon sx={{ color: '#fff' }} />}
          </IconButton>
        </Box>
        <Breadcrumbs />
        <Box sx={{ flex: 1 }} />
        {isAdmin && <I18Control light onChange={(l) => dispatch(setLanguage(l))} value={language} />}
      </Stack>
    </AppBar>
  );
};

export default Header;
