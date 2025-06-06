import api from '../util/api';
import { saveAsFile } from '../util/files';
import { GTS } from './types';
import { downloadFileById } from './massLoadActions';
import i18n from '../i18n/i18n';

const getListStarted = () => ({
  type: GTS.GET_LIST_STARTED
});

export const getListSuccess = (payload) => ({
  type: GTS.GET_LIST_SUCCESS,
  payload
});

export const getListFailure = (error) => ({
  type: GTS.GET_LIST_FAILURE,
  payload: {
    error
  }
});

export const clearGts = () => ({ type: GTS.CLEAR });

export const setGtsParams = (payload) => ({
  type: GTS.SET_LIST_PARAMS,
  payload
});

export const gtsGetList = (params) => {
  return async (dispatch) => {
    const { type, ...paramsWithoutType } = params;
    dispatch(getListStarted());
    api.gts
      .getGtsList(type, paramsWithoutType)
      .then((res) => dispatch(getListSuccess(res.data)))
      .catch((error) => dispatch(getListFailure(error)));
  };
};

export const gtsGetInfo = (params) => {
  return async (dispatch) => {
    dispatch(getListStarted());
    api.gts
      .getGtsInfo(params)
      .then((res) => dispatch({ type: GTS.GET_UPLOADED_FILES_SUCCESS, payload: res.data }))
      .catch((error) => dispatch(getListFailure(error)));
  };
};

export const gtsUploadFiles = (data, callback) => {
  return async (dispatch) => {
    dispatch(getListStarted());
    api.gts
      .uploadFiles(data)
      .then(callback)
      .catch((error) => dispatch(getListFailure(error)));
  };
};

export const gtsUploadResults = (uid, params) => {
  return async (dispatch) => {
    dispatch(getListStarted());
    api.gts
      .getUploadResult(uid, params)
      .then((res) => dispatch({ type: GTS.GET_RESULT_LIST_SUCCESS, payload: res.data }))
      .catch((error) => dispatch(getListFailure(error)));
  };
};

export const gtsDownloadFileFailure = (error) => ({
  type: GTS.DOWNLOAD_TKO_REPORT_FAILURE,
  payload: {
    error
  }
});

export const getDkoDataStarted = () => ({
  type: GTS.GET_DKO_DATA_STARTED
});

export const getDkoDataSuccess = (payload) => ({
  type: GTS.GET_DKO_DATA_SUCCESS,
  payload
});

export const getDkoDataFailure = (error) => ({
  type: GTS.GET_DKO_DATA_FAILURE,
  payload: {
    error
  }
});

export const getDkoData = (uid, type, period, params) => {
  return async (dispatch) => {
    dispatch(getDkoDataStarted());
    api.gts
      .getDkoData(uid, type, period, params)
      .then((res) => dispatch(getDkoDataSuccess(res.data)))
      .catch((error) => dispatch(getDkoDataFailure(error)));
  };
};

export const clearDkoData = () => ({ type: GTS.CLEAR_DKO_DATA });

export const getGtsReportsStarted = () => ({
  type: GTS.GET_REPORTS_STARTED
});

export const getGtsReportsSuccess = (payload) => ({
  type: GTS.GET_REPORTS_SUCCESS,
  payload
});

export const getGtsReportsFailure = (error) => ({
  type: GTS.GET_REPORTS_FAILURE,
  payload: {
    error
  }
});

export const getGtsReports = (params) => {
  return async (dispatch) => {
    dispatch(getGtsReportsStarted());
    api.gts
      .getReports(params)
      .then((res) => dispatch(getGtsReportsSuccess(res.data)))
      .catch((error) => dispatch(getGtsReportsFailure(error)));
  };
};

export const downloadGtsReportStarted = () => ({
  type: GTS.DOWNLOAD_REPORT_STARTED
});

export const downloadGtsReportSuccess = () => ({
  type: GTS.DOWNLOAD_REPORT_SUCCESS
});

export const downloadGtsReportFailure = (error) => ({
  type: GTS.DOWNLOAD_REPORT_FAILURE,
  payload: {
    error
  }
});

