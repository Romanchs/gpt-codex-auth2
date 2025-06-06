import { createSlice } from '@reduxjs/toolkit';

export const defaultParams = {
  page: 1,
  size: 25
};

export const defaultInitData = {
  ppko_change_date: null,
  roles: []
};

const initialState = {
  params: defaultParams,
  dataForInit: defaultInitData
};

const slice = createSlice({
  name: 'changePPKO',
  initialState,
  reducers: {
    setParams(state, { payload }) {
      state.params = { ...state.params, ...payload };
    },
    setDataForInit(state, { payload }) {
      state.dataForInit = { ...state.dataForInit, ...payload };
    }
  }
});

export const { setDataForInit, setParams } = slice.actions;
export default slice.reducer;
