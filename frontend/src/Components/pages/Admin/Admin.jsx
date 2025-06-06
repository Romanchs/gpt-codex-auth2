import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAllUsers, setAdminParams } from '../../../actions/adminActions';
import { checkPermissions } from '../../../util/verifyRole';
import Page from '../../Global/Page';
import CircleButton from '../../Theme/Buttons/CircleButton';
import { Pagination } from '../../Theme/Table/Pagination';
import AdminTable from './AdminTable';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useViewDataLog from '../../../services/actionsLog/useViewDataLog';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';

const Admin = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { params, loading, allUsers: users } = useSelector((store) => store.admin);
  const { activeRoles } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const viewDataLog = useViewDataLog(['Адміністрування користувачів']);
  const onPaginateLog = useViewCallbackLog(['Адміністрування користувачів']);

  useEffect(() => {
    if (
      checkPermissions('USER_MANAGE.ACCESS', ['АКО', 'АКО_Процеси', 'АКО_ППКО', 'АКО_Користувачі', 'АКО_Довідники'])
    ) {
      dispatch(getAllUsers(params));
      viewDataLog();
    } else {
      navigate('/');
    }
  }, [params, activeRoles, dispatch, navigate]);

  const onPaginate = (p) => {
    dispatch(setAdminParams({ ...params, ...p }));
    onPaginateLog();
  };

  return (
    <Page
      pageName={t('PAGES.USER_MANAGE')}
      backRoute={'/'}
      loading={loading || !users}
      controls={
        checkPermissions('USER_MANAGE.CONTROLS.ADD_USER', 'АКО_Користувачі') && (
          <CircleButton onClick={() => navigate('/admin/manage-user')} type={'add'} title={t('CONTROLS.ADD_USER')} />
        )
      }
    >
      <AdminTable {...users} loading={loading} />
      <Pagination
        {...users}
        loading={loading}
        params={params}
        onPaginate={onPaginate}
        elementsName={t('PAGINATION.USERS')}
      />
    </Page>
  );
};

export default Admin;
