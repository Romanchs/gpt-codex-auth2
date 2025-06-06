import { Divider, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import Grid from '@mui/material/Grid';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DangerButton } from '../../../Theme/Buttons/DangerButton';

import {
  clearGts,
  generalSettingsReport,
  gtsCreateReportByComponentsZV,
  gtsCreateReportByEic,
  gtsCreateReportByRelease,
  gtsCreateReportByVersion,
  gtsCreateReportByZV,
  gtsUpdateReportByComponentsZV,
  gtsUpdateReportByEic,
  gtsUpdateReportByRelease,
  gtsUpdateReportByVersion,
  gtsUpdateReportByZV,
  uploadComponentsZVFile,
  uploadFileByEic,
  uploadFileByRelease,
  uploadFileByVersion,
  uploadZVFile
} from '../../../../actions/gtsActions';
import { GTS } from '../../../../actions/types';
import { checkPermissions } from '../../../../util/verifyRole';
import Page from '../../../Global/Page';
import CircleButton from '../../../Theme/Buttons/CircleButton';
import AddByReleaseDialog from './AddByReleaseDialog';
import AddByEicDialog from './AddByEicDialog';
import Filters from './Filters';
import ReportByRelease from './ReportByRelease';
import ReportByEic from './ReportByEic';
import ReportByParams from './ReportByParams';
import ReportByZv from './ReportByZV';
import ReportByComponentsZV from './ReportByComponentsZV';
import AddByZVDialog from './AddByZVDialog';
import AddByComponentsZVDialog from './AddByComponentsZVDialog';
import AddByVersionDialog from './AddByVersionDialog';
import ReportByVersion from './ReportByVersion';
import { REPORT_TYPE } from '../constants';
import { useTranslation } from 'react-i18next';
import {
  initReportByProperties,
  resetError,
  resetFieldsData,
  setFilters,
  setIsChangedFilterReportByParams,
  setIsChangedGeneralFilter,
  setIsLoadTKO
} from '../slice';
import useSearchLog from '../../../../services/actionsLog/useSearchLog';
import useImportFileLog from '../../../../services/actionsLog/useImportFileLog';
import { GTS_LOG_TAGS } from '../../../../services/actionsLog/constants';
import { Box } from '@mui/material';
import { ModalWrapper } from '../../../Modal/ModalWrapper';
import Stack from '@mui/material/Stack';
import { BlueButton } from '../../../Theme/Buttons/BlueButton';
import { GreenButton } from '../../../Theme/Buttons/GreenButton';
import { isUkrinterenergoSVB } from '../../../../util/helpers';

const DIALOGS = {
  ADD_BY_EIC: 'ADD_BY_EIC_DIALOG',
  ADD_BY_ZV: 'ADD_BY_ZV_DIALOG',
  ADD_BY_RELEASE: 'ADD_BY_RELEASE_DIALOG',
  ADD_BY_COMPONENTS_ZV: 'ADD_BY_COMPONENTS_ZV_DIALOG',
  ADD_BY_VERSION: 'ADD_BY_VERSION_DIALOG'
};

const options = [
  {
    key: REPORT_TYPE.BY_EIC,
    title: 'GTS_REPORT_TYPE.BY_EIC'
  },
  {
    key: REPORT_TYPE.BY_ZV,
    title: 'GTS_REPORT_TYPE.BY_ZV'
  },
  {
    key: REPORT_TYPE.BY_PARAMS,
    title: 'GTS_REPORT_TYPE.BY_PARAMS'
  },
  {
    key: REPORT_TYPE.BY_RELEASE,
    title: 'GTS_REPORT_TYPE.BY_RELEASE'
  },
  {
    key: REPORT_TYPE.BY_VERSION,
    title: 'GTS_REPORT_TYPE.BY_VERSION',
    forUkrinterenergoSVB: true
  },
  {
    key: REPORT_TYPE.BY_COMPONENTS_ZV,
    title: 'GTS_REPORT_TYPE.BY_COMPONENTS_ZV'
  }
];

