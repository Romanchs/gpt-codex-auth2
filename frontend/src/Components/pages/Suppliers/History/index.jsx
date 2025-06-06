import Grid from '@material-ui/core/Grid';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { clearSuppliersData, downloadSupplierHistory, getSupplierByUid } from '../../../../actions/suppliersActions';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import StyledInput from '../../../Theme/Fields/StyledInput';
import { supplierStatuses } from '../Main/models';
import SuppliersAccordion from './Accordion';
import { checkPermissions } from '../../../../util/verifyRole';
import { useTranslation } from 'react-i18next';

const SupplierHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { uid } = useParams();
  const dispatch = useDispatch();
  const [{ relation_id }] = useSelector(({ user }) => user.activeRoles);
  const { data, loading, notFound, downloading } = useSelector(({ suppliers }) => suppliers);

  useEffect(() => {
    if (checkPermissions('SUPPLIERS.LIST.FUNCTIONS.HISTORY', ['АР (перегляд розширено)', 'АР', 'АКО_Користувачі'])) {
      dispatch(getSupplierByUid(uid));
    } else {
      navigate('/suppliers');
    }
    return () => dispatch(clearSuppliersData());
  }, [navigate, dispatch, uid, relation_id]);

  const handleDownload = () => {
    dispatch(downloadSupplierHistory(uid, data?.eic));
  };

  return (
    <Page
      pageName={t('SUPPLIERS.HISTORICAL_DATA_OF_PRE_DEFAULT_DEFAULT')}
      backRoute={'/suppliers'}
      notFoundMessage={notFound && t('SUPPLIERS.NO_SUPPLIER_FOUND')}
      loading={loading}
      controls={
        checkPermissions('SUPPLIERS.LIST.FUNCTIONS.HISTORY', ['АР (перегляд розширено)', 'АР']) && (
          <CircleButton
            type={'download'}
            title={downloading ? t('IMPORT_FILE.WAIT_FOR_FILE_TO_DOWNLOADED') : t('CONTROLS.DOWNLOAD')}
            onClick={handleDownload}
            disabled={downloading || loading}
          />
        )
      }
    >
      <div className={'boxShadow'} style={{ padding: 24, marginTop: 16, marginBottom: 24 }}>
        <Grid container spacing={3} alignItems={'center'}>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <StyledInput
              label={t('SUPPLIERS.SUPPLIER_STATUS')}
              readOnly
              value={data?.status ? t(supplierStatuses[data?.status]?.label) : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <StyledInput label={t('FIELDS.USREOU')} readOnly value={data?.usreou} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={2}>
            <StyledInput label={t('FIELDS.EIC_CODE_TYPE_X')} readOnly value={data?.eic} />
          </Grid>
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <StyledInput label={t('FIELDS.FULL_NAME')} readOnly value={data?.full_name} />
          </Grid>
        </Grid>
      </div>
      <SuppliersAccordion />
    </Page>
  );
};

export default SupplierHistory;
