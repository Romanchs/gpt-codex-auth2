import { toggleEditDialog, useFaqLanguage } from '../slice';
import { useIsFaqAdmin } from '../utils';
import { useFaqByKeyQuery, useFaqByUidQuery, useFaqTemplatesQuery } from '../api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { MOCK_UID, STATUS, useRoutes } from '../data';
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import SpeedDialog from './SpeedDialog';
import { useTranslation } from 'react-i18next';
import Chip from '@mui/material/Chip';
import { useDispatch } from 'react-redux';

const Content = forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const routes = useRoutes();
  const baseRoute = `/faq/${routes[0].route}/${routes[0].pages[0].route}`;
  const language = useFaqLanguage();
  const isAdmin = useIsFaqAdmin();
  const { chapter, page, uid } = useParams();
  const isDefault = uid === MOCK_UID;
  const [contentHeight, setContentHeight] = useState('100%');

  const { currentData: data, isSuccess, isFetching } = useFaqTemplatesQuery({ language }, { skip: !isAdmin });

  const selectedPage = useMemo(() => {
    const p = routes.find((i) => i.route === chapter)?.pages?.find((p) => p.route === page);
    return (isAdmin || p?.visible) && p;
  }, [routes, chapter, page]);

  const selectedTemplate = useMemo(() => {
    return data?.find((i) => i.uid === uid);
  }, [uid, data]);

  const { currentData: faqByKey, isFetching: isFetchingByKey } = useFaqByKeyQuery(
    {
      language: i18n.language,
      key: selectedPage?.apiKey
    },
    { skip: !selectedPage || isAdmin }
  );

  const { currentData: faqByUid, isFetching: isFetchingByUid } = useFaqByUidQuery(
    {
      uid
    },
    { skip: !uid || !data || !isAdmin || !selectedPage || !selectedTemplate }
  );

  const showFetching = isFetchingByUid || isFetchingByKey;
  const content = faqByUid?.content || faqByKey?.content;

  const checkRedirect = useCallback(() => {
    if (!selectedPage) {
      const defaultTemplateUid =
        data?.find((i) => i.key === routes[0].pages[0].apiKey && i.status === STATUS.DEFAULT)?.uid || MOCK_UID;
      navigate(`${baseRoute}/${defaultTemplateUid}`, { replace: true, state });
      return;
    }
    const uidValid = isDefault || data?.some((i) => i.uid === uid);
    const defaultTemplateForPage = data?.find((i) => i.key === selectedPage?.apiKey && i.status === STATUS.DEFAULT);
    if (!uid || !uidValid || (isDefault && defaultTemplateForPage)) {
      navigate(`/faq/${chapter}/${page}/${defaultTemplateForPage?.uid || MOCK_UID}`, { replace: true, state });
    }
  }, [selectedPage, uid, data, STATUS, navigate, chapter, page, state]);

  useEffect(() => {
    if (!isAdmin && !selectedPage) {
      navigate(baseRoute, { replace: true, state });
      return;
    }
    if (isSuccess && !isFetching) {
      checkRedirect();
    }
  }, [isAdmin, selectedPage, navigate, baseRoute, isSuccess, isFetching, checkRedirect, state]);

  const onRefChanged = useCallback((node) => {
    setContentHeight(node?.clientHeight ? `calc(100% - ${node?.clientHeight}px)` : '100%');
  }, []);

  return (
    <>
      <Box sx={{ height: 'calc(100% - 44px)' }} ref={ref}>
        {isAdmin && selectedTemplate && selectedTemplate.status !== STATUS.DEFAULT && (
          <Box sx={{ px: 4, pt: 2 }} ref={onRefChanged}>
            <Stack direction={'row'} spacing={0.75} alignItems={'center'}>
              <Typography variant={'body1'}>{t('PAGE_IS_AVAILABLE_FOR')}:</Typography>
              {selectedTemplate.roles?.map((role) => (
                <Chip
                  key={role}
                  label={t(`ROLES.${role.replaceAll(' ', '_')}`)}
                  onClick={() => dispatch(toggleEditDialog(selectedTemplate))}
                  color="blue"
                  size={'small'}
                />
              ))}
            </Stack>
            <Divider sx={{ mt: 2 }} />
          </Box>
        )}
        {showFetching && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {content && (
          <Box
            sx={{
              px: 14,
              py: 2,
              overflowY: 'auto',
              height: contentHeight
            }}
          >
            <Box id={'faq-content'} dangerouslySetInnerHTML={{ __html: content }} />
          </Box>
        )}
      </Box>
      {isAdmin && <SpeedDialog />}
    </>
  );
});

export default Content;
