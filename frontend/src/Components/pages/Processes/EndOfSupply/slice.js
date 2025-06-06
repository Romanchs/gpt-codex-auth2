import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  params: { page: 1, size: 25 }
};

const endOfSupplySlice = createSlice({
  name: 'endOfSupplySlice',
  initialState,
  reducers: {
    setParams(state, action) {
      state.params = action.payload;
    }
  }
});

export const { setParams } = endOfSupplySlice.actions;
export default endOfSupplySlice.reducer;