export const downloadGtsReport = (file_uid, file_name) => {
  return async (dispatch) => {
    dispatch(downloadGtsReportStarted());
    api.files
      .downloadByUid(file_uid)
      .then((res) => {
        dispatch(downloadGtsReportSuccess());
        if (res.status === 200) {
          saveAsFile(res.data, file_name, res.headers['content-type'] || '');
        }
      })
      .catch((error) => dispatch(downloadGtsReportFailure(error)));
  };
};

export const revokeGtsReportStarted = () => ({
  type: GTS.GTS_REVOKE_REPORT_STARTED
});

export const revokeGtsReportSuccess = () => ({
  type: GTS.GTS_REVOKE_REPORT_SUCCESS
});

export const revokeGtsReportFailure = (error) => ({
  type: GTS.GTS_REVOKE_REPORT_FAILURE,
  payload: {
    error
  }
});

export const revokeGtsReport = (report_uid) => {
  return async (dispatch) => {
    dispatch(revokeGtsReportStarted());
    api.gts
      .revokeReport(report_uid)
      .then(() => {
        dispatch(revokeGtsReportSuccess());
      })
      .catch((error) => dispatch(revokeGtsReportFailure(error)));
  };
};

export const generalSettingsReportStarted = () => ({
  type: GTS.GENERAL_SETTINGS_REPORT_STARTED
});

export const generalSettingsReportSuccess = (payload) => ({
  type: GTS.GENERAL_SETTINGS_REPORT_SUCCESS,
  payload
});

export const generalSettingsReportFailure = (error) => ({
  type: GTS.GENERAL_SETTINGS_REPORT_FAILURE,
  payload: {
    error
  }
});

export const generalSettingsReport = (type) => {
  return async (dispatch, getState) => {
    const {
      gts: { reportSettings }
    } = getState();

    dispatch(generalSettingsReportStarted());
    api.gts
      .generalSettingsReport(type)
      .then((res) => {
        const defaultSettings = {};
        const prepareFilter = {};

        res.data.forEach((item) => {
          defaultSettings[item.key] = { options: item.values, defaultValue: item.default };
        });

        res.data.forEach((item) => {
          prepareFilter[item.key] = item.default;
        });

        dispatch(generalSettingsReportSuccess(defaultSettings));
        dispatch({
          type: GTS.SET_QUALITY_TYPE_LIST,
          payload: res.data?.find((i) => i.key === 'quality_type')?.values || []
        });
        const updatedSettings = {
          ...reportSettings,
          ...prepareFilter,
          period_from: null,
          period_to: null,
          version: null
        };
        dispatch(setGtsReportSettingFilters(updatedSettings));
        dispatch(setOriginalSettingsData(updatedSettings));
      })
      .catch((error) => dispatch(generalSettingsReportFailure(error)));
  };
};

// REPORT SETTINGS

export const gtsError = (payload) => ({
  type: GTS.ERROR,
  payload
});

export const setGtsReportSettingFilters = (payload) => ({
  type: GTS.SET_REPORT_FILTERS,
  payload
});

export const setOriginalSettingsData = (payload) => ({
  type: GTS.ORIGINAL_SETTINGS_DATA,
  payload
});

export const prepareReportSettings = (reportSettings, quality_types) => {
  let { quality_type, ...settings } = reportSettings;
  if (quality_type === null) {
    return settings;
  }
  let qualityValue = quality_type;
  if (typeof quality_type !== 'string') {
    if (quality_types?.length === quality_type?.length || quality_type?.length === 0) {
      qualityValue = null;
    } else {
      qualityValue = quality_type?.map((i) => i.value) || null;
    }
  }
  return { ...settings, quality_type: qualityValue };
};

export const gtsCreateInstanceByEic = async (dispatch, settings, quality_types) => {
  try {
    const res = await api.gts.gtsCreateTkoInstance('by-eic', prepareReportSettings(settings, quality_types));
    if (res.data?.uid) {
      dispatch({ type: GTS.SET_UID_FOR_DIFFERENT_REPORTS, payload: res.data?.uid });
    }
    return res.data?.uid;
  } catch (error) {
    dispatch({ type: GTS.ERROR, payload: { error } });
  }
  return null;
};

