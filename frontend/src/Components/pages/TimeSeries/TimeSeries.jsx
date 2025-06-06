import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTSList, setTSListParams, tsDialogOpen } from '../../../actions/timeSeriesActions';
import Page from '../../Global/Page';
import CircleButton from '../../Theme/Buttons/CircleButton';
import { Pagination } from '../../Theme/Table/Pagination';
import TimeSeriesDialog from './TimeSeriesDialog';
import TimeSeriesTable from './TimeSeriesTable';
import { useTranslation } from 'react-i18next';
import { checkPermissions } from '../../../util/verifyRole';
import { useSnackbar } from 'notistack';
import useViewCallbackLog from '../../../services/actionsLog/useViewCallbackLog';

export const MASS_DOWNLOAD_DKO_ACCEPT_ROLES = ['АКО', 'ОДКО'];

const TimeSeries = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { params, error, openDialog, uploading, loading, list, uploadingResponse } = useSelector(
    ({ timeSeries }) => timeSeries
  );

  const onPaginateLog = useViewCallbackLog();

  useEffect(() => {
    if (checkPermissions('PAGES.MASS_DOWNLOAD_DKO', ['АКО', 'ОДКО'])) {
      dispatch(getTSList(params));
    } else {
      enqueueSnackbar(t('NOTIFICATIONS.YOU_HAVE_NO_RIGHTS'), {
        key: new Date().getTime() + Math.random(),
        variant: 'error',
        autoHideDuration: 5000
      });
    }
  }, [dispatch, params]);

  const handleOpenDialog = () => {
    dispatch(tsDialogOpen(true));
  };

  const handlePaginate = (p) => {
    dispatch(setTSListParams(p));
    onPaginateLog();
  }

  return (
    <Page
      acceptPermisions={'TIME_SERIES.ACCESS'}
      acceptRoles={MASS_DOWNLOAD_DKO_ACCEPT_ROLES}
      pageName={t('PAGES.MASS_DOWNLOAD_DKO')}
      faqKey={'INFORMATION_BASE__MASS_DOWNLOAD_DKO'}
      loading={loading}
      controls={<CircleButton type={'upload'} onClick={handleOpenDialog} title={t('CONTROLS.DOWNLOAD_FILE_DKO')} />}
      backRoute={'/'}
    >
      <TimeSeriesTable />
      <Pagination
        {...list}
        params={params}
        elementsName={t('CHARACTERISTICS.DKO')}
        onPaginate={handlePaginate}
        loading={loading}
      />
      <TimeSeriesDialog
        params={params}
        open={openDialog}
        loading={uploading}
        response={uploadingResponse}
        error={error}
      />
    </Page>
  );
};

export default TimeSeries;
