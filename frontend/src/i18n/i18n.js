import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import TranslationUA from './ua/ua.json';
import TranslationEN from './en/en.json';
import { getFeature } from '../util/getFeature';
import { ReactComponent as LogoWhite } from '../images/LOGO_UKRENERGY_white.svg';
import { ReactComponent as LogoWhiteENG } from '../images/LOGO_UKRENERGY_white_en.svg';
import { ReactComponent as LogoTransparent } from '../images/LOGO_UKRENERGY_transparent.svg';
import { ReactComponent as LogoLogoTransparentENG } from '../images/LOGO_UKRENERGY_transparent_en.svg';
import uaLocale from 'date-fns/locale/uk';
import gbLocale from 'date-fns/locale/en-GB';

export const i18resources = {
  ua: {
    translation: TranslationUA,
    title: 'Ukrainian',
    titleShort: 'Ukr',
    code: 'ua',
    localeCode: 'uk',
    locale: uaLocale,
    flag: 'UA'
  },
  en: {
    translation: TranslationEN,
    title: 'English',
    titleShort: 'Eng',
    code: 'en',
    localeCode: 'gb',
    locale: gbLocale,
    flag: 'GB'
  }
};

export const i18assets = {
  ua: {
    logoWhite: <LogoWhite />,
    logoTransparent: <LogoTransparent />
  },
  en: {
    logoWhite: <LogoWhiteENG />,
    logoTransparent: <LogoLogoTransparentENG />
  }
};

i18n.use(initReactI18next).init({
  resources: i18resources,
  lng: getFeature('localization') ? localStorage.getItem('lang') || 'ua' : 'ua',
  keySeparator: '.',
  debug: true,
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
