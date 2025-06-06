import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selected: []
};

const meterReadingSlice = createSlice({
  name: 'meterReading',
  initialState,
  reducers: {
    setSelected: (state, { payload }) => {
      const set = new Set(state.selected);
      set.has(payload.uid) ? set.delete(payload.uid) : set.add(payload.uid);
      state.selected = [...set];
    },
    setSelectedMany: (state, { payload }) => {
      const set = new Set(state.selected);
      payload.forEach((i) => set.add(i.uid));
      state.selected = [...set];
    },
    setUnselected: (state, { payload }) => {
      const set = new Set(state.selected);
      payload.forEach((i) => set.delete(i.uid));
      state.selected = [...set];
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      ({ type, meta }) => {
        return type === 'mainApi/executeMutation/fulfilled' && meta?.arg?.endpointName === 'meterDataExport';
      },
      (state) => {
        state.selected = [];
      }
    );
  }
});

export const { setSelected, setSelectedMany, setUnselected } = meterReadingSlice.actions;
export default meterReadingSlice.reducer;
