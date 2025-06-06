import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import { useEffect, useState } from 'react';
import { clearAdminParams, setAdminParams } from '../../actions/adminActions';
import { useDispatch } from 'react-redux';
import moment from 'moment/moment';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import Collapse from '@material-ui/core/Collapse/Collapse';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import { useExpandRowStyles } from '../../Components/pages/Admin/AdminTable';
import { useTranslation } from 'react-i18next';
import useSearchLog from '../../services/actionsLog/useSearchLog';

export const UsersDirectoryTable = ({ data, params }) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [timeOut, setTimeOut] = useState(null);
  const [search, setSearch] = useState(params);
  const searchLog = useSearchLog();

  useEffect(
    () => () => {
      dispatch(clearAdminParams());
    },
    [dispatch]
  );

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        dispatch(setAdminParams({ ...params, [key]: value, page: 1 }));
        searchLog();
      }, 1000)
    );
  };

  return (
    <StyledTable spacing={0}>
      <TableHead>
        <TableRow>
          <TableCell style={{ minWidth: 200 }}>
            <p>{t('FIELDS.FULL_NAME_SHORT')}</p>
            <input
              type="text"
              value={search.full_name}
              onChange={({ target }) => onSearch('full_name', target.value)}
            />
          </TableCell>
          <TableCell style={{ minWidth: 200 }}>
            <p>{t('FIELDS.USERNAME')}</p>
            <input type="text" value={search.username} onChange={({ target }) => onSearch('username', target.value)} />
          </TableCell>
          <TableCell style={{ minWidth: 200 }}>
            <p>{t('FIELDS.EMAIL')}</p>
            <input type="text" value={search.email} onChange={({ target }) => onSearch('email', target.value)} />
          </TableCell>
          <TableCell style={{ minWidth: 122 }}>
            <p>{t('FIELDS.PHONE_NUMBER')}</p>
            <input type="text" value={search.phone} onChange={({ target }) => onSearch('phone', target.value)} />
          </TableCell>
          <TableCell style={{ minWidth: 140 }}>
            <p>{t('FIELDS.TAX_ID')}</p>
            <input type="text" value={search.user_type} onChange={({ target }) => onSearch('tax_id', target.value)} />
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableRow style={{ height: 8 }}></TableRow>
      </TableHead>
      <TableBody>
        {data?.length > 0 ? (
          data.map((row, index) => <Row {...row} key={`row-${index}`} />)
        ) : (
          <NotResultRow span={8} text={t('NO_USERS')} />
        )}
      </TableBody>
    </StyledTable>
  );
};

function Row({ id, full_name, username, email, phone, user_relations, is_active, tax_id }) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const classes = useExpandRowStyles();

  const Relations = ({ org, role, date_start, date_end }) => (
    <TableRow className={classes.body}>
      <TableCell data-marker={'org_name'}>{org.name}</TableCell>
      <TableCell data-marker={'org_usreou'}>{org.usreou ? `${org.usreou} / ${org.eic}` : org.eic}</TableCell>
      <TableCell data-marker={'role'}>{role.role_ua}</TableCell>
      <TableCell data-marker={'date_start'}>{date_start ? moment(date_start).format('DD.MM.YYYY') : null}</TableCell>
      <TableCell data-marker={'date_end'}>{date_end ? moment(date_end).format('DD.MM.YYYY') : t('UNLIMITED')}</TableCell>
    </TableRow>
  );

  return (
    <>
      <TableRow
        className={clsx(open && classes.rootOpen, !is_active && classes.rootArchived, classes.root)}
        data-marker={'table-row'}
      >
        <TableCell data-marker={'full_name'}>{full_name}</TableCell>
        <TableCell data-marker={'username'}>{username}</TableCell>
        <TableCell data-marker={'email'}>{email}</TableCell>
        <TableCell data-marker={'phone'}>{phone}</TableCell>
        <TableCell data-marker={'tax_id'}>{tax_id?.join(', ')}</TableCell>
        <TableCell align={'right'}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className={classes.expand}
            data-marker={open ? 'expand' : 'collapse'}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className={classes.detail} data-marker={`table-row--detail id-${id}`}>
        <TableCell style={{ paddingBottom: 8, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={clsx(!is_active && classes.detailArchived, classes.detailContainer)}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow className={clsx(!is_active && classes.headArchived, classes.head)}>
                    <TableCell style={{ minWidth: 200 }}>{t('FIELDS.ORGANIZATION')}</TableCell>
                    <TableCell style={{ minWidth: 200 }}>{t('FIELDS.ORG_EIC_USREOU')}</TableCell>
                    <TableCell style={{ minWidth: 200 }}>{t('FIELDS.ROLE')}</TableCell>
                    <TableCell style={{ minWidth: 200 }}>{t('FIELDS.ROLE_DATE_START')}:</TableCell>
                    <TableCell style={{ minWidth: 200 }}>{t('FIELDS.ROLE_DATE_END')}:</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user_relations.length === 0 ? (
                    <TableRow className={classes.body}>
                      <TableCell colSpan={5} align={'center'}>
                        {t('NO_ROLES_FOR_USER')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    user_relations.map((relation, index) => {
                      return <Relations {...relation} key={`relation-${id}-${index}`} />;
                    })
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