export const CREATE_GTS_REPORT_ACCEPT_ROLES = [
  'АКО',
  'АКО_Процеси',
  'АКО_ППКО',
  'АКО_Користувачі',
  'АКО_Довідники',
  'ОДКО',
  'АДКО',
  'ВТКО',
  'СВБ',
  'ОМ'
];

const CreateReport = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    activeRoles: [{ relation_id }]
  } = useSelector(({ user }) => user);
  const [open, setOpen] = useState('');
  const [isAttentionModalOpen, setIsAttentionModalOpen] = useState(false);
  const {
    loading,
    loadingGeneralSettings,
    reportByEic,
    reportByZV,
    reportByComponentsZV,
    reportByRelease,
    reportSettings,
    generalSettings,
    originalSettings,
    reportByVersion
  } = useSelector(({ gts }) => gts);
  const isLoading = useSelector((store) => store.gtsSlice.loading);
  const isSearching = useSelector((store) => store.gtsSlice.searching.loading);
  const fields = useSelector((store) => store.gtsSlice.fields);
  const isChangedGeneralFilter = useSelector((store) => store.gtsSlice.isChangedGeneralFilter);
  const isLoadTKO = useSelector((store) => store.gtsSlice.isLoadTKO);
  const isChangedFilterReportByParams = useSelector((store) => store.gtsSlice.isChangedFilterReportByParams);
  const [isConfirm, setIsConfirm] = useState();
  const [checkedTypeReport, setCheckedTypeReport] = useState();

  const [selected, setSelected] = useState(() =>
    reportByRelease?.tkos.length > 0 ? REPORT_TYPE.BY_RELEASE : REPORT_TYPE.BY_EIC
  );

  const paramsfilters = useSelector((store) => store.gtsSlice.filters);

  let dimension = reportSettings.dimension,
    period_from = reportSettings.period_from,
    period_to = reportSettings.period_to;
  // version = reportSettings.version;
  if (selected === REPORT_TYPE.BY_PARAMS && Object.keys(paramsfilters).length) {
    dimension = paramsfilters.dimension;
    period_from = paramsfilters.period_from;
    period_to = paramsfilters.period_to;
    // version = paramsfilters.version;
  }

  const searchLog = useSearchLog(GTS_LOG_TAGS);
  const importFileLog = useImportFileLog(GTS_LOG_TAGS);

  useEffect(() => {
    if (checkPermissions('GTS.REPORTS.CONTROLS.CREATE_REPORT', CREATE_GTS_REPORT_ACCEPT_ROLES)) {
      dispatch({ type: GTS.CLEAR_UP });
      dispatch(resetFieldsData());
      dispatch(setFilters({}));
      dispatch(setIsChangedGeneralFilter(false));
      dispatch(setIsChangedFilterReportByParams(false));
      dispatch(setIsLoadTKO(false));
    } else {
      navigate('/');
    }
  }, [dispatch, navigate, relation_id]);

  const validParamsDates = useMemo(() => {
    for (const k in fields) {
      if (
        fields[k]?.isValid &&
        (!moment(fields[k], moment.ISO_8601).isValid() || moment(fields[k]).isBefore('2019-07-01'))
      ) {
        return false;
      }
    }
    return true;
  }, [fields]);

  const isAllFiltersSelected = useMemo(() => {
    const emptyFields = Object.keys(paramsfilters)
      .filter((key) => paramsfilters[key] === null && key !== 'version')
      .filter((key) => {
        return !(
          key == 'quality_type' ||
          (key == 'version' && paramsfilters.source_type === 'ARCHIVE_TS') ||
          (key == 'point_species' &&
            (paramsfilters.point_type === 'InstallationAccountingPoint' || !generalSettings?.point_species?.options))
        );
      });

    const isEmptyObject = Object.values(paramsfilters).length === 0;
    const isEmptyFieldsPresent = emptyFields.length > 0;
    if (isEmptyFieldsPresent || isEmptyObject) {
      return false;
    }
    return Object.values(fields).some(Boolean);
  }, [paramsfilters, generalSettings, fields]);

  const validFilters = useMemo(() => {
    if (!period_from || !period_to) {
      return false;
    }
    if ([REPORT_TYPE.BY_COMPONENTS_ZV, REPORT_TYPE.BY_VERSION].includes(selected) && !reportSettings?.version) {
      return false;
    }
    const from = moment(period_from).unix();
    const to = moment(period_to).unix();
    return !(to > moment().startOf('day').unix() || dimension === 'p1y'
      ? false
      : (selected === REPORT_TYPE.BY_ZV
          ? moment(period_from).add(12, 'months').add(1, 'days').unix() < to
          : moment(period_to).subtract(32, 'days').unix() > from) ||
        to < from ||
        from < moment('2019-01-01').unix());
  }, [dimension, selected, period_from, period_to, reportSettings]);

  const handleSelect = ({ target: { value } }) => {
    if (isChangedGeneralFilter || isChangedFilterReportByParams || isLoadTKO) {
      setIsConfirm(true);
      setCheckedTypeReport(value);
    } else {
      dispatch(clearGts());
      dispatch(resetError());
      setSelected(value);
    }
  };

  useEffect(
    () => () => {
      dispatch(clearGts());
      dispatch(resetError());
    },
    [dispatch]
  );

  const handleOnCloseDialog = () => {
    setOpen('');
  };

  const handleUploadZV = ({ target }) => {
    if (target.files.length === 1) {
      dispatch(uploadZVFile(target.files[0]));
    }
    importFileLog();
  };

  const handleUploadComponentsZV = ({ target }) => {
    if (target.files.length === 1) {
      dispatch(uploadComponentsZVFile(target.files[0]));
    }
    importFileLog();
  };

  const handleUploadByEicFile = ({ target }) => {
    if (target.files.length === 1) {
      dispatch(uploadFileByEic(target.files[0]));
    }
    importFileLog();
  };

  const handleUploadByVersionFile = ({ target }) => {
    if (target.files.length === 1) {
      dispatch(uploadFileByVersion(target.files[0]));
    }
    importFileLog();
  };

  const handleUploadFileByRelease = ({ target }) => {
    if (target.files.length === 1) {
      dispatch(uploadFileByRelease(target.files[0]));
    }
    importFileLog();
  };

  const createReport = () => {
    dispatch(gtsCreateReportByEic(() => navigate('/gts/reports')));
    searchLog();
  };

  const handleCreateReport = () => {
    if (reportSettings?.apply_esign) {
      setIsAttentionModalOpen(true);
    } else {
      createReport();
    }
  };

  const controls = () => {
    switch (selected) {
      case REPORT_TYPE.BY_EIC:
        return (
          <>
            {reportByEic && (
              <CircleButton
                type={'remove'}
                title={t('CONTROLS.UNDO')}
                disabled={loading}
                onClick={() => {
                  dispatch(clearGts());
                  dispatch(generalSettingsReport(selected));
                }}
              />
            )}
            {reportByEic?.tkos?.total > 0 && (
              <CircleButton
                type={'delete'}
                title={t('CONTROLS.DELETE_ALL_AP')}
                disabled={loading}
                onClick={() => dispatch(gtsUpdateReportByEic({ selected_all_tko: false }))}
              />
            )}
            {(!reportByEic || reportByEic?.can_upload) && (
              <div>
                <label htmlFor="import-tko-file" style={{ margin: 0 }}>
                  <CircleButton
                    type={'upload'}
                    component="span"
                    title={t('CONTROLS.IMPORT_AP_LIST')}
                    disabled={loading || !dimension || !period_from || !period_to}
                  />
                </label>
                {(!loading || dimension || period_from || period_to) && (
                  <input
                    accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroenabled.12"
                    id="import-tko-file"
                    type="file"
                    onChange={handleUploadByEicFile}
                    onClick={(e) => (e.target.value = null)}
                    disabled={loading || !dimension || !period_from || !period_to}
                  />
                )}
              </div>
            )}

            {(!reportByEic || reportByEic?.can_add) && (
              <CircleButton
                type={'add'}
                title={t('CONTROLS.ADD_AP')}
                onClick={() => setOpen(DIALOGS.ADD_BY_EIC)}
                disabled={loading || !period_from || !period_to}
              />
            )}
            {reportByEic?.tkos?.total > 0 && (
              <CircleButton
                type={'new'}
                title={t('CONTROLS.CREATE_REPORT')}
                disabled={loading || !validFilters}
                onClick={handleCreateReport}
              />
            )}
          </>
        );
      case REPORT_TYPE.BY_VERSION:
        return (
          <>
            {reportByVersion && (
              <CircleButton
                type={'remove'}
                title={t('CONTROLS.UNDO')}
                disabled={loading}
                onClick={() => {
                  dispatch(clearGts());
                  dispatch(generalSettingsReport(selected));
                }}
              />
            )}
            {reportByVersion?.tkos?.total > 0 && (
              <CircleButton
                type={'delete'}
                title={t('CONTROLS.DELETE_ALL_AP')}
                disabled={loading}
                onClick={() => dispatch(gtsUpdateReportByVersion({ selected_all_tko: false }))}
              />
            )}
            {(!reportByVersion || reportByVersion?.can_upload) && (
              <div>
                <label htmlFor="import-tko-file" style={{ margin: 0 }}>
                  <CircleButton
                    type={'upload'}
                    component="span"
                    title={t('CONTROLS.IMPORT_AP_LIST')}
                    disabled={loading || !dimension || !period_from || !period_to}
                  />
                </label>
                {(!loading || dimension || period_from || period_to) && (
                  <input
                    accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroenabled.12"
                    id="import-tko-file"
                    type="file"
                    onChange={handleUploadByVersionFile}
                    onClick={(e) => (e.target.value = null)}
                    disabled={loading || !dimension || !period_from || !period_to}
                  />
                )}
              </div>
            )}

            {(!reportByVersion || reportByVersion?.can_add) && (
              <CircleButton
                type={'add'}
                title={t('CONTROLS.ADD_AP')}
                onClick={() => setOpen(DIALOGS.ADD_BY_VERSION)}
                disabled={loading || !period_from || !period_to}
              />
            )}
            {reportByVersion?.tkos?.total > 0 && (
              <CircleButton
                type={'new'}
                title={t('CONTROLS.CREATE_REPORT')}
                disabled={loading || !validFilters}
                onClick={() => {
                  dispatch(gtsCreateReportByVersion(() => navigate('/gts/reports')));
                  searchLog();
                }}
              />
            )}
          </>
        );
      case REPORT_TYPE.BY_ZV:
        return (
          <>
            {reportByZV?.tkos?.total > 0 && (
              <CircleButton
                type={'delete'}
                title={t('CONTROLS.DELETE_ALL_AP')}
                disabled={loading}
                onClick={() => dispatch(gtsUpdateReportByZV({ selected_all_tko: false }))}
              />
            )}
            {(!reportByZV || reportByZV?.tkos?.total == 0) && (
              <Box sx={{ ml: 2 }}>
                <label htmlFor="import-zv-file" style={{ margin: 0 }}>
                  <CircleButton type={'upload'} component="span" title={t('CONTROLS.IMPORT_ZV_LIST')} />
                </label>
                <input
                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroenabled.12"
                  id="import-zv-file"
                  type="file"
                  onChange={handleUploadZV}
                  onClick={(e) => (e.target.value = null)}
                />
              </Box>
            )}
            {(!reportByZV || reportByZV?.tkos?.total == 0 || reportByZV?.can_add) && (
              <CircleButton
                type={'add'}
                title={t('CONTROLS.ADD_AP')}
                onClick={() => setOpen(DIALOGS.ADD_BY_ZV)}
                disabled={loading}
              />
            )}
            {reportByZV?.tkos?.total > 0 && (
              <CircleButton
                type={'new'}
                title={t('CONTROLS.CREATE_REPORT')}
                disabled={loading || !validFilters}
                onClick={() => {
                  dispatch(gtsCreateReportByZV(() => navigate('/gts/reports')));
                  searchLog();
                }}
              />
            )}
          </>
        );
      case REPORT_TYPE.BY_COMPONENTS_ZV:
        return (
          <>
            {reportByComponentsZV?.tkos?.total > 0 && (
              <CircleButton
                type={'delete'}
                title={t('CONTROLS.DELETE_ALL_AP')}
                disabled={loading}
                onClick={() => dispatch(gtsUpdateReportByComponentsZV({ selected_all_tko: false }))}
              />
            )}
            {(!reportByComponentsZV || reportByComponentsZV?.tkos?.total == 0) && (
              <Box sx={{ ml: 2 }}>
                <label htmlFor="import-zv-file" style={{ margin: 0 }}>
                  <CircleButton type={'upload'} component="span" title={t('CONTROLS.IMPORT_ZV_LIST')} />
                </label>
                <input
                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroenabled.12"
                  id="import-zv-file"
                  type="file"
                  onChange={handleUploadComponentsZV}
                  onClick={(e) => (e.target.value = null)}
                />
              </Box>
            )}
            {(!reportByComponentsZV || reportByComponentsZV?.tkos?.total == 0 || reportByComponentsZV?.can_add) && (
              <CircleButton
                type={'add'}
                title={t('CONTROLS.ADD_AP')}
                onClick={() => setOpen(DIALOGS.ADD_BY_COMPONENTS_ZV)}
                disabled={loading}
              />
            )}
            {reportByComponentsZV?.tkos?.total > 0 && (
              <CircleButton
                type={'new'}
                title={t('CONTROLS.CREATE_REPORT')}
                disabled={loading || !validFilters}
                onClick={() => {
                  dispatch(gtsCreateReportByComponentsZV(() => navigate('/gts/reports')));
                  searchLog();
                }}
              />
            )}
          </>
        );
      case REPORT_TYPE.BY_PARAMS:
        return (
          <CircleButton
            type={'new'}
            title={t('CONTROLS.CREATE_REPORT')}
            disabled={!validParamsDates || !validFilters || isSearching || !isAllFiltersSelected}
            onClick={() => {
              dispatch(initReportByProperties(() => navigate('/gts/reports')));
              dispatch(setIsChangedGeneralFilter(false));
              dispatch(setIsChangedFilterReportByParams(false));
              searchLog();
            }}
          />
        );
      case REPORT_TYPE.BY_RELEASE:
        return (
          <>
            {reportByRelease && (
              <CircleButton
                type={'remove'}
                title={t('CONTROLS.UNDO')}
                disabled={loading}
                onClick={() => {
                  dispatch(clearGts());
                  dispatch(generalSettingsReport(REPORT_TYPE.BY_RELEASE));
                }}
              />
            )}
            {reportByRelease?.tkos?.total > 0 && (
              <CircleButton
                type={'delete'}
                title={t('CONTROLS.DELETE_ALL_AP')}
                disabled={loading}
                onClick={() => dispatch(gtsUpdateReportByRelease({ selected_all_tko: false }))}
              />
            )}
            {(!reportByRelease || reportByRelease?.can_upload) && (
              <div>
                <label htmlFor="import-tko-file" style={{ margin: 0 }}>
                  <CircleButton
                    type={'upload'}
                    component="span"
                    title={t('CONTROLS.IMPORT_AP_LIST')}
                    disabled={loading || !period_from || !period_to}
                  />
                </label>
                <input
                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroenabled.12"
                  id="import-tko-file"
                  type="file"
                  onChange={handleUploadFileByRelease}
                  onClick={(e) => (e.target.value = null)}
                  disabled={loading || !period_from || !period_to}
                />
              </div>
            )}

            {(!reportByRelease || reportByRelease?.can_add) && (
              <CircleButton
                type={'add'}
                title={t('CONTROLS.ADD_AP')}
                onClick={() => setOpen(DIALOGS.ADD_BY_RELEASE)}
                disabled={loading || !validFilters}
              />
            )}
            {reportByRelease?.tkos?.total > 0 && (
              <CircleButton
                type={'new'}
                title={t('CONTROLS.CREATE_REPORT')}
                onClick={() => {
                  dispatch(gtsCreateReportByRelease(() => navigate('/gts/reports')));
                  searchLog();
                }}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Page
      pageName={t('PAGES.CREATE_GTS_REPORT')}
      backRoute={'/gts/reports'}
      faqKey={'GTS__CREATE_GTS_REPORT'}
      loading={loading || loadingGeneralSettings || isLoading}
      controls={controls()}
    >
      <div className={'boxShadow'} style={{ padding: 16, paddingBottom: 8, marginBottom: 16, marginTop: 8 }}>
        <Typography variant={'h2'} color={'textPrimary'} style={{ marginBottom: 12 }}>
          {t('SELECT_REPORT_TYPE')}
        </Typography>
        <Divider style={{ marginBottom: 8 }} />
        <RadioGroup aria-label="gender" name="gender1" value={selected} onChange={handleSelect}>
          {options.map(
            ({ key, title, forUkrinterenergoSVB }) =>
              (!forUkrinterenergoSVB || isUkrinterenergoSVB()) && (
                <FormControlLabel
                  value={key}
                  control={<Radio />}
                  label={t(title)}
                  key={key}
                  disabled={reportByRelease?.tkos?.length > 0 && key !== selected}
                  data-marker={'report-' + key}
                  data-status={selected === key ? 'active' : 'inactive'}
                />
              )
          )}
        </RadioGroup>
      </div>
      <Filters reportType={selected} />
      {selected === REPORT_TYPE.BY_EIC && <ReportByEic />}
      {selected === REPORT_TYPE.BY_ZV && <ReportByZv />}
      {selected === REPORT_TYPE.BY_PARAMS && <ReportByParams />}
      {selected === REPORT_TYPE.BY_RELEASE && <ReportByRelease />}
      {selected === REPORT_TYPE.BY_VERSION && <ReportByVersion />}
      {selected === REPORT_TYPE.BY_COMPONENTS_ZV && <ReportByComponentsZV />}
      <AddByEicDialog open={open === DIALOGS.ADD_BY_EIC} onClose={handleOnCloseDialog} />
      <AddByVersionDialog open={open === DIALOGS.ADD_BY_VERSION} onClose={handleOnCloseDialog} />
      <AddByZVDialog open={open === DIALOGS.ADD_BY_ZV} onClose={handleOnCloseDialog} />
      <AddByReleaseDialog open={open === DIALOGS.ADD_BY_RELEASE} onClose={handleOnCloseDialog} />
      <AddByComponentsZVDialog open={open === DIALOGS.ADD_BY_COMPONENTS_ZV} onClose={handleOnCloseDialog} />
      <ModalWrapper open={isAttentionModalOpen}>
        <Typography>{t('MODALS.REPORT_NOTICE', { date: moment().format('HH:mm DD.MM.YYYY') })}</Typography>
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={3}>
          <BlueButton onClick={() => setIsAttentionModalOpen(false)} fullWidth>
            {t('CONTROLS.NO')}
          </BlueButton>
          <GreenButton
            onClick={() => {
              setIsAttentionModalOpen(false);
              createReport();
            }}
            fullWidth
          >
            {t('CONTROLS.YES')}
          </GreenButton>
        </Stack>
      </ModalWrapper>
      <ModalWrapper open={isConfirm}>
        <Typography>{t('MODALS.CONFIRM_CHANGE_REPORT_TYPE')}</Typography>
        <Typography>{t('MODALS.RESET_CURRENT_SETTINGS')}</Typography>
        <Stack direction={'row'} sx={{ pt: 3 }} justifyContent={'space-between'} spacing={1}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <BlueButton onClick={() => setIsConfirm(false)} style={{ width: '100%' }}>
                {t('CONTROLS.NO')}
              </BlueButton>
            </Grid>
            <Grid item xs={6}>
              <DangerButton
                onClick={() => {
                  if (selected === REPORT_TYPE.BY_PARAMS) {
                    dispatch(setFilters(originalSettings));
                  }
                  dispatch(clearGts());
                  dispatch(resetError());
                  dispatch(resetFieldsData());
                  setSelected(checkedTypeReport);
                  setIsConfirm(false);
                  dispatch(setIsChangedGeneralFilter(false));
                  dispatch(setIsChangedFilterReportByParams(false));
                  dispatch(setIsLoadTKO(false));
                }}
                style={{ width: '100%' }}
              >
                {t('CONTROLS.YES')}
              </DangerButton>
            </Grid>
          </Grid>
        </Stack>
      </ModalWrapper>
    </Page>
  );
};

export default CreateReport;
