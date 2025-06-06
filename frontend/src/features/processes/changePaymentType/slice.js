import { createSlice } from '@reduxjs/toolkit';

export const defaultParams = { page: 1, size: 25 };

const initialState = {
  payment_change_date: null,
  params: defaultParams
};

const slice = createSlice({
  name: 'changePaymentType',
  initialState,
  reducers: {
    setData(state, { payload }) {
      state.payment_change_date = payload;
    },
    setParams(state, { payload }) {
      state.params = payload;
    }
  }
});

export const { setData, setParams } = slice.actions;
export default slice.reducer;
