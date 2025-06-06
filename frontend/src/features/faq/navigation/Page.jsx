import NavigationItem from './NavigationItem';
import { useTranslation } from 'react-i18next';
import { useIsFaqAdmin } from '../utils';
import { createContext, useState } from 'react';
import Templates from './Templates';
import { useNavigate, useParams } from 'react-router-dom';

export const PageContext = createContext(null);

const Page = ({ apiKey, route, name, parentRoute }) => {
  const { t } = useTranslation();
  const isAdmin = useIsFaqAdmin();
  const navigate = useNavigate();
  const { chapter, page } = useParams();
  const baseRoute = `/faq/${parentRoute}/${route}`;
  const isActive = parentRoute === chapter && page === route;
  const [open, setOpen] = useState(isActive);

  const handleClick = () => {
    if (isAdmin) {
      setOpen(!open);
    } else {
      navigate(baseRoute);
    }
  };

  return (
    <NavigationItem active={!isAdmin && isActive} text={t(name)} isChild onClick={handleClick} open={open}>
      {isAdmin && (
        <PageContext.Provider value={{ baseRoute, isActive, apiKey }}>
          <Templates />
        </PageContext.Provider>
      )}
    </NavigationItem>
  );
};

export default Page;
