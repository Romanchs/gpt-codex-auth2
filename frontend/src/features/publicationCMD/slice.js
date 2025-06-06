import { createSlice } from '@reduxjs/toolkit';
import { publicationCmdAPI } from './api';

const initialState = {
  loading: [],
};

const slice = createSlice({
  name: 'publicationCMD',
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      publicationCmdAPI.endpoints.termsFilters.matchPending,
      (state) => {state.loading = [...state.loading, 'termsFilters']},
    ).addMatcher(
      publicationCmdAPI.endpoints.terms.matchPending,
      (state) => {state.loading = [...state.loading, 'terms']},
    ).addMatcher(
      publicationCmdAPI.endpoints.files.matchPending,
      (state) => {state.loading = [...state.loading, 'files']},
    ).addMatcher(
      publicationCmdAPI.endpoints.termsFilters.matchFulfilled,
      (state) => {state.loading = [...state.loading].filter(i => i !== 'termsFilters')},
    ).addMatcher(
      publicationCmdAPI.endpoints.terms.matchFulfilled,
      (state) => {state.loading = [...state.loading].filter(i => i !== 'terms')},
    ).addMatcher(
      publicationCmdAPI.endpoints.files.matchFulfilled,
      (state) => {state.loading = [...state.loading].filter(i => i !== 'files')},
    ).addMatcher(
      publicationCmdAPI.endpoints.termsFilters.matchRejected,
      (state) => {state.loading = [...state.loading].filter(i => i !== 'termsFilters')},
    ).addMatcher(
      publicationCmdAPI.endpoints.terms.matchRejected,
      (state) => {state.loading = [...state.loading].filter(i => i !== 'terms')},
    ).addMatcher(
      publicationCmdAPI.endpoints.files.matchRejected,
      (state) => {state.loading = [...state.loading].filter(i => i !== 'files')},
    )
  }
});

export default slice.reducer;
