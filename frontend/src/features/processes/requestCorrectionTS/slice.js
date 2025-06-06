import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    date_of_lock_ts: null,
    comment: '',
    send_to_mms: '0'
  }
};

const slice = createSlice({
  name: 'requestCorrectionTS',
  initialState,
  reducers: {
    setData(state, { payload }) {
      state.data = payload;
    },
    clearState(state) {
      state.data = initialState.data;
    }
  }
});

export const { setData, clearState } = slice.actions;
export default slice.reducer;
