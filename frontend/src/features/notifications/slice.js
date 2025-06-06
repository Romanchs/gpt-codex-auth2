import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selected: [],
  dialog: {
    data: null,
    open: false
  },
  openFilter: false
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelected: (state, { payload }) => {
      state.selected = payload;
    },
    openNotification: (state, { payload }) => {
      state.dialog.data = payload;
      state.dialog.open = true;
      state.openFilter = false;
    },
    closeNotification: (state) => {
      state.dialog.open = false;
    },
    toggleFilter: (state) => {
      state.openFilter = !state.openFilter;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      ({ type, meta }) => {
        return type === 'mainApi/executeMutation/fulfilled' && meta.arg.fixedCacheKey === 'delete-notifications';
      },
      (state, { meta }) => {
        state.selected = state.selected.filter((i) => !meta.arg.originalArgs.includes(i));
      }
    );
  }
});

export const { setSelected, openNotification, closeNotification, toggleFilter } = notificationsSlice.actions;
export default notificationsSlice.reducer;
