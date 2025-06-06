import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker as MaterialDatePicker } from '@material-ui/pickers';
import EditRounded from '@mui/icons-material/EditRounded';
import moment from 'moment';
import { StyledTable } from '../../Theme/Table/StyledTable';
import React, { useMemo, useState } from 'react';
import { FIELDTYPE } from '../../../Forms/fields/types';
import SearchDate from '../../Tables/SearchDate';
import TableSelect from '../../Tables/TableSelect';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../Theme/Table/StickyTableHead';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '100%',
    backgroundColor: 'transparent',
    marginTop: 8
  },
  cell: {
    borderBottom: 'none',
    background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%)',
    '&>p': {
      fontSize: 12,
      fontWeight: 400,
      color: '#567691'
    }
  },
  row: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10,
    '& > *': {
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#fff',
      fontSize: 12,
      color: '#4A5B7A',
      '&:first-child': {
        borderRadius: '10px 0 0 10px',
        borderLeft: '1px solid #D1EDF3'
      },
      '&:last-child': {
        borderRadius: '0 10px 10px 0',
        borderRight: '1px solid #D1EDF3'
      }
    }
  },
  space: {
    padding: 4,
    borderBottom: '0px solid transparent'
  },
  editDate: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 12
  },
  rootPicker: {
    position: 'relative',
    cursor: 'pointer',
    marginLeft: 8,
    '&:hover': {
      backgroundColor: '#efefef',
      borderRadius: 25,
      overflow: 'hidden'
    }
  },
  picker: {
    width: 25,
    height: 25,
    opacity: 0,
    '& input': {
      display: 'none'
    },
    '& .MuiInput-underline:after': {
      display: 'none'
    },
    '& .MuiInput-underline:before': {
      display: 'none'
    }
  },
  icon: {
    position: 'absolute',
    right: 3,
    top: 3,
    fontSize: 17,
    pointerEvents: 'none',
    cursor: 'pointer'
  },
  chip: {
    display: 'inline-block',
    minWidth: 120,
    borderRadius: 20,
    padding: '5px 12px',
    color: '#008C0C',
    fontSize: 12,
    lineHeight: 1.1,
    textAlign: 'center',
    backgroundColor: '#D1EDF3',
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      minWidth: 50,
      padding: '4px 12px',
      fontSize: 10
    }
  },
  warning: {
    color: '#FF0000'
  }
}));

const columns = [
  { id: 'name', title: 'FIELDS.ORGANIZATION', minWidth: 150, searchType: FIELDTYPE.TEXT },
  { id: 'usreou', title: 'FIELDS.ORG_EIC_USREOU', minWidth: 150, searchType: FIELDTYPE.TEXT },
  { id: 'role_ua', title: 'FIELDS.ROLE', minWidth: 150, searchType: FIELDTYPE.TEXT },
  { id: 'date_start', title: 'FIELDS.ROLE_DATE_START', minWidth: 150, searchType: FIELDTYPE.DATE },
  { id: 'date_end', title: 'FIELDS.ROLE_DATE_END', minWidth: 150, searchType: FIELDTYPE.DATE },
  {
    id: 'status',
    title: 'FIELDS.STATUS',
    minWidth: 150,
    searchType: FIELDTYPE.OPTION,
    options: [
      { label: 'FIELDS.ACTIVE', value: 'true' },
      { label: 'FIELDS.UNACTIVE', value: 'false' }
    ]
  }
];

