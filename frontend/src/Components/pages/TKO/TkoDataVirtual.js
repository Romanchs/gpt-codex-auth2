import uaTranslations from '../../../i18n/ua/ua.json';
import { useTranslation } from 'react-i18next';

const pointToFields = (aps) => {
  return [{ value: aps.EIC, uid: aps.UID }];
};

const getTranslationKey = (translations, label) => {
  return Object.keys(translations).find((key) => translations[key]?.toLowerCase() === label?.toLowerCase());
};

const createAccordionItem = (label, aps) => {
  const { t } = useTranslation();
  const translations = uaTranslations.PLATFORM;
  const translationKey = getTranslationKey(translations, label);

  return {
    accordion: true,
    visible: true,
    title: translationKey ? t(`PLATFORM.${translationKey}`) : label,
    content: aps
  };
};

const createApItem = (ap, translations) => {
  const { t } = useTranslation();
  const translationKey = getTranslationKey(translations, ap.Label);

  const apJson = {
    accordion: true,
    visible: true,
    title: translationKey ? t(`PLATFORM.${translationKey}`) : ap.Label,
    titleEic: { eicCode: ap.EIC, uid: ap.UID },
    content: []
  };

  const item = {
    header: false,
    items: pointToFields(ap)
  };

  if (item.items[0]?.value !== ap.EIC) {
    apJson.content.push(item);
  }

  if ('ChildAps' in ap) {
    const childAps = apsToCode(ap);
    if (childAps.length > 0) {
      apJson.content = apJson.content.concat(childAps);
    }
  }

  return apJson;
};

const apsToCode = (json) => {
  const translations = uaTranslations.PLATFORM;
  const result = [];
  const values = Object.values(json.ChildAps || json.child_aps || {});

  for (const value of values) {
    const accordionItem = createAccordionItem(value.Label, []);
    result.push(accordionItem);
    for (const ap of value.Aps) {
      if (!ap?.ChildAps || (typeof ap?.ChildAps === 'object' && !Object.keys(ap?.ChildAps).length)) {
        const apJson = { visible: true, items: pointToFields(ap) };
        accordionItem.content.push(apJson);
      } else {
        const apJson = createApItem(ap, translations);
        accordionItem.content.push(apJson);
      }
    }
  }
  return result;
};

export const getAccordionVirtual = (selectedTko) => {
  if (selectedTko?.ChildAps && Object.keys(selectedTko?.ChildAps).length > 0) {
    return apsToCode(selectedTko);
  }
  return [];
};
