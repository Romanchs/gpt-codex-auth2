import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import {
  clearDirectoryListParams,
  downloadGridAccessProviders,
  getGridAccessProvidersDirectory,
  setDirectoryListParams
} from '../../../../actions/directoriesActions';
import { useNavigate } from 'react-router-dom';
import GridAccessProviderTable from './GridAccessProviderTable';
import { Pagination } from '../../../Theme/Table/Pagination';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import { useTranslation } from 'react-i18next';

const GridAccessProvider = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, params, selectedDirectory, downloading } = useSelector((s) => s.directories);

  useEffect(() => {
    if (checkPermissions('DIRECTORIES.GRID_ACCESS_PROVIDER.ACCESS', ['АКО...', 'ГапПок'])) {
      dispatch(getGridAccessProvidersDirectory(params));
    } else {
      navigate('/directories');
    }
  }, [dispatch, navigate, params]);

  useEffect(
    () => () => {
      dispatch(clearDirectoryListParams());
    },
    [dispatch]
  );

  const handleDownload = () => {
    dispatch(downloadGridAccessProviders('DATAHUB-ДОВІДНИК-ОСР'));
  };

  return (
    <Page
      pageName={t('PAGES.GRID_ACCESS_PROVIDER')}
      backRoute={'/directories'}
      loading={loading}
      controls={
        checkPermissions('DIRECTORIES.GRID_ACCESS_PROVIDER.CONTROLS.DOWNLOAD', ['АКО_Довідники']) && (
          <CircleButton
            onClick={handleDownload}
            type={'download'}
            title={t('CONTROLS.DOWNLOAD_DIRECTORY')}
            disabled={downloading}
          />
        )
      }
    >
      <GridAccessProviderTable />
      <Pagination
        {...selectedDirectory}
        loading={loading}
        params={params}
        onPaginate={(p) => dispatch(setDirectoryListParams({ ...params, ...p }))}
        elementsName={t('PAGINATION.ELEMENTS')}
      >
        {/*{*/}
        {/*  verifyRole('АКО_Довідники') &&*/}
        {/*  <GreenButton onClick={() => setOpen(true)}>*/}
        {/*    <AddRoundedIcon/>*/}
        {/*    Додати*/}
        {/*  </GreenButton>*/}
        {/*}*/}
      </Pagination>
    </Page>
  );
};

export default GridAccessProvider;