export const gtsCreateInstanceByVersion = async (dispatch, settings, quality_types) => {
  try {
    const res = await api.gts.gtsCreateTkoInstance('by-version', prepareReportSettings(settings, quality_types));
    if (res.data?.uid) {
      dispatch({ type: GTS.SET_UID_FOR_DIFFERENT_REPORTS, payload: res.data?.uid });
    }
    return res.data?.uid;
  } catch (error) {
    dispatch({ type: GTS.ERROR, payload: { error } });
  }
  return null;
};

export const gtsCreateInstanceByRelease = async (dispatch, settings, quality_types) => {
  try {
    const res = await api.gts.gtsCreateTkoInstance('by-release', prepareReportSettings(settings, quality_types));
    if (res.data?.uid) {
      dispatch({ type: GTS.SET_UID_FOR_DIFFERENT_REPORTS, payload: res.data?.uid });
    }
    return res.data?.uid;
  } catch (error) {
    dispatch({ type: GTS.ERROR, payload: { error } });
  }
  return null;
};

// UPDATE REPORT BY EIC

const gtsUpdateReportByEicStarted = () => ({
  type: GTS.UPDATE_REPORT_BY_EIC_STARTED
});

const gtsUpdateReportByEicSuccess = (payload) => ({
  type: GTS.UPDATE_REPORT_BY_EIC_SUCCESS,
  payload
});

const gtsUpdateReportByEicFailure = (error) => ({
  type: GTS.ERROR,
  payload: {
    error
  }
});

export const gtsUpdateReportByEic = (data) => {
  return async (dispatch, getState) => {
    dispatch(gtsUpdateReportByEicStarted());
    let {
      gts: { report_uid, reportSettings, quality_types }
    } = getState();

    if (!report_uid) {
      report_uid = await gtsCreateInstanceByEic(dispatch, reportSettings, quality_types);
      if (!report_uid) return;
    }
    api.gts
      .updateReportByEic(report_uid, data)
      .then((res) => {
        if (res.data.tkos.data.length === 0) {
          dispatch({ type: GTS.DELETE_ALL_TKOS });
        } else {
          dispatch(gtsUpdateReportByEicSuccess(res.data));
        }
      })
      .catch((err) => dispatch(gtsUpdateReportByEicFailure(err)));
  };
};

// PAGINATE REPORT BY EIC

export const gtsGetReportByEic = (params) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid }
    } = getState();
    dispatch(gtsUpdateReportByEicStarted());
    api.gts
      .getReportByEic(report_uid, params)
      .then((res) => dispatch(gtsUpdateReportByEicSuccess(res.data)))
      .catch((err) => dispatch(gtsUpdateReportByEicFailure(err)));
  };
};

// CREATING REPORT BY EIC

export const gtsCreateReportByEic = (onSuccess) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid, reportSettings, quality_types }
    } = getState();
    if (report_uid) {
      dispatch(gtsUpdateReportByEicStarted());
      api.gts
        .createReportByEic(report_uid, prepareReportSettings(reportSettings, quality_types))
        .then(() => {
          dispatch({ type: GTS.CREATE_REPORT_BY_EIC_SUCCESS });
          onSuccess();
        })
        .catch((error) => dispatch(gtsUpdateReportByEicFailure(error)));
    }
  };
};

// GET RELEASES

export const gtsVerifyTko = (type, eic, onSuccess, onError) => {
  return async (dispatch, getState) => {
    const defaultMessage = 'За вибраними параметрами неможливо створити звіт';
    let {
      gts: { report_uid }
    } = getState();
    if (!report_uid) {
      const {
        gts: { reportSettings, quality_types }
      } = getState();
      try {
        const res = await api.gts.gtsCreateTkoInstance(type, prepareReportSettings(reportSettings, quality_types));
        if (res.data?.uid) {
          dispatch({ type: GTS.SET_UID_FOR_DIFFERENT_REPORTS, payload: res.data.uid });
          report_uid = res.data.uid;
        } else return onError(defaultMessage);
      } catch (error) {
        return onError(defaultMessage);
      }
    }
    api.gts
      .gtsVerifyTko(type, report_uid, { z_eic: eic })
      .then((res) => onSuccess(res.data?.uid))
      .catch((error) => onError(error?.response?.data?.detail));
  };
};

