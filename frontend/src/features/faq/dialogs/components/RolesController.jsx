import { ROLES } from '../../../../util/directories';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Autocomplete, Chip } from '@mui/material';
import TextField from '@mui/material/TextField';
import CancelIcon from '@mui/icons-material/Cancel';

const RolesController = ({ roles, setRoles, disableRoles = [] }) => {
  const { t } = useTranslation();

  const list = useMemo(
    () =>
      Object.keys(ROLES).map((i) => ({
        value: i,
        label: t(`ROLES.${i.replaceAll(' ', '_')}`)
      })),
    [t, ROLES]
  );

  const handleChange = (e, roles) => {
    setRoles(roles.map((i) => i.value));
  };

  return (
    <Autocomplete
      options={list}
      multiple
      value={list.filter((i) => roles.includes(i.value))}
      getOptionLabel={(option) => option.label}
      onChange={handleChange}
      noOptionsText={`${t('NO_ROLES_FOUND')}...`}
      getOptionDisabled={(option) => disableRoles.includes(option.value)}
      renderInput={(params) => <TextField {...params} label={t('ROLES_SECTION')} placeholder={`${t('SEARCH')}...`} />}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const tagProps = getTagProps({ index });
          return (
            <Chip
              key={option.value}
              color={'blue'}
              size='small'
              label={option.label}
              {...tagProps}
              deleteIcon={<CancelIcon data-marker={`delete-icon-${index}`}/>}
            />
          );
        })
      }
    />
  );
};

export default RolesController;
