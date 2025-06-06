import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const initialState = {
  language: 'ua',
  copyDialog: {
    open: false,
    data: null
  },
  editDialog: {
    open: false,
    data: null
  },
  publishDialog: {
    open: false,
    data: null
  },
  deleteDialog: {
    open: false,
    data: null
  }
};

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    setLanguage: (state, { payload }) => {
      state.language = payload;
    },
    toggleCopyDialog: (state, { payload }) => {
      state.copyDialog.open = !state.copyDialog.open;
      state.copyDialog.data = payload || null;
    },
    toggleEditDialog: (state, { payload }) => {
      state.editDialog.open = !state.editDialog.open;
      state.editDialog.data = payload || null;
    },
    togglePublishDialog: (state, { payload }) => {
      state.publishDialog.open = !state.publishDialog.open;
      state.publishDialog.data = payload || null;
    },
    toggleDeleteDialog: (state, { payload }) => {
      state.deleteDialog.open = !state.deleteDialog.open;
      state.deleteDialog.data = payload || null;
    }
  }
});

export const { setLanguage, toggleCopyDialog, toggleEditDialog, togglePublishDialog, toggleDeleteDialog } =
  faqSlice.actions;
export default faqSlice.reducer;

export const useFaqLanguage = () => useSelector((store) => store.faq.language);
