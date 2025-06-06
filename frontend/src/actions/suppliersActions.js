import { enqueueSnackbar } from '../actions/notistackActions';
import i18n from '../i18n/i18n';
import api from '../util/api';
import { saveAsFile } from '../util/files';
import { SUPPLIERS } from './types';

export const clearSuppliersData = () => ({
  type: SUPPLIERS.CLEAR_DATA
});

export const setSuppliersParams = (payload) => ({
  type: SUPPLIERS.SET_PARAMS,
  payload
});

export const getSuppliersListStarted = () => ({
  type: SUPPLIERS.GET_LIST.STARTED
});

export const getSuppliersListSuccess = (payload) => ({
  type: SUPPLIERS.GET_LIST.SUCCESS,
  payload
});

const getActivationListSuccess = (payload) => ({
  type: SUPPLIERS.GET_LIST.ACTIVATION_LIST_SUCCESS,
  payload
});

export const getSuppliersListFailure = (error) => ({
  type: SUPPLIERS.GET_LIST.FAILURE,
  payload: {
    error
  }
});

export const getSuppliersList = (params) => {
  return async (dispatch) => {
    dispatch(getSuppliersListStarted());
    api.suppliers
      .getList(params)
      .then((res) => dispatch(getSuppliersListSuccess(res.data)))
      .catch((error) => dispatch(getSuppliersListFailure(error)));
  };
};

export const getTempUserActivationList = (params) => {
  return async (dispatch) => {
    dispatch(getSuppliersListStarted());
    api.suppliers
      .getTempUserActivation(params)
      .then((res) => dispatch(getActivationListSuccess(res.data)))
      .catch((error) => dispatch(getSuppliersListFailure(error)));
  };
};

export const updateTempUserActivation = (uid, data, params) => {
  return async (dispatch) => {
    dispatch(getSuppliersListStarted());
    api.suppliers
      .updateTempUserActivation(uid, data)
      .then(() => dispatch(getTempUserActivationList(params)))
      .catch((error) => dispatch(getSuppliersListFailure(error)));
  };
};

export const getSupplierByUidStarted = () => ({
  type: SUPPLIERS.GET_BY_UID.STARTED
});

export const getSupplierByUidSuccess = (payload) => ({
  type: SUPPLIERS.GET_BY_UID.SUCCESS,
  payload
});

export const getSupplierByUidFailure = (error) => ({
  type: SUPPLIERS.GET_BY_UID.FAILURE,
  payload: {
    error
  }
});

export const getSupplierByUid = (uid) => {
  return async (dispatch) => {
    dispatch(getSupplierByUidStarted());
    api.suppliers
      .getHistory(uid)
      .then((res) => dispatch(getSupplierByUidSuccess(res.data)))
      .catch((error) => dispatch(getSupplierByUidFailure(error)));
  };
};

export const handleSelect = (supplier) => {
  return (dispatch, getState) => {
    const {
      suppliers: { selected }
    } = getState();
    selected.find((i) => i.uid === supplier.uid)
      ? dispatch({
          type: SUPPLIERS.SET_SELECTED,
          payload: selected.filter((i) => i.uid !== supplier.uid)
        })
      : dispatch({ type: SUPPLIERS.SET_SELECTED, payload: [...selected, supplier] });
  };
};

export const suppliersUpdateStatusStarted = () => ({
  type: SUPPLIERS.UPDATE_STATUS.STARTED
});

export const suppliersUpdateStatusSuccess = (data, errors) => ({
  type: SUPPLIERS.UPDATE_STATUS.SUCCESS,
  payload: {
    data,
    errors
  }
});

export const suppliersUpdateStatusFailure = (error) => ({
  type: SUPPLIERS.UPDATE_STATUS.FAILURE,
  payload: {
    error
  }
});

export const suppliersUpdateStatus = (data, onSuccess) => {
  return async (dispatch, getState) => {
    dispatch(suppliersUpdateStatusStarted());
    const {
      suppliers: { selected }
    } = getState();
    api.suppliers
      .changeStatus(data)
      .then((res) => {
        onSuccess();
        res.status === 204
          ? dispatch(suppliersUpdateStatusSuccess([], []))
          : dispatch(
              suppliersUpdateStatusSuccess(
                selected.filter((i) => res.data.party_registers.find((e) => e?.party_register_uid === i.uid)),
                res.data.party_registers
              )
            );
      })
      .catch((error) => dispatch(suppliersUpdateStatusFailure(error)));
  };
};

export const downloadSuppliersStarted = () => ({
  type: SUPPLIERS.DOWNLOAD.STARTED
});

export const downloadSuppliersSuccess = () => ({
  type: SUPPLIERS.DOWNLOAD.SUCCESS
});

export const downloadSuppliersFailure = (error) => ({
  type: SUPPLIERS.DOWNLOAD.FAILURE,
  payload: {
    error
  }
});

export const downloadSuppliersById = (name, file_id) => {
  return async (dispatch) => {
    dispatch(downloadSuppliersStarted());
    api.files
      .downloadByUid(file_id)
      .then((res) => {
        if (res.status === 200) {
          saveAsFile(res.data, name, res.headers['content-type'] || '');
          dispatch(downloadSuppliersSuccess());
        }
      })
      .catch((error) => dispatch(downloadSuppliersFailure(error)));
  };
};

export const downloadAllSuppliers = () => {
  return async (dispatch) => {
    dispatch(downloadSuppliersStarted());
    dispatch(
      enqueueSnackbar({
        message: i18n.t('NOTIFICATIONS.FILE_STARTED_FORMING_STAY_ON_PAGE'),
        options: {
          key: new Date().getTime() + Math.random(),
          variant: 'success',
          autoHideDuration: 5000
        }
      })
    );
    api.suppliers
      .download()
      .then((res) => {
        if (res.status === 200) {
          dispatch(downloadSuppliersById(i18n.t('FILENAMES.ALL_SUPPLIERS_xlsx'), res.data.file_id));
        }
      })
      .catch((error) => dispatch(downloadSuppliersFailure(error)));
  };
};

export const downloadSupplierHistory = (uid, eic) => {
  return async (dispatch) => {
    dispatch(downloadSuppliersStarted());
    dispatch(
      enqueueSnackbar({
        message: i18n.t('NOTIFICATIONS.FILE_STARTED_FORMING_STAY_ON_PAGE'),
        options: {
          key: new Date().getTime() + Math.random(),
          variant: 'success',
          autoHideDuration: 3000
        }
      })
    );
    api.suppliers
      .downloadByUid(uid)
      .then((res) => {
        if (res.status === 200) {
          dispatch(downloadSuppliersById(i18n.t('FILENAMES.HISTORICAL_DATA_SUPPLIERS_EIC_xlsx', {eic}), res.data.file_id));
        }
      })
      .catch((error) => dispatch(downloadSuppliersFailure(error)));
  };
};
