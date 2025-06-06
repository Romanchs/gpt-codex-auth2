import { createSlice } from '@reduxjs/toolkit';

const defaultParams = { page: 1, size: 25 };
const defaultData = { group: '', name: '' };

const initialState = {
  dataListParams: defaultParams,
  detailsData: defaultData
};

const slice = createSlice({
  name: 'consistencyMonitoringDetails',
  initialState,
  reducers: {
    setDataListParams(state, { payload }) {
      state.processListParams = payload;
    },
    clearDataListParams(state) {
      state.processListParams = defaultParams;
    },
    setDetailsData(state, { payload }) {
      state.detailsData = payload;
    },
    clearAllData(state) {
      state.detailsData = defaultData;
      state.dataListParams = defaultParams;
    }
  }
});

export const { setDataListParams, clearDataListParams, setDetailsData, clearAllData } = slice.actions;
export default slice.reducer;
