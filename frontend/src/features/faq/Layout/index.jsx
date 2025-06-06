import Page from '../../../Components/Global/Page';
import Paper from '@mui/material/Paper';
import { useRef, useState } from 'react';
import Header from './Header';
import Navigation from '../navigation/Navigation';
import Content from '../content';
import EditFaqDialog from '../dialogs/EditFaqDialog';
import PublishFaqDialog from '../dialogs/PublishFaqDialog';
import DeleteFaqDialog from '../dialogs/DeleteFaqDialog';
import { ClickAwayListener } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CopyFaqDialog from '../dialogs/CopyFaqDialog';

const Layout = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [openNav, setOpenNav] = useState(false);

  const handleClickAway = (e) => {
    if (openNav && ref.current.contains(e.target)) {
      setOpenNav(false);
    }
  };

  return (
    <Page pageName={t('PAGES.CONTEXTUAL_HELP')} backRoute={'/'}>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          height: 'calc(100vh - 140px)'
        }}
      >
        <Header openNav={openNav} setOpenNav={setOpenNav} />
        <ClickAwayListener onClickAway={handleClickAway} mouseEvent={'onMouseDown'}>
          <Navigation open={openNav} />
        </ClickAwayListener>
        <Content ref={ref} />
      </Paper>
      <EditFaqDialog />
      <PublishFaqDialog />
      <DeleteFaqDialog />
      <CopyFaqDialog />
    </Page>
  );
};

export default Layout;
