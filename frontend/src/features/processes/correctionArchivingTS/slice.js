import { createSlice } from '@reduxjs/toolkit';

export const defaultParams = { page: 1, size: 25 };

export const ACTION_TYPES = {
  correction: 'CORRECTION_TS',
  archiving: 'ARCHIVING_TS'
};

export const AP_TYPES = {
  z: 'Z',
  zv: 'ZV'
};

export const initialInitData = {
  action_type: ACTION_TYPES.correction,
  ap_type: AP_TYPES.z,
  reason: '',
  version: 1
};

const initialState = {
  initData: initialInitData,
  params: defaultParams
};

const slice = createSlice({
  name: 'correctionArchivingTS',
  initialState,
  reducers: {
    setInitData(state, { payload }) {
      state.initData = payload;
    },
    setParams(state, { payload }) {
      state.params = payload;
    }
  }
});

export const { setInitData, setParams } = slice.actions;
export default slice.reducer;
