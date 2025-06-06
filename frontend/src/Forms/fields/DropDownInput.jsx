import LinearProgress from '@material-ui/core/LinearProgress';
import { useEffect, useState } from 'react';

import StyledInput from '../../Components/Theme/Fields/StyledInput';
import { useTranslation } from 'react-i18next';

export const DropDownInput = ({
  label,
  name,
  onChange,
  value,
  open,
  list,
  listItem = null,
  error,
  onSelect,
  readOnly,
  emptyMessage,
  controlledFetching,
  isFetching = false,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(false);
  }, [list]);

  useEffect(() => {
    if (controlledFetching && !isFetching) {
      setLoading(false);
    }
  }, [controlledFetching, isFetching]);

  const handleOnChange = (e) => {
    onChange(e);
    setLoading(true);
  };

  return (
    <div className={'drop-down-menu'}>
      <StyledInput
        label={label}
        onChange={handleOnChange}
        value={value}
        error={error}
        name={name}
        readOnly={readOnly}
        {...props}
      />
      <div className={`drop-down ${open ? 'open' : ''}`}>
        {loading ? (
          <LinearProgress />
        ) : list?.length === 0 ? (
          <div className={'empty'}>{emptyMessage || t('NO_SUPPLIERS_DATA')}</div>
        ) : (
          <div className={'supplier-list'}>
            {list?.map((item, index) =>
              listItem ? (
                listItem(item, index, list, onSelect)
              ) : (
                <div className={'supplier-list--item'} key={`supplier-search-${index}`} onClick={() => onSelect(item)}>
                  {`${item.short_name} | ${t('CHARACTERISTICS.ESREOU')}: ${item.usreou}`}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
