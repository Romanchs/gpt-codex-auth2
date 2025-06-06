import { Box, ListItemIcon, ListItemText, MenuItem, Select } from '@mui/material';
import { i18resources } from './i18n';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { getFeature } from '../util/getFeature';
import { useUpdateLanguageMutation } from '../app/mainApi';
import { useLocation } from 'react-router-dom';

const reloadList = [
  {
    path: '/tko/',
    hasUid: true
  },
  { path: '/processes/update-ap-history/' },
  { path: '/processes/connecting-disconnecting/', hasUid: true },
  { path: '/processes/update-aps-history/', hasUid: true }
];

const I18Control = ({ value, onChange, light = false, withOutFetch = false }) => {
  const { i18n } = useTranslation();
  const [fetch] = useUpdateLanguageMutation();
  const { pathname } = useLocation();

  if (!getFeature('localization')) {
    return null;
  }

  const handleChangeLanguage = (event) => {
    if (onChange) {
      onChange(event.target.value);
      return;
    }
    const code = event.target.value;
    i18n.changeLanguage(code).then(() => {
      localStorage.setItem('lang', code);
      if (withOutFetch) return;
      fetch(code).then((res) => {
        if (
          res.data.data === 'ok' &&
          reloadList.some(({ path, hasUid }) => pathname.includes(path) && (!hasUid || pathname.length > path.length))
        ) {
          window.location.reload();
        }
      });
    });
  };

  return (
    <Select
      value={value ?? i18n.language}
      onChange={handleChangeLanguage}
      MenuProps={{ disablePortal: true }}
      size={'small'}
      style={{ boxShadow: 'none' }}
      sx={{
        padding: 0,
        color: light ? '#fff' : 'inherit',
        '.MuiSelect-icon': {
          color: light ? '#fff' : 'inherit'
        },
        '.MuiOutlinedInput-notchedOutline': { border: 0 },
        '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          border: 0,
          boxShadow: '0'
        },
        '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          border: 0,
          boxShadow: '0'
        }
      }}
      renderValue={(value) => (
        <Box display={'flex'} gap={1} alignItems={'center'} onClick={(event) => event.stopPropagation()}>
          <ReactCountryFlag
            countryCode={i18resources[value].flag}
            svg
            style={{
              width: 30,
              height: 25,
              borderRadius: 5
            }}
            title={i18resources[value].title}
          />
          {i18resources[value].titleShort}
        </Box>
      )}
    >
      {Object.values(i18resources).map(({ code, title, flag }) => (
        <MenuItem key={code} value={code}>
          <ListItemIcon>
            <ReactCountryFlag
              countryCode={flag}
              svg
              style={{
                width: 30,
                height: 25
              }}
              title={title}
            />
          </ListItemIcon>
          <ListItemText primary={title} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default I18Control;
