import { Badge } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import ImportExportRounded from '@mui/icons-material/ImportExportRounded';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  clearSuppliersData,
  downloadAllSuppliers,
  getSuppliersList,
  setSuppliersParams
} from '../../../../actions/suppliersActions';
import { SUPPLIERS } from '../../../../actions/types';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import { Pagination } from '../../../Theme/Table/Pagination';
import SelectStatus from './SelectStatus';
import Table from './Table';
import { useTranslation } from 'react-i18next';

const Suppliers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { relation_id } = useSelector(({ user }) => user.activeRoles[0]);
  const { params, data, loading, selected, downloading } = useSelector(({ suppliers }) => suppliers);
  const [openSelect, setOpenSelect] = useState(false);

  useEffect(() => {
    if (checkPermissions('SUPPLIERS.ACCESS', ['АР (перегляд розширено)', 'АР', 'Адміністратор АР', 'АКО_Користувачі'])) {
      dispatch(getSuppliersList(params));
    } else {
      navigate('/');
    }
  }, [dispatch, navigate, relation_id, params]);

  useEffect(() => {
    if (localStorage.getItem('suppliers')) {
      dispatch({
        type: SUPPLIERS.SET_SELECTED,
        payload: JSON.parse(localStorage.getItem('suppliers'))
      });
    }
    return () => localStorage.removeItem('suppliers');
  }, [dispatch]);

  useEffect(
    () => () => {
      dispatch(clearSuppliersData());
    },
    [dispatch]
  );

  const onPaginate = (param) => {
    dispatch(setSuppliersParams({ ...params, ...param }));
  };

  const handleDownload = () => {
    dispatch(downloadAllSuppliers());
  };

  return (
    <Page
      pageName={t('SUPPLIERS.LIST')}
      backRoute={'/'}
      loading={loading}
      controls={
        <>
          {checkPermissions('SUPPLIERS.LIST.CONTROLS.CHANGE_STATUS', ['АР', 'АКО_Користувачі']) && (
            <StyledBadge badgeContent={selected.length} color={'secondary'} data-marker={`count-selected`}>
              <CircleButton
                icon={<ImportExportRounded />}
                color={'green'}
                onClick={() => setOpenSelect(true)}
                title={t('CONTROLS.CHANGE_STATUS')}
                disabled={selected.length === 0}
                dataMarker={'change-status--btn'}
              />
            </StyledBadge>
          )}
          {checkPermissions('SUPPLIERS.LIST.CONTROLS.DOWNLOAD', ['АР', 'АР (перегляд розширено)']) && (
            <CircleButton
              type={'download'}
              title={downloading ? t('IMPORT_FILE.WAIT_FOR_FILE_TO_DOWNLOADED') : t('CONTROLS.DOWNLOAD')}
              onClick={handleDownload}
              disabled={downloading || loading}
            />
          )}
          {checkPermissions('SUPPLIERS.LIST.CONTROLS.REQUESTS', 'Адміністратор АР') && (
            <CircleButton
              type={'document'}
              onClick={() => navigate('/temp-user-activation')}
              title={t('SUPPLIERS.REQUESTS')}
              dataMarker={'temp-user-activation-btn'}
            />
          )}
        </>
      }
    >
      <Table />
      <Pagination loading={loading} params={params} onPaginate={onPaginate} {...data} />
      <SelectStatus open={openSelect} onClose={() => setOpenSelect(false)} status={selected[0]?.status} />
    </Page>
  );
};

export default Suppliers;

const StyledBadge = withStyles(() => ({
  badge: {
    right: 3,
    top: 3
  }
}))(Badge);
