import Box from '@mui/material/Box';
import { useRef, useState } from 'react';
import propTypes from 'prop-types';
import { DropDownInput } from '../../../Forms/fields/DropDownInput';
import { useTranslation } from 'react-i18next';
import {
  useLazyGetListAreasReportsQuery,
  useLazyGetListCompaniesReportsQuery,
  useLazyGetListOSRCompaniesReportsQuery,
  useLazyGetAuditorsQuery,
  useLazyGetPpkoListQuery
} from '../api';

const querySettings = {
  company: {
    args: (value, code) => ({ value, code }),
    hook: useLazyGetListCompaniesReportsQuery
  },
  metering_grid_area_id: {
    hook: useLazyGetListAreasReportsQuery
  },
  balance_areas: {
    hook: useLazyGetListAreasReportsQuery
  },
  osr_company: {
    hook: useLazyGetListOSRCompaniesReportsQuery
  },
  auditor: {
    hook: useLazyGetAuditorsQuery
  },
  ppko: {
    hook: useLazyGetPpkoListQuery
  }
};

const SearchField = ({ id, label, values, onChange, code, paramName, error, disabled }) => {
  const { t } = useTranslation();
  const ref = useRef();
  const [search, setSearch] = useState('');
  const currentQuery = querySettings[paramName];
  const [getData, { data, isFetching }] = currentQuery.hook();

  const handleInputChange = ({ target: { value } }) => {
    if (value?.length === 0) onChange(id, null);
    setSearch(value);
    if (isFetching) return;
    clearTimeout(ref.current);
    if (value?.length >= 3) {
      ref.current = setTimeout(() => {
        if (paramName === 'metering_grid_area_id' || paramName === 'balance_areas') {
          getData({
            area_id: value,
            code: code === 'change-supplier-ap-z' ? code : 'comparison-ppko-by-tko-z-and-zv'
          });
        } else if(paramName === 'auditor') {
          getData({ value, assigned: 0 });
        }
        else {
          getData(currentQuery.args ? currentQuery.args(value, code) : value);
        }
      }, 1000);
    }
  };

  return (
      <DropDownInput
        label={label}
        value={search || values[id]?.title || ''}
        onChange={handleInputChange}
        open={search.length >= 3}
        list={data?.slice(0)}
        listItem={(item, index, list, onSelect) => (
          <Box className={'supplier-list--item'} key={`supplier-search-${index}`} onClick={() => onSelect(item)}>
            {item.label}
          </Box>
        )}
        onSelect={(item) => {
          onChange(id, item);
          setSearch('');
        }}
        emptyMessage={t('NO_DATA_FOUND_BY_PARAMS')}
        disabled={isFetching || disabled}
        error={error}
      />
  );
};

SearchField.propTypes = {
  id: propTypes.string.isRequired,
  label: propTypes.string.isRequired,
  values: propTypes.object.isRequired,
  onChange: propTypes.func.isRequired,
  code: propTypes.string.isRequired,
  paramName: propTypes.string.isRequired,
  error: propTypes.string,
  disabled: propTypes.bool
};

export default SearchField;
