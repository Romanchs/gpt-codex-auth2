import { AppBar, Box, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import * as React from 'react';
import Slide from '@mui/material/Slide';
import { useFaqByKeyQuery } from '../api';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { useRoutes } from '../data';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PageDialog = ({ open, onClose, apiKey }) => {
  const { i18n, t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const routes = useRoutes();

  const { data, isFetching, isSuccess } = useFaqByKeyQuery(
    {
      language: i18n.language,
      key: apiKey
    },
    { skip: !open }
  );

  const handleOpenFaq = () => {
    const chapter = routes.find((i) => i.pages.some((p) => p.apiKey === apiKey));
    const page = chapter.pages.find((p) => p.apiKey === apiKey);
    navigate(`/faq/${chapter.route}/${page.route}`, { state: { from: { pathname } } });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={'xl'}
      TransitionComponent={Transition}
      PaperProps={{
        sx: { borderRadius: 2, width: 1900 }
      }}
    >
      <AppBar sx={{ position: 'relative' }} color={'blue'}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" data-marker={'notification--header'}>
            {t('PAGES.CONTEXTUAL_HELP')}
          </Typography>
          <CircleButton
            color={'blue'}
            icon={<MenuBookIcon />}
            title={t('CONTROLS.GO_TO_FAQ')}
            dataMarker={'to-faq'}
            onClick={handleOpenFaq}
          />
          <IconButton edge="start" color="inherit" onClick={onClose} data-marker={'close'} sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxHeight: 'calc(100vh - 200px)', minHeight: 200, overflow: 'auto', py: 3, px: 5 }}>
        {isFetching && (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        )}
        {isSuccess &&
          (data?.content ? (
            <Box
              data-marker={'notification--body'}
              dangerouslySetInnerHTML={{
                __html: data.content
              }}
            />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <LiveHelpIcon color={'error'} sx={{ fontSize: 54 }} />
              <Typography variant={'h4'}>
                {t('MODALS.CONTEXTUAL_HELP_FOR_THIS_PAGE_IS_STILL_UNDER_DEVELOPMENT')}
              </Typography>
              <Typography variant={'body1'}>{t('MODALS.PLEASE_CONTACT_SUPPORT_SERVICE')}</Typography>
            </Box>
          ))}
      </Box>
    </Dialog>
  );
};

export default PageDialog;
