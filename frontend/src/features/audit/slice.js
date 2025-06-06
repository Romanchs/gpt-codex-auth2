import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const initialState = {
  pagination: { page: 1, size: 25 },
  mainFilters: {},
  tableFilters: {},
  viewData: {},
  status: '',
  aps: {}
};

const auditsSlice = createSlice({
  name: 'audits',
  initialState,
  reducers: {
    onPaginate: (state, { payload }) => {
      state.pagination = { ...state.pagination, ...payload };
    },
    onChangeMainFilters: (state, { payload: [key, value] }) => {
      state.mainFilters = { ...state.mainFilters, [key]: value || undefined };
      state.pagination = { ...state.pagination, page: 1 };
    },
    onChangeTableFilters: (state, { payload }) => {
      state.tableFilters = { ...state.tableFilters, ...payload };
      state.pagination = { ...state.pagination, page: 1 };
    },
    setViewData: (state, { payload }) => {
      state.viewData = payload;
      state.aps = payload?.aps;
      state.isCanceled = payload?.status === 'CANCELED';
    },
    onUpdateViewData: (state, { payload }) => {
      state.viewData = payload;
    },
    onUpdateApsData: (state, { payload }) => {
      state.aps = payload;
    },
    onUpdateSpApsData: (state, { payload }) => {
      state.aps[payload.mpEic].sp_list[payload.index] = payload.data;
    },
    onDeleteSpFromApsData: (state, { payload }) => {
      state.aps[payload.mpEic].sp_list = state.aps[payload.mpEic].sp_list.filter((v) => v.eic_z !== payload.spEic)
    },
    onUpdateMpApsData: (state, { payload }) => {
      state.aps[payload.mpEic] = payload.data;
    }
  }
});

export const { onPaginate, onChangeMainFilters, onChangeTableFilters, setViewData, onUpdateViewData, onUpdateApsData, onUpdateSpApsData, onUpdateMpApsData, onDeleteSpFromApsData } = auditsSlice.actions;
export default auditsSlice.reducer;

export const useAuditParams = () => useSelector((store) => store.audits.pagination);
export const useAuditFilters = () => useSelector((store) => store.audits.mainFilters);
export const useAuditTableFilters = () => useSelector((store) => store.audits.tableFilters);
export const useAuditViewData = () => useSelector((store) => store.audits.viewData);
export const useAuditApsData = () => useSelector((store) => store.audits.aps);
export const useAuditIsCanceled = () => useSelector((store) => store.audits.isCanceled);