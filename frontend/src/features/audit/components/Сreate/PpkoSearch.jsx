import { useLazyAuditPpkoSearchQuery } from '../../api';
import { useEffect, useRef, useState } from 'react';
import StyledInput from '../../../../Components/Theme/Fields/StyledInput';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTranslation } from 'react-i18next';

const PpkoSearch = ({ label, value, onChange, name, required = false }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [onSearch, { data, isFetching }] = useLazyAuditPpkoSearchQuery();
  const [localValue, setLocalValue] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value) {
      setLocalValue(value);
    }
  }, [value]);

  const handleOnChange = ({ target: { value: changeValue } }) => {
    setLocalValue(changeValue || '');
    setOpen(false);
    clearTimeout(ref.current);
    if (value && changeValue !== value) {
      onChange({
        name: '',
        eic_x: '',
        usreou: '',
        city: '',
        address: ''
      });
    }
    if (changeValue?.length > 2) {
      ref.current = setTimeout(() => {
        onSearch({ [name]: changeValue });
        setOpen(true);
      }, 500);
    }
  };

  const onSelect = (item) => {
    onChange({
      name: item?.full_name,
      eic_x: item?.eic,
      usreou: item?.usreou,
      city: item?.legal_address?.city,
      address: item?.legal_address?.address
    });
    setOpen(false);
    if (item?.[name] === value && item?.[name] !== localValue) {
      setLocalValue(item?.[name]);
    }
  };

  return (
    <div className={'drop-down-menu'}>
      <StyledInput label={label} onChange={handleOnChange} value={localValue} required={required} />
      <div className={`drop-down ${open ? 'open' : ''}`}>
        {isFetching ? (
          <LinearProgress />
        ) : data?.length === 0 ? (
          <div className={'empty'}>{t('PPKO_NOT_FOUND')}</div>
        ) : (
          <div className={'supplier-list'}>
            {data?.map((item, index) => (
              <div className={'supplier-list--item'} key={`supplier-search-${index}`} onClick={() => onSelect(item)}>
                {`${item.full_name} | ${t('CHARACTERISTICS.ESREOU')}: ${item.usreou} | ${t(
                  'CHARACTERISTICS.EIC_CODE'
                )}: ${item.eic}`}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PpkoSearch;