function RolesTable({ relations, onChange, disabled }) {
  const { t } = useTranslation();
  const list = useMemo(
    () =>
      relations.map((item) => ({
        id: item?.id,
        name: item?.org?.name,
        usreou: item?.org?.eic,
        role_ua: item?.role?.role_ua,
        date_start: item?.date_start,
        date_end: item?.date_end,
        status:
          moment(item.date_start).startOf('day').isBefore(new Date()) &&
          moment(item.date_end).endOf('day').isAfter(new Date())
      })) || [],
    [relations]
  );

  const [search, setSearch] = useState({});

  const filteredList = useMemo(() => {
    if (Object.values(search).join('').length === 0) {
      return list || [];
    }
    if (list) {
      let copyData = list;

      Object.entries(search).forEach(([key, value]) => {
        copyData = copyData?.filter((item) =>
          item[key]
            ?.toString()
            ?.toLowerCase()
            ?.includes(value?.toString()?.toLowerCase() || '')
        );
      });
      return copyData;
    }
    return [];
  }, [search, list]);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
  };

  return (
    <StyledTable spacing={0} fullHeight>
      <StickyTableHead>
        <TableRow>
          {columns.map(({ minWidth, title, id, searchType, options }) => (
            <TableCell style={{ minWidth: minWidth }} className={'MuiTableCell-head'} key={'header' + id}>
              <p>{t(title)}</p>
              <SearchField
                key={id}
                id={id}
                value={search[id]}
                onSearch={onSearch}
                type={searchType}
                options={options}
              />
            </TableCell>
          ))}
        </TableRow>
        <TableRow style={{ height: 8 }}></TableRow>
      </StickyTableHead>
      <TableBody>
        {filteredList
          ?.sort((a, b) => b?.status - a?.status)
          .map((rel, index) => (
            <Row
              rel={rel}
              key={index}
              onChange={(id, data) =>
                onChange({
                  ...relations.find((relation) => relation.id === id),
                  ...data
                })
              }
              disabled={disabled}
            />
          ))}
      </TableBody>
    </StyledTable>
  );
}

export default RolesTable;

const Row = ({ rel, onChange, disabled }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <TableRow
        className={classes.row}
        style={{
          opacity:
            moment(rel.date_start).startOf('day').isBefore(new Date()) &&
            moment(rel.date_end).endOf('day').isAfter(new Date())
              ? 1
              : 0.6
        }}
      >
        <TableCell data-marker={'org_name'}>{rel.name}</TableCell>
        <TableCell data-marker={'org_eic'}>{rel.usreou || rel.eic}</TableCell>
        <TableCell data-marker={'role'}>{rel.role_ua}</TableCell>
        <TableCell data-marker={'date_start'}>{moment(rel.date_start).format('DD.MM.YYYY')}</TableCell>
        <TableCell data-marker={'date_end'}>
          <div className={classes.editDate}>
            {rel.date_end ? moment(rel.date_end).format('DD.MM.YYYY') : t('UNLIMITED')}
            {!disabled && (
              <div className={classes.rootPicker}>
                <MaterialDatePicker
                  cancelLabel={t('CONTROLS.CANCEL')}
                  okLabel={t('CONTROLS.APPLY')}
                  className={classes.picker}
                  value={rel.date_end}
                  minDate={rel.date_start}
                  minDateMessage={t('VERIFY_MSG.THE_END_DATE_MUST_BE_LESS_THAN_THE_START_DATE')}
                  autoOk
                  onChange={(d) => {
                    onChange(rel.id, { date_end: moment(d).format('yyyy-MM-DD') });
                  }}
                  variant={'modal'}
                  data-marker={'edit'}
                />
                <EditRounded className={classes.icon} data-marker={'edit-icon'} />
              </div>
            )}
          </div>
        </TableCell>
        <TableCell data-marker={'status'}>
          <span className={clsx(classes.chip, rel.status === false && classes.warning)}>
            {rel.status ? t('FIELDS.ACTIVE') : t('FIELDS.UNACTIVE')}
          </span>
        </TableCell>
      </TableRow>
      <TableRow colSpan={6}>
        <TableCell className={classes.space}> </TableCell>
      </TableRow>
    </>
  );
};

const SearchField = ({ id, value, type, onSearch, options }) => {
  const { t } = useTranslation();
  return (
    <>
      {type === FIELDTYPE.DATE && (
        <SearchDate name={id} onSearch={onSearch} column={{ id }} formatDate={'YYYY-MM-DD'} />
      )}
      {type === FIELDTYPE.OPTION && (
        <TableSelect
          value={value}
          data={options.map((i) => ({ ...i, label: t(i.label) }))}
          id={id}
          onChange={onSearch}
        />
      )}
      {type === FIELDTYPE.TEXT && (
        <input name={id} type={'text'} value={value || ''} onChange={({ target }) => onSearch(id, target.value)} />
      )}
    </>
  );
};