// UPDATE REPORT BY RELEASE
export const updateReportByRelease = (payload) => ({
  type: GTS.UPDATE_REPORT_BY_RELEASE,
  payload
});

export const gtsCreateReportByRelease = (onSuccess) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid, reportSettings, quality_types }
    } = getState();
    if (report_uid) {
      dispatch(gtsUpdateReportByReleaseStarted());
      api.gts
        .createReportByRelease(report_uid, prepareReportSettings(reportSettings, quality_types))
        .then(() => {
          dispatch({ type: GTS.CREATE_REPORT_BY_RELEASE_SUCCESS });
          onSuccess();
        })
        .catch((error) => dispatch(gtsUpdateReportByReleaseFailure({ error })));
    }
  };
};

// REPORT BY ZV

export const getEicYList = () => {
  return async (dispatch) => {
    api.gts.getEicYList().then((res) => {
      dispatch({ type: GTS.GET_EIC_Y_LIST_SUCCESS, payload: res.data?.map((i) => ({ value: i, label: i })) });
    });
  };
};

export const gtsCreateInstanceByZV = async (dispatch) => {
  const res = await api.gts.createInstanceByZV();
  if (res.data?.uid) {
    dispatch({ type: GTS.SET_UID_FOR_DIFFERENT_REPORTS, payload: res.data?.uid });
  }
  return res.data?.uid;
};

const gtsUpdateReportByZVStarted = () => ({
  type: GTS.UPDATE_REPORT_BY_ZV_STARTED
});

const gtsUpdateReportByZVSuccess = (payload) => ({
  type: GTS.UPDATE_REPORT_BY_ZV_SUCCESS,
  payload
});

const gtsUpdateReportByZVFailure = (payload) => ({
  type: GTS.ERROR,
  payload
});

export const gtsUpdateReportByZV = (data, onSuccess) => {
  return async (dispatch, getState) => {
    dispatch(gtsUpdateReportByZVStarted());
    const {
      gts: { report_uid }
    } = getState();
    let uid = report_uid;
    if (!uid) {
      uid = await gtsCreateInstanceByZV(dispatch);
    }
    onSuccess && onSuccess();
    api.gts
      .updateReportByZV(uid, data)
      .then((res) => {
        dispatch(gtsUpdateReportByZVSuccess(res.data));
      })
      .catch((err) => dispatch(gtsUpdateReportByZVFailure(err)));
  };
};

export const gtsGetReportByZV = (params) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid }
    } = getState();
    dispatch(gtsUpdateReportByZVStarted());
    api.gts
      .getReportByZV(report_uid, params)
      .then((res) => dispatch(gtsUpdateReportByZVSuccess(res.data)))
      .catch((err) => dispatch(gtsUpdateReportByZVFailure(err)));
  };
};

export const gtsVerifyZvCode = (eic, onSuccess, onEmpty) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid }
    } = getState();
    const params = {
      eic,
      page: 1,
      size: 10
    };
    const request = report_uid ? api.gts.verifyZvCode(report_uid, params) : api.gts.verifyZV(params);
    request
      .then((res) => (res?.data?.total === 1 ? onSuccess(res.data?.data[0]?.uid) : onEmpty()))
      .catch((error) => {
        onEmpty();
        dispatch(gtsError({ error }));
      });
  };
};

export const gtsCreateReportByZV = (onSuccess) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid, reportSettings, quality_types }
    } = getState();
    if (report_uid) {
      dispatch(gtsUpdateReportByZVStarted());
      api.gts
        .createReportByZV(report_uid, prepareReportSettings(reportSettings, quality_types))
        .then(() => {
          dispatch({ type: GTS.CREATE_REPORT_BY_ZV_SUCCESS });
          onSuccess();
        })
        .catch((error) => dispatch(gtsUpdateReportByZVFailure({ error })));
    }
  };
};

