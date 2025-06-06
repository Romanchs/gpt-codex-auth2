import Page from '../../Components/Global/Page';
import { useTranslation } from 'react-i18next';
import { AUDITS_READ_PERMISSION, AUDITS_READ_ROLES, AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES } from './index';
import CircleButton from '../../Components/Theme/Buttons/CircleButton';
import { checkPermissions } from '../../util/verifyRole';
import { useNavigate } from 'react-router-dom';
import RegisterTable from './components/Register/RegisterTable';
import { onPaginate, useAuditFilters, useAuditParams, useAuditTableFilters } from './slice';
import { Pagination } from '../../Components/Theme/Table/Pagination';
import { useDispatch } from 'react-redux';
import RegisterFilters from './components/Register/RegisterFilters';
import { useAuditsListQuery, useLazyExportAuditsQuery } from './api';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useAuditParams();
  const filters = useAuditFilters();
  const tableFilters = useAuditTableFilters();
  const { data, isFetching } = useAuditsListQuery({ ...params, ...filters, ...tableFilters });
  const [download] = useLazyExportAuditsQuery();

  const handleDownload = () => {
    download({ ...filters, ...tableFilters });
  };

  return (
    <Page
      pageName={t('PAGES.AUDITS')}
      backRoute={'/'}
      loading={isFetching}
      acceptRoles={AUDITS_READ_ROLES}
      acceptPermisions={AUDITS_READ_PERMISSION}
      faqKey={'INFORMATION_BASE__AUDITS'}
      controls={
        checkPermissions(AUDITS_WRITE_PERMISSION, AUDITS_WRITE_ROLES) && (
          <>
            <CircleButton type={'download'} title={t('CONTROLS.EXPORT_AUDITS')} onClick={handleDownload} />
            <CircleButton type={'add'} title={t('CONTROLS.ADD_AUDIT')} onClick={() => navigate('create')} />
          </>
        )
      }
    >
      <RegisterFilters />
      <RegisterTable list={data?.data || []} />
      <Pagination {...data} params={params} loading={isFetching} onPaginate={(p) => dispatch(onPaginate(p))} />
    </Page>
  );
};

export default Register;
