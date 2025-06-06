import { createSlice } from '@reduxjs/toolkit';

export const defaultParams = { page: 1, size: 25 };

export const defaultSelected = { isAll: false, points: [] };

const initialState = {
  params: defaultParams,
  selected: defaultSelected,
  filters: {},
  points: [],
  showZVImportBtn: true
};

const slice = createSlice({
  name: 'monitoringDko',
  initialState,
  reducers: {
    setParams(state, { payload }) {
      state.params = payload;
    },
    setPoints(state, { payload }) {
      state.points = payload;
    },
    setSelected(state, { payload }) {
      state.selected = payload;
    },
    setFilters(state, { payload }) {
      state.filters = payload;
    },
    setShowHide(state, { payload }) {
      state.showZVImportBtn = payload;
    }
  }
});

export const { setParams, setPoints, setSelected, setFilters, setShowHide } = slice.actions;
export default slice.reducer;
