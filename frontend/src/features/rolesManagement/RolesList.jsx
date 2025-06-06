import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { useNavigate } from 'react-router-dom';
import Page from '../../Components/Global/Page';
import { useRolesListQuery, useUpdateRoleMutation } from './api';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { StyledTable } from '../../Components/Theme/Table/StyledTable';
import React, { useRef, useState } from 'react';
import NotResultRow from '../../Components/Theme/Table/NotResultRow';
import IconButton from '@material-ui/core/IconButton';
import ArchiveRounded from '@mui/icons-material/ArchiveRounded';
import UnarchiveRounded from '@mui/icons-material/UnarchiveRounded';
import { useStyles } from './styles';
import clsx from 'clsx';
import CancelModal from '../../Components/Modal/CancelModal';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import { useTranslation } from 'react-i18next';
import StickyTableHead from '../../Components/Theme/Table/StickyTableHead';

const columns = [
  {
    id: 'code',
    title: 'FIELDS.ROLE_NAME_IN_SYSTEM',
    width: '20%'
  },
  { id: 'name_ua', title: 'FIELDS.ROLE_NAME', width: '20%' },
  { id: 'note', title: 'FIELDS.NOTE', width: '60%' }
];

export const RolesList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = useStyles();
  const ref = useRef();

  const [archiveRole, setArchiveRole] = useState(null);
  const [search, setSearch] = useState({});
  const [params, setParams] = useState({ page: 1, size: 25 });
  const { data, isFetching } = useRolesListQuery(params);
  const [updateRole] = useUpdateRoleMutation();

  const handleArchive = (uid) => {
    const p = { ...archiveRole, is_active: !archiveRole.is_active };
    updateRole({ uid, ...p }).then(() => setArchiveRole(null));
  };

  const handleSearch = (id, value) => {
    setSearch({ ...search, [id]: value });
    if (!value) {
      setParams({ ...params, [id]: undefined });
      return;
    }
    if (value.length < 3) return;
    clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      setParams({ ...params, [id]: value });
    }, 500);
  };

  return (
    <Page
      pageName={t('PAGES.ROLES_MANAGE')}
      loading={isFetching}
      backRoute={'/'}
      controls={<CircleButton type={'add'} title={t('CONTROLS.ADD_ROLE')} onClick={() => navigate('create')} />}
    >
      <StyledTable>
        <StickyTableHead>
          <TableRow>
            {columns.map(({ width, title, id }) => (
              <TableCell style={{ width: width }} className={'MuiTableCell-head'} key={'header' + id}>
                <p>{`${t(title)}:`}</p>
                {title && (
                  <input
                    type="text"
                    value={search[id] || ''}
                    onChange={({ target }) => handleSearch(id, target.value)}
                  />
                )}
              </TableCell>
            ))}
          </TableRow>
        </StickyTableHead>
        <TableBody>
          {data?.data?.length > 0 &&
            data.data
              .slice()
              .sort((a, b) => Number(b.is_active) - Number(a.is_active))
              .map((role, index) => (
                <TableRow
                  key={role?.uid || index}
                  className={clsx('body__table-row', !role?.is_active && classes.archived)}
                  data-marker="table-row"
                  onClick={() => navigate(`/admin/roles-manage/${role?.uid}`)}
                  hover
                >
                  <TableCell data-marker={'code'}>{role?.code || '-'}</TableCell>
                  <TableCell data-marker={'name_ua'}>{role?.name_ua || '-'}</TableCell>
                  <TableCell data-marker={'note'}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{role?.note || '-'}</span>
                      {role?.is_active && (
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation();
                            setArchiveRole(role);
                          }}
                          className={classes.buttonArchive}
                          size={'small'}
                          data-marker={'buttonArchive'}
                        >
                          <ArchiveRounded />
                        </IconButton>
                      )}
                      {!role?.is_active && (
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation();
                            setArchiveRole(role);
                          }}
                          className={classes.buttonUnArchive}
                          size={'small'}
                          data-marker={'buttonUnarchive'}
                        >
                          <UnarchiveRounded />
                        </IconButton>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          {data?.data?.length === 0 && <NotResultRow span={6} text={t('NOT_FOUND')} />}
        </TableBody>
      </StyledTable>
      <Pagination
        {...data}
        params={params}
        loading={isFetching}
        elementsName={t('PAGINATION.ROLES')}
        onPaginate={(v) => setParams({ ...params, ...v })}
      />

      <CancelModal
        text={archiveRole?.is_active ? t('ARCHIVE_AKO_ROLE_CONFIRMATION') : t('UNARCHIVE_AKO_ROLE_CONFIRMATION')}
        open={!!archiveRole}
        onClose={() => setArchiveRole(null)}
        onSubmit={() => handleArchive(archiveRole)}
      />
    </Page>
  );
};
