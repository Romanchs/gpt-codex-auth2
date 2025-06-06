import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useIsFaqAdmin } from '../utils';
import { STATUS, useRoutes } from '../data';
import { useFaqLanguage } from '../slice';
import { useFaqTemplatesQuery } from '../api';
import { useParams } from 'react-router-dom';

const Breadcrumbs = () => {
  const { t } = useTranslation();
  const { chapter, page, uid } = useParams();
  const isAdmin = useIsFaqAdmin();
  const routes = useRoutes();
  const language = useFaqLanguage();
  const { data } = useFaqTemplatesQuery({ language }, { skip: !isAdmin });

  const breadcrumbs = useMemo(() => {
    const ch = routes.find((i) => i.route === chapter);
    if (!ch) return [];
    const p = ch.pages.find((i) => i.route === page);
    if (!p) return [ch.name];
    if (isAdmin && uid && data) {
      const template = data?.find((i) => i.uid === uid);
      return [
        ch?.name,
        p?.name,
        template?.status === STATUS.DEFAULT || uid === 'default' ? t('DEFAULT') : template?.template_name
      ];
    }
    return [ch?.name, p?.name];
  }, [chapter, page, uid, routes, data]);

  return (
    <MuiBreadcrumbs
      color={'#fff'}
      sx={{
        borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
        py: 1.5,
        px: 2,
        height: 43.5
      }}
    >
      {breadcrumbs.map((b, index) => (
        <Typography key={index} variant={'body1'} sx={{ fontWeight: 700 }}>
          {t(b)}
        </Typography>
      ))}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
