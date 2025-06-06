import { createSlice } from '@reduxjs/toolkit';

export const defaultParams = { page: 1, size: 25 };

const initialState = {
  params: defaultParams
};

const slice = createSlice({
  name: 'processSettings',
  initialState,
  reducers: {
    setParams(state, { payload }) {
      state.params = payload;
    }
  }
});

export const { setParams } = slice.actions;
export default slice.reducer;
