import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {}
};

const slice = createSlice({
  name: 'requestArchivingTS',
  initialState,
  reducers: {
    setData(state, { payload }) {
      state.data = payload;
    }
  }
});

export const { setData } = slice.actions;
export default slice.reducer;
