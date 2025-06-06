import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  data: ''
};

const securityHandlerSlice = createSlice({
  name: 'securityHandler',
  initialState,
  reducers: {
    openSecurityDialog: (state, { payload }) => {
      state.open = true;
      state.data = payload;
    },
    closeSecurityDialog: (state) => {
      state.open = false;
    }
  }
});

export const { openSecurityDialog, closeSecurityDialog } = securityHandlerSlice.actions;
export default securityHandlerSlice.reducer;