export const uploadZVFile = (file) => {
  return async (dispatch) => {
    dispatch(gtsUpdateReportByZVStarted());
    const formData = new FormData();
    formData.append('file_original', file);
    const uid = await gtsCreateInstanceByZV(dispatch);
    if (!uid) return;
    api.gts
      .uploadZVFile(uid, formData)
      .then((res) => {
        dispatch(gtsUpdateReportByZVSuccess(res?.data));
        if (res?.data?.file_processed_id) {
          dispatch(
            downloadFileById(res.data.file_processed_id, i18n.t('FILENAMES.RESULT_OF_LOADING_TKO_TYPE_ZV_xlsx'))
          );
        }
      })
      .catch((error) => dispatch(gtsUpdateReportByZVFailure(error)));
  };
};

export const uploadFileByEic = (file) => {
  return async (dispatch, getState) => {
    dispatch(gtsUpdateReportByEicStarted());
    const formData = new FormData();
    formData.append('file_original', file);

    const {
      gts: { reportSettings, quality_types }
    } = getState();

    const uid = await gtsCreateInstanceByEic(dispatch, reportSettings, quality_types);
    if (!uid) return;

    api.gts
      .uploadFileByEic(uid, formData)
      .then((res) => {
        dispatch(gtsUpdateReportByEic()).then(() => {
          dispatch(gtsUpdateReportByEicSuccess(res?.data));

          if (res?.data?.file_processed_id) {
            dispatch(
              downloadFileById(res.data.file_processed_id, i18n.t('FILENAMES.RESULT_OF_LOADING_TKO_TYPE_EIC_xlsx'))
            );
          }
        });
      })
      .catch((error) => dispatch(gtsUpdateReportByEicFailure(error)));
  };
};

export const uploadFileByVersion = (file) => {
  return async (dispatch, getState) => {
    dispatch(gtsUpdateReportByVersionStarted());
    const formData = new FormData();
    formData.append('file_original', file);

    const {
      gts: { reportSettings, quality_types }
    } = getState();

    const uid = await gtsCreateInstanceByVersion(dispatch, reportSettings, quality_types);
    if (!uid) return;

    api.gts
      .uploadFileByVersion(uid, formData)
      .then((res) => {
        dispatch(gtsUpdateReportByVersion()).then(() => {
          dispatch(gtsUpdateReportByVersionSuccess(res?.data));

          if (res?.data?.file_processed_id) {
            dispatch(
              downloadFileById(res.data.file_processed_id, i18n.t('FILENAMES.RESULT_OF_LOADING_TKO_TYPE_VERSION_xlsx'))
            );
          }
        });
      })
      .catch((error) => dispatch(gtsUpdateReportByVersionFailure(error)));
  };
};

// PAGINATE REPORT BY RELEASE

export const gtsGetReportByRelease = (params) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid }
    } = getState();
    dispatch(gtsUpdateReportByReleaseStarted());
    api.gts
      .getReportByRelease(report_uid, params)
      .then((res) => dispatch(gtsUpdateReportByReleaseSuccess(res.data)))
      .catch((err) => dispatch(gtsUpdateReportByReleaseFailure(err)));
  };
};

// UPDATE REPORT BY RELEASE

const gtsUpdateReportByReleaseStarted = () => ({
  type: GTS.UPDATE_REPORT_BY_RELEASE_STARTED
});

const gtsUpdateReportByReleaseSuccess = (payload) => ({
  type: GTS.UPDATE_REPORT_BY_RELEASE_SUCCESS,
  payload
});

const gtsUpdateReportByReleaseFailure = (error) => ({
  type: GTS.ERROR,
  payload: {
    error
  }
});

export const gtsUpdateReportByRelease = (data) => {
  return async (dispatch, getState) => {
    dispatch({ type: GTS.DOWNLOAD_REPORT_STARTED });
    let {
      gts: { report_uid, reportSettings, quality_types }
    } = getState();
    if (!report_uid) {
      report_uid = await gtsCreateInstanceByRelease(dispatch, reportSettings, quality_types);
    }
    api.gts
      .updateReportByRelease(report_uid, data)
      .then((res) => {
        dispatch(gtsUpdateReportByReleaseSuccess(res.data));
      })
      .catch((err) => dispatch(gtsUpdateReportByReleaseFailure(err)));
  };
};

