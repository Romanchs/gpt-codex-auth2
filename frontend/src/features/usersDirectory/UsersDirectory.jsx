import Page from '../../Components/Global/Page';
import React, { useEffect } from 'react';
import { UsersDirectoryTable } from './UsersDirectoryTable';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkPermissions } from '../../util/verifyRole';
import { getAllUsers, setAdminParams } from '../../actions/adminActions';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { useTranslation } from 'react-i18next';
import { useLazyUserDirectoryImportQuery } from './api';
import useImportFileLog from '../../services/actionsLog/useImportFileLog';
import useViewCallbackLog from '../../services/actionsLog/useViewCallbackLog';

export const USERS_DIRECTORY_ACCEPT_ROLES = ['АТКО', 'ОДКО', 'ОЗКО', 'ОЗД', 'ОМ', 'СВБ'];

export const UsersDirectory = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { params, loading, allUsers: users } = useSelector((store) => store.admin);
  const { activeRoles } = useSelector((store) => store.user);
  const [download, { isFetching }] = useLazyUserDirectoryImportQuery();
  const importLog = useImportFileLog();
  const onPaginateLog = useViewCallbackLog();

  useEffect(() => {
    if (checkPermissions('USERS_DIRECTORY.ACCESS', USERS_DIRECTORY_ACCEPT_ROLES)) {
      dispatch(getAllUsers(params));
    } else {
      navigate('/');
    }
  }, [params, activeRoles, dispatch, navigate]);

  const handleDownloadReport = () => {
    download();
    importLog();
  }

  const handlePaginate = (p) => {
    dispatch(setAdminParams({ ...params, ...p }));
    onPaginateLog();
  }

  return (
    <Page
      pageName={t('PAGES.USERS_DIRECTORY')}
      backRoute={'/'}
      faqKey={'INFORMATION_BASE__USERS_DIRECTORY'}
      loading={loading || isFetching}
      acceptPermisions={'USERS_DIRECTORY.ACCESS'}
      acceptRoles={USERS_DIRECTORY_ACCEPT_ROLES}
      controls={
        checkPermissions('USERS_DIRECTORY.CONTROLS.DOWNLOAD_REPORT', ['СВБ']) && (
          <CircleButton type={'download'} title={t('CONTROLS.DOWNLOAD_REPORT')} onClick={handleDownloadReport} />
        )
      }
    >
      <UsersDirectoryTable {...users} params={params} />
      <Pagination
        {...users}
        loading={loading}
        params={params}
        onPaginate={handlePaginate}
        elementsName={t('PAGINATION.USERS')}
      />
    </Page>
  );
};
