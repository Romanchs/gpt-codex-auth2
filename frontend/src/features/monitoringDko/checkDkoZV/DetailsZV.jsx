import ArchiveRounded from '@mui/icons-material/ArchiveRounded';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Page from '../../../Components/Global/Page';
import CircleButton from '../../../Components/Theme/Buttons/CircleButton';
import { mainApi } from '../../../app/mainApi';
import { defaultParams, defaultSelected, setParams, setSelected } from '../slice';
import DetailsTable from '../checkDkoZV/components/DetailsTable';
import Filters from '../checkDkoZV/components/Filters';
import { useControlsDetailsMDCHECKDKOZVMutation, useSettingsMDCHECKDKOZVQuery } from '../checkDkoZV/api';

const DetailsZV = () => {
  const { t } = useTranslation();
  const { uid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const points = useSelector((store) => store.monitoringDko.selected.points);
  const isAll = useSelector((store) => store.monitoringDko.selected.isAll);
  const params = useSelector((store) => store.monitoringDko.params);

  const [sendControl, { isLoading }] = useControlsDetailsMDCHECKDKOZVMutation();
  const { currentData: settings } = useSettingsMDCHECKDKOZVQuery();
  const { currentData, isFetching, error } = mainApi.endpoints.detailsMDCHECKDKOZV.useQueryState({ uid, params });
  const main_process = currentData?.main_process;

  useEffect(() => {
    if (error?.status === 403) {
      navigate('/');
    }
  }, [error]);

  const fields = useMemo(() => {
    if (!main_process) return [];
    const eicValue = main_process.metering_grid_areas.join(', ');
    const checksValue = main_process.checks.map((i) => t(`CHECK_DKO_ZV.${i}`));
    return [
      {
        key: 'source',
        label: t('CHECK_DKO_ZV.FIELDS.SOURCE'),
        sm: 1.5,
        default: main_process.source
          ? settings?.fields?.find((i) => i.key === 'source')?.values?.find((i) => i.value === main_process.source)
              ?.label
          : main_process.source
      },
      {
        key: 'version',
        label: t('CHECK_DKO_ZV.FIELDS.VERSION'),
        default: main_process.version,
        sm: 1.4
      },
      {
        key: 'period_from',
        label: t('FIELDS.REPORT_PERIOD_FROM'),
        default: main_process.period_from && moment(main_process.period_from, 'DD.MM.YYYY').format('DD.MM.yyyy'),
        sm: 1.6
      },
      {
        key: 'period_to',
        label: t('FIELDS.REPORT_PERIOD_TO'),
        default: main_process.period_to && moment(main_process.period_to, 'DD.MM.YYYY').format('DD.MM.yyyy'),
        sm: 1.6
      },
      {
        key: 'metering_grid_areas',
        label: t('CHECK_DKO_ZV.FIELDS.METERING_GRID_AREAS'),
        md: main_process.metering_grid_areas.length > 10 ? 9 : 3,
        sm: 2.1,
        default: eicValue,
        tooltip: eicValue
      },
      {
        key: 'checks',
        label: t('CHECK_DKO_ZV.FIELDS.CHECKS'),
        sm: 2,
        md: 12,
        default: checksValue,
        tooltip: checksValue?.join(', ')
      }
    ];
  }, [t, settings, main_process]);

  const handleSend = async (type) => {
    const { page, size, ...search } = params;
    const body = {
      all: isAll,
      include: isAll ? [] : points,
      exclude: isAll ? points : [],
      ...search
    };
    const { error } = await sendControl({ process_uid: uid, type, body });
    if (!error) {
      dispatch(setSelected(defaultSelected));
      if (type === '/send-notifications') {
        dispatch(mainApi.util.invalidateTags(['MONITORING_DKO_ZV_DETAILS_LIST']));
      }
    }
  };

  const handleBack = () => {
    dispatch(setParams(defaultParams));
    dispatch(setSelected(defaultSelected));
    dispatch(mainApi.util.invalidateTags(['MONITORING_DKO_CHECK_DKO_ZV_SETTINGS']));
    navigate(-1);
  };

  return (
    <Page
      acceptPermisions={'MONITORING_DKO.DETAILS.ACCESS'}
      acceptRoles={['АКО_Процеси', 'ОДКО']}
      pageName={isFetching ? `${t('LOADING')}...` : t('PAGES.MONITORING_DKO__DETAILS')}
      backRoute={handleBack}
      loading={isFetching || isLoading}
      notFoundMessage={error && t('PROCESS_NOT_FOUND')}
      controls={
        <>
          {main_process?.can_archive && (
            <CircleButton
              color={'red'}
              icon={<ArchiveRounded />}
              title={t('CONTROLS.DOWNLOAD_ARCHIVE')}
              onClick={() => handleSend('/download-archive')}
              dataMarker={'download-archive'}
              disabled={!points.length && !isAll}
            />
          )}
          {main_process?.can_send && (
            <CircleButton
              type={'send'}
              title={t('CONTROLS.SEND')}
              onClick={() => handleSend('/send-notifications')}
              disabled={!points.length && !isAll}
            />
          )}
        </>
      }
    >
      <Filters title={t('APPLIED_FILTERS')} list={fields} />
      <DetailsTable />
    </Page>
  );
};

export default DetailsZV;
