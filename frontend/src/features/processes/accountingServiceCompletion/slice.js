import { createSlice } from '@reduxjs/toolkit';

const initDataDefault = {
  roles_info: {
    meter_point_admin: false,
    meter_data_collector: false,
    meter_data_responsible: false,
    meter_operator: false
  }
};

const initialState = {
  initData: initDataDefault
};

const slice = createSlice({
  name: 'accountingServiceCompletion',
  initialState,
  reducers: {
    setInitData(state, { payload }) {
      state.initData = payload;
    },
    resetInitData(state) {
      state.initData = initDataDefault
    }
  }
});

export const { setInitData, resetInitData } = slice.actions;
export default slice.reducer;