export const uploadFileByRelease = (file) => {
  return async (dispatch, getState) => {
    dispatch(gtsUpdateReportByReleaseStarted());
    const formData = new FormData();
    formData.append('file_original', file);

    const {
      gts: { reportSettings, quality_types }
    } = getState();

    const uid = await gtsCreateInstanceByRelease(dispatch, reportSettings, quality_types);
    if (!uid) return;

    api.gts
      .uploadFileByRelease(uid, formData)
      .then((res) => {
        dispatch(gtsUpdateReportByRelease()).then(() => {
          dispatch(gtsUpdateReportByReleaseSuccess(res?.data));

          if (res?.data?.file_processed_id) {
            dispatch(
              downloadFileById(res.data.file_processed_id, i18n.t('FILENAMES.RESULT_OF_LOADING_TKO_TYPE_EIC_xlsx'))
            );
          }
        });
      })
      .catch((error) => dispatch(gtsUpdateReportByReleaseFailure(error)));
  };
};

export const gtsDownloadDKO = (type, params) => {
  return async (dispatch) => {
    api.gts
      .gtsDownloadDKO(type, params)
      .then((res) => {
        if (res.status === 200) {
          const fileName = res.headers['content-disposition']
            ? decodeURIComponent(res.headers['content-disposition'].replaceAll("attachment; filename*=utf-8''", ''))
            : i18n.t('FILENAMES.EXPORT_DKO_xlsx');
          saveAsFile(
            res.data,
            fileName,
            res.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
        }
      })
      .catch((error) => dispatch(gtsDownloadFileFailure(error)));
  };
};

export const gtsDownloadFile = (uid, eic, params, onFinally) => {
  return async (dispatch) => {
    api.gts
      .gtsDownloadFile(uid, params)
      .then((res) => {
        saveAsFile(
          res.data,
          i18n.t('FILENAMES.EXPORT_DKO_EIC_xlsx', { eic: eic }),
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
      })
      .catch((error) => dispatch(gtsDownloadFileFailure(error)))
      .finally(onFinally);
  };
};

// REPORT BY COMPONENTS ZV

const gtsUpdateReportByComponentsZVStarted = () => ({
  type: GTS.UPDATE_REPORT_BY_COMPONENTS_ZV_STARTED
});

export const gtsCreateInstanceByComponentsZV = async (dispatch) => {
  const res = await api.gts.createInstanceByComponentsZV();
  if (res.data?.uid) {
    dispatch({ type: GTS.SET_UID_FOR_DIFFERENT_REPORTS, payload: res.data?.uid });
  }
  return res.data?.uid;
};

const gtsUpdateReportByComponentsZVSuccess = (payload) => ({
  type: GTS.UPDATE_REPORT_BY_COMPONENTS_ZV_SUCCESS,
  payload
});

const gtsUpdateReportByComponentsZVFailure = (payload) => ({
  type: GTS.ERROR,
  payload
});

export const gtsUpdateReportByComponentsZV = (data, onSuccess) => {
  return async (dispatch, getState) => {
    dispatch(gtsUpdateReportByComponentsZVStarted());
    const {
      gts: { report_uid }
    } = getState();
    let uid = report_uid;
    if (!uid) {
      uid = await gtsCreateInstanceByComponentsZV(dispatch);
    }
    onSuccess && onSuccess();
    api.gts
      .updateReportByComponentsZV(uid, data)
      .then((res) => {
        dispatch(gtsUpdateReportByComponentsZVSuccess(res.data));
      })
      .catch((err) => dispatch(gtsUpdateReportByComponentsZVFailure(err)));
  };
};

export const gtsGetReportByComponentsZV = (params) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid }
    } = getState();
    dispatch(gtsUpdateReportByComponentsZVStarted());
    api.gts
      .getReportByComponentsZV(report_uid, params)
      .then((res) => dispatch(gtsUpdateReportByComponentsZVSuccess(res.data)))
      .catch((err) => dispatch(gtsUpdateReportByComponentsZVFailure(err)));
  };
};

export const gtsVerifyComponentsZvCode = (eic, onSuccess, onEmpty) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid }
    } = getState();
    const params = {
      eic,
      page: 1,
      size: 10
    };
    let uid = report_uid;
    if (!uid) {
      uid = await gtsCreateInstanceByComponentsZV(dispatch);
    }
    const request = uid ? api.gts.verifyComponentsZvCode(uid, params) : api.gts.verifyComponentsZV(params);
    request
      .then((res) => (res?.data?.total === 1 ? onSuccess(res.data?.data[0]?.uid) : onEmpty()))
      .catch((error) => {
        onEmpty();
        dispatch(gtsError({ error }));
      });
  };
};

