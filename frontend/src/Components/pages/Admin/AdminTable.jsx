import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse/Collapse';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import ArchiveRounded from '@mui/icons-material/ArchiveRounded';
import CreateRounded from '@mui/icons-material/CreateRounded';
import clsx from 'clsx';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StickyTableHead from '../../Theme/Table/StickyTableHead';

import { clearAdminParams, getAllRoles, onArchiveUser, setAdminParams } from '../../../actions/adminActions';
import FormDatePicker from '../../../Forms/fields/FormDatePicker';
import FormInput from '../../../Forms/fields/FormInput';
import FormSelect from '../../../Forms/fields/FormSelect';
import { checkPermissions } from '../../../util/verifyRole';
import { ModalWrapper } from '../../Modal/ModalWrapper';
import { BlueButton } from '../../Theme/Buttons/BlueButton';
import { DangerButton } from '../../Theme/Buttons/DangerButton';
import Filter from '../../Theme/Table/Filter';
import NotResultRow from '../../Theme/Table/NotResultRow';
import { StyledTable } from '../../Theme/Table/StyledTable';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useSearchLog from '../../../services/actionsLog/useSearchLog';

function AdminTable({ dispatch, data, params, allRoles }) {
  const { t } = useTranslation();
  const [timeOut, setTimeOut] = useState(null);
  const [search, setSearch] = useState(params);
  const [archiveUser, setArchiveUser] = useState(null);
  const [updateRow, setUpdateRow] = useState(0);
  const searchLog = useSearchLog(['Адміністрування користувачів']);

  useEffect(
    () => () => {
      dispatch(clearAdminParams());
    },
    [dispatch]
  );

  useEffect(() => {
    setUpdateRow((prev) => prev + 1);
  }, [params]);

  useEffect(() => {
    setArchiveUser(null);
    if (allRoles?.length < 1) dispatch(getAllRoles());
  }, [data, dispatch]);

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

  const onArchive = () => {
    dispatch(onArchiveUser(archiveUser.uid, params));
  };

  const handleFilter = (filterValues) => {
    dispatch(
      setAdminParams(
        filterValues ? { ...search, ...filterValues, page: 1, size: 25 } : { ...search, page: 1, size: 25 }
      )
    );
    searchLog();
  };

  return (
    <>
      <StyledTable spacing={0}>
        <StickyTableHead>
          <TableRow>
            <TableCell style={{ minWidth: 300 }} className={'MuiTableCell-head'}>
              <p>{t('FIELDS.FULL_NAME_SHORT')}</p>
              <input
                type="text"
                value={search.full_name}
                onChange={({ target }) => onSearch('full_name', target.value)}
              />
            </TableCell>
            <TableCell style={{ minWidth: 200 }} className={'MuiTableCell-head'}>
              <p>{t('FIELDS.USERNAME')}</p>
              <input
                type="text"
                value={search.username}
                onChange={({ target }) => onSearch('username', target.value)}
              />
            </TableCell>
            <TableCell style={{ minWidth: 200 }} className={'MuiTableCell-head'}>
              <p>{t('FIELDS.EMAIL')}</p>
              <input type="text" value={search.email} onChange={({ target }) => onSearch('email', target.value)} />
            </TableCell>
            <TableCell style={{ minWidth: 122 }} className={'MuiTableCell-head'}>
              <p>{t('FIELDS.PHONE_NUMBER')}</p>
              <input type="text" value={search.phone} onChange={({ target }) => onSearch('phone', target.value)} />
            </TableCell>
            <TableCell style={{ minWidth: 140 }} className={'MuiTableCell-head'}>
              <p>{t('FIELDS.USER_TYPE')}</p>
              <input
                type="text"
                value={search.user_type}
                onChange={({ target }) => onSearch('user_type', target.value)}
              />
            </TableCell>
            <Filter onChange={handleFilter} name={'admin-filter-form'} unmount={true}>
              <Grid item xs={12} md={12}>
                <FormInput name={'org_name'} label={t('FIELDS.ORGANIZATION')} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormInput label={t('FIELDS.TAX_ID')} name={'tax_id'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormInput label={t('FIELDS.ORG_EIC_USREOU')} name={'org_eic_usreou'} />
              </Grid>
              <Grid item xs={12} md={12}>
                <FormSelect
                  label={t('FIELDS.ROLE')}
                  name={'role_name'}
                  data={allRoles.map((role) => ({ value: role?.role_ua, label: role?.role_ua }))}
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <FormDatePicker name={'role_date_start'} label={t('FIELDS.ROLE_DATE_START')} outFormat={'YYYY-MM-DD'} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormDatePicker name={'role_date_end'} label={t('FIELDS.ROLE_DATE_END')} outFormat={'YYYY-MM-DD'} />
              </Grid>
            </Filter>
          </TableRow>
          <TableRow style={{ height: 8 }}></TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.length > 0 ? (
            data.map((row, index) => (
              <Row {...row} key={`row-${index}-${updateRow}`} onArchive={() => setArchiveUser(row)} />
            ))
          ) : (
            <NotResultRow span={8} text={t('NO_USERS')} />
          )}
        </TableBody>
      </StyledTable>
      <ModalWrapper
        onClose={() => setArchiveUser(null)}
        open={Boolean(archiveUser)}
        header={t('CONFIRM_ARCHIVE_USER', { username: archiveUser?.username })}
      >
        <Stack>
          <p>{t('ONE_WAY_ACTION')}!</p>
          <p>{t('ARCHIVE_USER_WARNING')}</p>
        </Stack>
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={3}>
          <BlueButton onClick={() => setArchiveUser(null)} fullWidth>
            {t('CONTROLS.NO')}
          </BlueButton>
          <DangerButton onClick={onArchive} fullWidth>
            {t('CONTROLS.YES')}
          </DangerButton>
        </Stack>
      </ModalWrapper>
    </>
  );
}

