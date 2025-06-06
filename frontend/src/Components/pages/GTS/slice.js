import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { prepareReportSettings } from '../../../actions/gtsActions';
import api from '../../../util/api';
import { prepareFieldsData, prepareMultiSearchData } from './utils';

const initialState = {
  initError: {},
  loading: false,
  fieldSettings: [],
  pairs: {},
  fields: {},
  searching: {
    field: '',
    value: '',
    loading: false
  },
  filters: {},
  dates: {},
  isChangedGeneralFilter: false,
  isChangedFilterReportByParams: false,
  isLoadTKO: false
};

const actions = {
  settingsReportByProperties: createAsyncThunk(
    'gts/settingsReportByProperties',
    async ({ type, params }, { rejectWithValue }) => {
      try {
        const response = await api.gts.settingsDirectoryReport(type, params);
        const preparePairs = {};
        let key;
        for (let i = 0; i < response.data.length; i++) {
          if (['search', 'multi_search'].includes(response.data[i].type)) {
            key = response.data[i].key.split('__')[0];
          } else if (response.data[i].type === 'pair_all') {
            key = response.data[i].key.split(response.data[i].key?.endsWith('_to') ? '_to' : '_from')[0];
          }

          if (key) {
            if (!(key in preparePairs)) preparePairs[key] = [];
            preparePairs[key].push(response.data[i].key);
            key = null;
          }
        }
        const pairs = {};
        for (const key in preparePairs) {
          if (preparePairs[key].length > 1) {
            pairs[preparePairs[key][0]] = preparePairs[key][1];
            pairs[preparePairs[key][1]] = preparePairs[key][0];
          }
        }
        return { data: response.data, pairs };
      } catch (err) {
        return rejectWithValue(err.response);
      }
    }
  ),
  initReportByProperties: createAsyncThunk(
    'gts/initReportByProperties',
    async (onSuccess, { getState, rejectWithValue }) => {
      const { reportSettings, quality_types } = getState().gts;
      const fieldSettings = getState().gtsSlice.fieldSettings;
      const fields = getState().gtsSlice.fields;
      const filters = getState().gtsSlice.filters;

      const prepareData = (data) => {
        for (const k in data) {
          if (k === 'point_species' && !data[k]) {
            delete data[k];
            continue;
          }
          if (data[k] === 'Всі') {
            data[k] = null;
          } else if (Array.isArray(data[k])) {
            if (data[k].length === 0) {
              delete data[k];
            } else {
              const values = fieldSettings.find((i) => i.key === k)?.values;
              if (values?.length === data[k].length) {
                data[k] = null;
              } else if (data[k][0]?.label) {
                data[k] = data[k]?.map((i) => i.value);
              }
            }
          }
        }
        return data;
      };

      try {
        const response = await api.gts.createReportByParams({
          ...prepareData(prepareReportSettings(Object.keys(filters).length ? filters : reportSettings, quality_types)),
          ...prepareFieldsData(fields, fieldSettings),
          ...prepareMultiSearchData(fields)
        });
        onSuccess();
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response);
      }
    }
  )
};

const slice = createSlice({
  name: 'gts',
  initialState,
  reducers: {
    setFieldsData(state, { payload }) {
      state.fields = { ...state.fields, ...payload };
    },
    resetFieldsData(state) {
      state.fields = {};
    },
    setSearchingData(state, { payload }) {
      state.searching = payload;
    },
    setFilters(state, { payload }) {
      state.filters = payload;
    },
    resetError(state) {
      state.initError = {};
    },
    setIsChangedGeneralFilter(state, { payload }) {
      state.isChangedGeneralFilter = payload;
    },
    setIsChangedFilterReportByParams(state, { payload }) {
      state.isChangedFilterReportByParams = payload;
    },
    setIsLoadTKO(state, { payload }) {
      state.isLoadTKO = payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(actions.settingsReportByProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.settingsReportByProperties.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.fieldSettings = payload.data;
        state.pairs = payload.pairs;
      })
      .addCase(actions.settingsReportByProperties.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(actions.initReportByProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.initReportByProperties.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(actions.initReportByProperties.rejected, (state, { payload }) => {
        state.loading = false;
        state.initError = payload?.data;
      });
  }
});

export const {
  setFieldsData,
  resetFieldsData,
  setSearchingData,
  setFilters,
  resetError,
  settingsReportByProperties,
  initReportByProperties,
  setIsChangedGeneralFilter,
  setIsChangedFilterReportByParams,
  setIsLoadTKO
} = {
  ...actions,
  ...slice.actions
};
export default slice.reducer;
