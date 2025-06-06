import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useLocation, useNavigate } from 'react-router-dom';

import { useTitle } from '../../Hooks/useTitle';
import { NotFoundPage } from '../errors/NotFoundPage';
import Loading from '../Loadings/Loading';
import CircleButton from '../Theme/Buttons/CircleButton';
import propTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { checkPermissions } from '../../util/verifyRole';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSendEventMutation } from '../../features/actionsLog/api';
import useViewLog from '../../services/actionsLog/useViewLog';
import PageDialog from '../../features/faq/dialogs/PageDialog';
import IconButton from '@mui/material/IconButton';
import HelpRounded from '@mui/icons-material/HelpRounded';
import { accessToFaq } from '../../features/faq/utils';

const Page = ({
  pageName,
  faqKey,
  controls,
  children,
  backRoute,
  loading,
  notFoundMessage,
  redirectToProcesses = false,
  acceptRoles,
  acceptPermisions,
  disableLogging,
  rejectRoles
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const relation_id = useSelector((store) => store.user?.activeRoles?.[0]?.relation_id);
  const userUid = useSelector((s) => s.user.userUid);
  const activeRoles = useSelector((s) => s.user.activeOrganization?.roles.filter((role) => role.active));
  const activeCompanyId = useSelector((s) => s.user.activeOrganization?.uid);
  const [openFaq, setOpenFaq] = useState(false);
  const [sendEvent] = useSendEventMutation();
  useTitle(pageName);
  const viewLog = useViewLog();
  // const [openAlert, setOpenAlert] = useState(false);

  // const testClickForSnackbar = () => setOpenAlert(true);
  // useEffect(() => {
  //   document.addEventListener('contextmenu', testClickForSnackbar, false);
  //   return () => document.removeEventListener('contextmenu', testClickForSnackbar, false);
  // }, []);

  useEffect(() => {
    if (redirectToProcesses) {
      navigate('/processes');
    }
  }, [redirectToProcesses]);

  useLayoutEffect(() => {
    // @todo: delete
    if (
      (acceptRoles && !checkPermissions(acceptPermisions, acceptRoles)) ||
      (rejectRoles && !checkPermissions(acceptPermisions, rejectRoles, true))
    ) {
      navigate(typeof backRoute === 'string' ? backRoute || '/' : '/', { replace: true });
    } else {
      viewLog();
    }
  }, [acceptPermisions, acceptRoles, rejectRoles, relation_id, backRoute, navigate]);

  const handleBack = () => {
    if (!disableLogging)
      sendEvent({
        user: userUid,
        action: 'Повернення назад',
        source: 'tko-frontend',
        company: activeCompanyId,
        role: activeRoles[0].role,
        tags: [],
        referer: window.location.href
      });
    if (typeof backRoute === 'string') {
      if (state?.from) {
        navigate(state.from.pathname);
      } else {
        navigate(state?.techMode ? `${backRoute}?mode=${state?.techMode}` : backRoute, { state });
      }
    } else {
      backRoute();
    }
  };

  return (
    <>
      <Loading loading={Boolean(loading)} />
      <header className={'header'}>
        <Container maxWidth={'xl'}>
          <Grid container justifyContent={'space-between'} alignItems={'center'} style={{ height: 64 }} wrap={'nowrap'}>
            <Grid item xs={'auto'} style={{ overflow: 'hidden' }}>
              <div className={'page-name'}>
                {backRoute && (
                  <CircleButton onClick={handleBack} size={'small'} type={'back'} title={t('CONTROLS.BACK')} />
                )}
                <h2>{pageName}</h2>

                {faqKey && accessToFaq() && (
                  <IconButton
                    style={{ marginLeft: 8 }}
                    size={'small'}
                    data-marker={'page-faq-btn'}
                    onClick={() => setOpenFaq(true)}
                    title={'FAQ'}
                  >
                    <HelpRounded />
                  </IconButton>
                )}
              </div>
            </Grid>
            <Grid item xs={'auto'}>
              <div className={'controls'}>{controls && !notFoundMessage && controls}</div>
            </Grid>
          </Grid>
        </Container>
      </header>
      <Container style={{ paddingBottom: 60 }} maxWidth={'xl'}>
        {notFoundMessage ? <NotFoundPage message={notFoundMessage} /> : children}
      </Container>
      <PageDialog open={openFaq} onClose={() => setOpenFaq(false)} apiKey={faqKey} />
      {/*  <Snackbar*/}
      {/*    open={openAlert}*/}
      {/*    autoHideDuration={6000}*/}
      {/*    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}*/}
      {/*    onClose={() => setOpenAlert(false)}*/}
      {/*  >*/}
      {/*    <MuiAlert*/}
      {/*      severity="success"*/}
      {/*      variant="filled"*/}
      {/*      onClose={() => setOpenAlert(false)}*/}
      {/*    >*/}
      {/*      Event from server!*/}
      {/*    </MuiAlert>*/}
      {/*  </Snackbar>*/}
    </>
  );
};

Page.propTypes = {
  pageName: propTypes.string.isRequired,
  controls: propTypes.any,
  loading: propTypes.bool,
  faqLink: propTypes.string,
  acceptRoles: propTypes.arrayOf(propTypes.string),
  rejectRoles: propTypes.arrayOf(propTypes.string)
};

export default Page;