const mapStateToProps = ({ admin }) => {
  return {
    params: admin.params,
    error: admin.error,
    allRoles: admin.allRoles
  };
};

export default connect(mapStateToProps)(AdminTable);

export const useExpandRowStyles = makeStyles({
  root: {
    boxShadow: '0px 4px 10px rgba(146, 146, 146, 0.1)',
    borderRadius: 10,
    '& > *': {
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: '1px solid #D1EDF3',
      borderTop: '1px solid #D1EDF3',
      backgroundColor: '#fff',
      fontSize: 12,
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
  rootOpen: {
    borderRadius: '10px 10px 0 0',
    '& > *': {
      backgroundColor: '#D1EDF3',
      '&:first-child': {
        borderRadius: '10px 0 0 0'
      },
      '&:last-child': {
        borderRadius: '0 10px 0 0'
      }
    }
  },
  rootArchived: {
    boxShadow: 'none',
    '& > *': {
      backgroundColor: '#f1f1f1',
      borderColor: '#f1f1f1'
    }
  },
  detail: {
    '& > *': {
      borderBottom: 'none'
    }
  },
  detailContainer: {
    backgroundColor: '#fff',
    margin: 0,
    padding: '8px 16px 16px',
    borderTop: 'none',
    border: '1px solid #D1EDF3',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    position: 'relative'
  },
  detailArchived: {
    backgroundColor: '#f1f1f1',
    borderColor: '#f1f1f1'
  },
  head: {
    '& > *': {
      color: '#567691',
      fontSize: 11,
      borderBottom: '1px solid #4A5B7A !important',
      paddingLeft: '16px !important',
      paddingRight: '24px !important',
      '&:first-child': {
        paddingLeft: '0 !important'
      },
      '&:last-child': {
        paddingRight: '0 !important'
      }
    }
  },
  headArchived: {
    '&>th': {
      background: '#f1f1f1 !important'
    }
  },
  body: {
    '& > *': {
      color: '#567691',
      fontSize: 10,
      fontWeight: 400,
      '&:first-child': {
        paddingLeft: 0
      },
      '&:last-child': {
        paddingRight: 0
      }
    }
  },
  controls: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 16,
    '& > *': {
      marginLeft: 16,
      padding: '3px 12px',
      '& > *': {
        fontSize: 10
      },
      '& svg': {
        fontSize: 12
      }
    }
  }
});

function Row({ id, uid, full_name, username, email, phone, user_relations, user_type, is_active, onArchive }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const classes = useExpandRowStyles();

  const Relations = ({ org, role, date_start, date_end }) => (
    <TableRow className={classes.body}>
      <TableCell data-marker={'org_name'}>{org.name}</TableCell>
      <TableCell data-marker={'org_usreou'}>{org.usreou ? `${org.usreou} / ${org.eic}` : org.eic}</TableCell>
      <TableCell data-marker={'role'}>{role.role_ua}</TableCell>
      <TableCell data-marker={'date_start'}>{date_start ? moment(date_start).format('DD.MM.YYYY') : null}</TableCell>
      <TableCell data-marker={'date_end'}>
        {date_end ? moment(date_end).format('DD.MM.YYYY') : t('UNLIMITED')}
      </TableCell>
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
        <TableCell data-marker={'user_type'}>{user_type?.name_ua}</TableCell>
        <TableCell align={'right'}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            data-marker={open ? 'expand' : 'collapse'}
            sx={{
              fontSize: 21,
              border: open ? '1px solid #F28C60' : '1px solid #223B82',
              color: open ? '#F28C60' : '#223B82'
            }}
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
              <div className={classes.controls}>
                {checkPermissions('USER_MANAGE.FUNCTIONS.ARCHIVE', 'АКО_Користувачі') && is_active && (
                  <DangerButton onClick={onArchive}>
                    <ArchiveRounded />
                    {t('CONTROLS.ARCHIVE')}
                  </DangerButton>
                )}
                {checkPermissions('USER_MANAGE.FUNCTIONS.EDIT_USER', 'АКО_Користувачі') && (
                  <BlueButton onClick={() => navigate(`/admin/manage-user/${uid}`)}>
                    {is_active && <CreateRounded />}
                    {is_active ? t('CONTROLS.EDIT_USER') : t('CONTROLS.VIEW_DETAILS')}
                  </BlueButton>
                )}
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
