import React from 'react';
import { mainApi } from '../../../app/mainApi';
import SelectField from '../../../Components/Theme/Fields/SelectField';
import MultiSelect from '../../../Components/Theme/Fields/MultiSelect';
import Autocomplete from '../../../Components/Theme/Fields/Autocomplete';

export const AsyncSelectField = ({ apiPath, params, type = 'select', ...props }) => {
  const { data, isFetching } = mainApi.endpoints[apiPath].useQuery(params);

  switch (type) {
    case 'select':
      return <SelectField data={data || []} loading={isFetching} {...props} />;
    case 'multiselect':
      return <MultiSelect list={data || []} loading={isFetching} {...props} />;
    case 'autocomplete':
      return <Autocomplete list={data || []} loading={isFetching} {...props} />;
    default:
      return null;
  }
};
