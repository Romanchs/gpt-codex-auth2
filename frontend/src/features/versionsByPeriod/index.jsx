import SelectField from '../../Components/Theme/Fields/SelectField';
import { useVersionsByPeriodQuery } from './api';
import moment from 'moment';
import { useEffect } from 'react';

const VersionsByPeriod = ({
  from_date,
  to_date,
  datesError = {},
  value,
  onChange,
  useNull = false,
  useEmptySting = false,
  ...props
}) => {
  const invalidDates =
    !from_date ||
    !to_date ||
    !moment(from_date).isValid() ||
    !moment(to_date).isValid() ||
    moment(from_date).isAfter(to_date) ||
    Object.values(datesError).some(Boolean);

  const { data, isFetching } = useVersionsByPeriodQuery(
    {
      from_date: moment(from_date)?.format('yyyy-MM-DD'),
      to_date: moment(to_date)?.format('yyyy-MM-DD')
    },
    { skip: invalidDates }
  );

  const vesions = data?.versions || [];
  const defaultValue = useEmptySting ? '' : '*';

  useEffect(() => {
    if (value && value !== '*' && !isFetching) {
      !vesions.some((i) => i === value) && onChange(useNull ? null : '*');
    }
  }, [vesions, value]);

  return (
    <SelectField
      {...props}
      loading={isFetching}
      value={typeof value === 'number' && !isFetching ? value?.toString() : defaultValue}
      onChange={(v) => onChange(v === defaultValue ? (useNull ? null : defaultValue) : Number(v))}
      data={(useEmptySting ? vesions : ['*', ...vesions]).map((i) => ({ value: i.toString(), label: i.toString() }))}
      disabled={invalidDates || isFetching || vesions?.length === 0}
      dataMarker={'version'}
      ignoreI18
    />
  );
};

export default VersionsByPeriod;
