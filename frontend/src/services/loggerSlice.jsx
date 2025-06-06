import { createSlice } from '@reduxjs/toolkit';
import { getFeature } from '../util/getFeature';

const initialState = {
  status: 0,
  body: null,
  endpoint: '',
  open: false
};

const slice = createSlice({
  name: 'logger',
  initialState,
  reducers: {
    handleClose: (state) => {
      state.open = false;
    }
  },
  extraReducers: (builder) => {
    getFeature('logger') &&
      builder.addMatcher(
        (action) => {
          return (
            ((action.type === 'mainApi/executeQuery/rejected' || action.type === 'mainApi/executeMutation/rejected') &&
              !action.meta.condition) ||
            action.type.endsWith('_FAILURE')
          );
        },
        (state, action) => {
          if (action.type === 'mainApi/executeMutation/rejected' || action.type === 'mainApi/executeQuery/rejected') {
            state.status = action.payload?.status;
            state.body = JSON.stringify(action.payload?.data);
            state.endpoint =
              action.meta?.baseQueryMeta?.request?.method + ' ' + action.meta?.baseQueryMeta?.request?.url;
          } else {
            const res = action.payload.error?.response;
            state.status = res?.status;
            state.body = JSON.stringify(res?.data);
            state.endpoint = res?.config?.method?.toUpperCase() + ' ' + res?.request?.responseURL;
          }
          state.open = true;
        }
      );
  }
});

export const { handleClose } = slice.actions;
export default slice.reducer;
