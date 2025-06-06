import makeStyles from '@material-ui/core/styles/makeStyles';
import {useRef, useState} from 'react';
import {DropDownInput} from "../../../Forms/fields/DropDownInput";
import {useLazyGetUsersByTextQuery} from './api';
import { useTranslation } from 'react-i18next';

const SearchField = ({params, setParams}) => {
  const {t} = useTranslation();
  const classes = useStyles();
  const timeout = useRef(null);
  const [list, setList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');
  const [getUsers, {isFetching, isError}] = useLazyGetUsersByTextQuery();

  const renderListItem = (item, index, list, onSelect) => (
    <div className={'supplier-list--item'} key={`supplier-search-${index}`} onClick={() => onSelect(item)}>
      {item.full_name_responsible_people_for_check_doc}
    </div>
  );

  const handleSelectChange = ({target: {value}}) => {
    if(isFetching) return;
    setValue(value);
    setIsOpen(false);
    clearTimeout(timeout.current);
    if(value.length === 0) {
      const newParams = {...params, page: 1};
      delete newParams.modified_by;
      setParams(newParams);
    } else if(value.length >= 3) {
      setIsOpen(true);
      timeout.current = setTimeout(async() => {
        setList([...(await getUsers(value)).data]);
      }, 500);
    }
  };

  const handleSelect = (item) => {
    setParams({...params, page: 1, modified_by: item.uid});
    setValue(item.full_name_responsible_people_for_check_doc);
    setIsOpen(false);
  };

  return (
    <div className={classes.selectField}>
      <DropDownInput
        label={''}
        value={value}
        error={isError && t('NO_DATA_FOUND_BY_PARAMS')}
        onChange={handleSelectChange}
        open={isOpen}
        list={list}
        listItem={renderListItem}
        onSelect={handleSelect}
        emptyMessage={t('NO_DATA_FOUND_BY_PARAMS')}
        disabled={isFetching}
      />
    </div>
  );
};

export default SearchField;

const useStyles = makeStyles(() => ({
  selectField: {
    '& .MuiFormControl-root': {
      '& .MuiInputBase-formControl': {
        border: 'none',
        '&>input': {
          height: 20,
          backgroundColor: '#fff'
        }
      },
      '& .MuiFormHelperText-contained': {
        display: 'none'
      }
    },
    '& .drop-down.open': {
      transform: 'translateY(2px)'
    },
    '& .supplier-list--item': {
      color: '#0D244D'
    }
  }
}));
