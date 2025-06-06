import { createSlice } from '@reduxjs/toolkit';

export const defaultParams = {
  cancel_datetime: '',
  cancel_type: 'PPKO_REQUEST',
  comment: '',
  eic: '',
  short_name: '',
  usreou: ''
};

const initialState = {
  params: defaultParams,
  openRejectModal: false
};

const slice = createSlice({
  name: 'cancelPPKO',
  initialState,
  reducers: {
    updateParams(state, { payload }) {
      state.params = { ...state.params, ...payload };
    },
    toggleModal(state, { payload }) {
      state.openRejectModal = payload;
    }
  }
});

export const { updateParams, toggleModal } = slice.actions;
export default slice.reducer;