export const gtsCreateReportByComponentsZV = (onSuccess) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid, reportSettings, quality_types }
    } = getState();
    if (report_uid) {
      dispatch(gtsUpdateReportByComponentsZVStarted());
      api.gts
        .createReportByComponentsZV(report_uid, prepareReportSettings(reportSettings, quality_types))
        .then(() => {
          dispatch({ type: GTS.CREATE_REPORT_BY_COMPONENTS_ZV_SUCCESS });
          onSuccess();
        })
        .catch((error) => dispatch(gtsUpdateReportByComponentsZVFailure({ error })));
    }
  };
};

export const uploadComponentsZVFile = (file) => {
  return async (dispatch) => {
    dispatch(gtsUpdateReportByComponentsZVStarted());
    const formData = new FormData();
    formData.append('file_original', file);
    const uid = await gtsCreateInstanceByComponentsZV(dispatch);
    if (!uid) return;
    api.gts
      .uploadComponentsZVFile(uid, formData)
      .then((res) => {
        dispatch(gtsUpdateReportByComponentsZVSuccess(res?.data));
        if (res?.data?.file_processed_id) {
          dispatch(
            downloadFileById(res.data.file_processed_id, i18n.t('FILENAMES.RESULT_OF_LOADING_TKO_TYPE_ZV_xlsx'))
          );
        }
      })
      .catch((error) => dispatch(gtsUpdateReportByComponentsZVFailure(error)));
  };
};

// UPDATE REPORT BY VERSION

const gtsUpdateReportByVersionStarted = () => ({
  type: GTS.UPDATE_REPORT_BY_VERSION_STARTED
});

const gtsUpdateReportByVersionSuccess = (payload) => ({
  type: GTS.UPDATE_REPORT_BY_VERSION_SUCCESS,
  payload
});

const gtsUpdateReportByVersionFailure = (error) => ({
  type: GTS.ERROR,
  payload: {
    error
  }
});

export const gtsUpdateReportByVersion = (data) => {
  return async (dispatch, getState) => {
    dispatch(gtsUpdateReportByVersionStarted());
    let {
      gts: { report_uid, reportSettings, quality_types }
    } = getState();

    if (!report_uid) {
      report_uid = await gtsCreateInstanceByVersion(dispatch, reportSettings, quality_types);
      if (!report_uid) return;
    }
    api.gts
      .updateReportByVersion(report_uid, data)
      .then((res) => {
        if (res.data.tkos.data.length === 0) {
          dispatch({ type: GTS.DELETE_ALL_TKOS_BY_VERSION });
        } else {
          dispatch(gtsUpdateReportByVersionSuccess(res.data));
        }
      })
      .catch((err) => dispatch(gtsUpdateReportByVersionFailure(err)));
  };
};

// PAGINATE REPORT BY VERSION

export const gtsGetReportByVersion = (params) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid }
    } = getState();
    dispatch(gtsUpdateReportByVersionStarted());
    api.gts
      .getReportByVersion(report_uid, params)
      .then((res) => dispatch(gtsUpdateReportByVersionSuccess(res.data)))
      .catch((err) => dispatch(gtsUpdateReportByVersionFailure(err)));
  };
};

// CREATING REPORT BY VERSION

export const gtsCreateReportByVersion = (onSuccess) => {
  return async (dispatch, getState) => {
    const {
      gts: { report_uid, reportSettings, quality_types }
    } = getState();
    if (report_uid) {
      dispatch(gtsUpdateReportByVersionStarted());
      api.gts
        .createReportByVersion(report_uid, prepareReportSettings(reportSettings, quality_types))
        .then(() => {
          dispatch({ type: GTS.CREATE_REPORT_BY_VERSION_SUCCESS });
          onSuccess();
        })
        .catch((error) => dispatch(gtsUpdateReportByVersionFailure(error)));
    }
  };
};
