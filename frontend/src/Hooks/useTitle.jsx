import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useTitle = (title) => {
  const {t} = useTranslation();
  useEffect(() => {
    title && (document.title = `${title} | DATAHUB`);

    return () => (document.title = t('TITLE'));
  }, [title]);
};
