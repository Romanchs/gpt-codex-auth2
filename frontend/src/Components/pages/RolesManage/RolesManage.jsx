import IconButton from '@material-ui/core/IconButton';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ArchiveRounded from '@mui/icons-material/ArchiveRounded';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useDebounce } from '../../../Hooks/useDebounce';
import Page from '../../Global/Page';
import CircleButton from '../../Theme/Buttons/CircleButton';
import NotResultRow from '../../Theme/Table/NotResultRow';
import { Pagination } from '../../Theme/Table/Pagination';
import { StyledTable } from '../../Theme/Table/StyledTable';
import { rolesManageActions } from './roles-manage.slice';
import { useStyles } from './styles';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../Theme/Table/StickyTableHead';

const columns = [
  {
    id: 'code',
    title: 'FIELDS.ROLE_NAME_IN_SYSTEM',
    width: 100
  },
  { id: 'name_ua', title: 'FIELDS.ROLE_NAME', width: 100 },
  { id: 'note', title: 'FIELDS.NOTE', width: 400 }
];

export const RolesManage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState();

  const debouncedSetRolesManageParams = useDebounce((params) => dispatch(rolesManageActions.setSearchParams(params)));

  const { loading, rolesList, searchParams } = useSelector(({ rolesManege }) => rolesManege);

  const onSearch = (key, value) => {
    setSearch({ ...search, [key]: value });
    debouncedSetRolesManageParams({ ...searchParams, [key]: value, page: 1 });
  };

  const onPaginate = () => {};

  const onArchived = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    dispatch(rolesManageActions.getList(searchParams));
  }, [dispatch, searchParams]);

  return (
    <Page
      pageName={t('PAGES.ROLES_MANAGE')}
      backRoute={'/'}
      loading={loading}
      controls={
        <>
          <CircleButton
            type={'add'}
            title={t('CONTROLS.ADD_ROLE')}
            onClick={() => navigate('/admin/roles-manage/create')}
          />
        </>
      }
    >
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ id, width, title }) => (
              <TableCell style={{ width: width }} className={'MuiTableCell-head'} key={'header' + title}>
                <p>{`${t(title)}:`}</p>
                <input type="text" value={search[id]} onChange={({ target }) => onSearch(id, target.value)} />
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {rolesList?.length > 0 ? (
            rolesList.map((row) => <Row {...row} key={'row-' + row.name} onArchived={onArchived} />)
          ) : (
            <NotResultRow span={6} text={t('NOT_FOUND')} />
          )}
        </TableBody>
      </StyledTable>
      <Pagination
        {...rolesList}
        params={searchParams}
        loading={loading}
        elementsName={t('PAGINATION.ROLES')}
        onPaginate={onPaginate}
      />
    </Page>
  );
};

const Row = ({ uid, code, name_ua, note, archived, onArchived }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableRow
      className={`${archived && classes.archivedRow} body__table-row`}
      data-marker="table-row"
      onClick={() => navigate.push(`/admin/roles-manage/${uid}`)}
      hover
    >
      <TableCell data-marker={'code'}>{code || '-'}</TableCell>
      <TableCell data-marker={'name_ua'}>{name_ua || '-'}</TableCell>
      <TableCell data-marker={'note'}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{note || '-'}</span>
          {!archived && (
            <IconButton onClick={onArchived} className={classes.button} size={'small'}>
              <ArchiveRounded />
            </IconButton>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
