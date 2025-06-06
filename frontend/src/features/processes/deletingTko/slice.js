import { createSlice } from '@reduxjs/toolkit';
import { ap_statuses, process_types } from './data';

const initialState = {
  processType: process_types[0].value,
  reasonType: '',
  apStatus: ap_statuses[0].value,
  reason: '',
  mpType: '',
  files: null,
  reasonInit: '',
  mustBeFinishedAt: null
};

const deletingTkoSlice = createSlice({
  name: 'deletingTko',
  initialState,
  reducers: {
    setProcessType(state, action) {
      state.processType = action.payload;
    },
    setReasonType(state, action) {
      state.reasonType = action.payload;
    },
    setReason(state, action) {
      state.reason = action.payload;
    },
    setReasonInit(state, action) {
      state.reasonInit = action.payload;
    },
    setMustBeFinishedAt(state, action) {
      state.mustBeFinishedAt = action.payload;
    },
    setApStatus(state, action) {
      state.apStatus = action.payload;
    },
    setMpType(state, action) {
      state.mpType = action.payload;
      state.reasonType = '';
    },
    setFiles(state, action) {
      state.files = action.payload;
    },
    resetState() {
      return initialState;
    }
  }
});

export const {
  setProcessType,
  setReasonType,
  setReason,
  setReasonInit,
  setMustBeFinishedAt,
  setApStatus,
  setMpType,
  setFiles,
  resetState
} = deletingTkoSlice.actions;
export default deletingTkoSlice.reducer;
