import { useTranslation } from 'react-i18next';
import { i18assets } from '../../i18n/i18n';
import propTypes from 'prop-types';

export const Logo = ({ type = 'logoWhite' }) => {
  const { i18n } = useTranslation();

  return i18assets[i18n.language][type];
};

Logo.propTypes = {
  type: propTypes.oneOf(['logoWhite', 'logoTransparent'])
};
