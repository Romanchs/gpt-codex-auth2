import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import NavigationItem from './NavigationItem';
import Page from './Page';
import { useIsFaqAdmin } from '../utils';
import { useParams } from 'react-router-dom';

const Chapter = (props) => {
  const { name, pages = [], route } = props;
  const { t } = useTranslation();
  const { chapter } = useParams();
  const isAdmin = useIsFaqAdmin();
  const [open, setOpen] = useState(chapter === route);

  const availablePages = useMemo(() => (isAdmin ? pages : pages.filter((i) => i.visible)), [isAdmin, pages]);

  useEffect(() => {
    if (chapter === route && !open) {
      setOpen(true);
    }
  }, [chapter]);

  return (
    <NavigationItem open={open} onClick={() => setOpen(!open)} text={t(name)?.toUpperCase()}>
      <List component="div" disablePadding>
        {availablePages?.map((page) => (
          <Page key={page.apiKey} {...page} parentRoute={route} />
        ))}
      </List>
    </NavigationItem>
  );
};

export default Chapter;
