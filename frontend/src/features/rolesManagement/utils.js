import { DICTIONARY_LABELS, DICTIONARY_PROPERTIES, ICONS, PROPERTY_VALUE } from './constants';
import TRANSLATIONS from '../../app/ua.json';

export const getUiPermissions = (data, parentKey = null) => {
  const array = [];

  if (typeof data === 'object') {
    const keys = Object.keys(data);

    keys.forEach((key) => {
      array.push(...getUiPermissions(data[key], parentKey ? `${parentKey}.${key}` : key));
    });
  } else {
    if (data === PROPERTY_VALUE.DISABLED || data === PROPERTY_VALUE.ON) {
      array.push(parentKey);
    }
  }

  return array;
};

export const getLabelFromPath = (path) => {
  const splitPath = path.split('_');
  const property = splitPath[splitPath.length - 1];

  if (DICTIONARY_PROPERTIES.includes(property)) {
    return DICTIONARY_LABELS[property];
  }

  return DICTIONARY_LABELS[path] || path;
};

export const transformDataToThree = (data, disabled = false, parentKey = null) => {
  const array = [];

  if (typeof data === 'object') {
    const keys = Object.keys(data);

    keys.forEach((key) => {
      if (typeof data[key] === 'number' || typeof data[key] === 'object') {
        const obj = {
          value: parentKey ? `${parentKey}.${key}` : key,
          label: TRANSLATIONS.PERMISSIONS[parentKey ? `${parentKey}.${key}` : key] || key,
          icon: ICONS[key] || null,
          disabled: disabled || data[key] === PROPERTY_VALUE.DISABLED
        };

        const res = transformDataToThree(data[key], disabled, parentKey ? `${parentKey}.${key}` : key);

        if (res.length) {
          obj.children = res;
        }

        array.push(obj);
      }
    });
  }

  return array;
};

export const getUpdateData = (data, checked, parentKey) => {
  const obj = {};

  if (typeof data === 'object') {
    const keys = Object.keys(data);

    keys.forEach((key) => {
      const value = data[key];

      if (typeof value === 'object') {
        obj[key] = getUpdateData(value, checked, parentKey ? `${parentKey}.${key}` : key);
      } else {
        obj[key] =
          data[key] === PROPERTY_VALUE.DISABLED
            ? PROPERTY_VALUE.DISABLED
            : checked.includes(`${parentKey}.${key}`)
            ? PROPERTY_VALUE.ON
            : PROPERTY_VALUE.OFF;
      }
    });
  }

  return obj;
};

export const getChangesData = (oldData, newData) => {
  let result = {};

  const recurse = (obj1, obj2, path) => {
    if (typeof obj1 === 'object') {
      const keys = Object.keys(obj1);

      keys.forEach((key) => {
        const currentPath = path.concat([key]);
        const oldValue = obj1[key];
        const newValue = obj2[key];

        if (typeof oldValue === 'object') {
          recurse(obj1[key], obj2[key], currentPath);
        } else {
          const label = TRANSLATIONS.PERMISSIONS[currentPath.join('.')] || key;

          if (!result[currentPath[0]]) {
            result[currentPath[0]] = { added: [], removed: [] };
          }

          if (oldValue === PROPERTY_VALUE.OFF && newValue === PROPERTY_VALUE.ON) {
            result[currentPath[0]].added.push(label);
          }

          if (oldValue === PROPERTY_VALUE.ON && newValue === PROPERTY_VALUE.OFF) {
            result[currentPath[0]].removed.push(label);
          }
        }
      });
    }
  };

  recurse(oldData, newData, []);

  return result;
};

export const filterNodes = (nodes, valueSearch) => {
  return nodes.reduce((acc, value) => filterNodesHelp(acc, value, valueSearch), []);
};

export const filterNodesHelp = (filtered, node, valueSearch) => {
  const children = (node.children || []).reduce((acc, value) => filterNodesHelp(acc, value, valueSearch), []);

  if (node.label.toLocaleLowerCase().indexOf(valueSearch.toLocaleLowerCase()) > -1 || children.length) {
    filtered.push({ ...node, children: children?.length ? children : null });
  }

  return filtered;
};
