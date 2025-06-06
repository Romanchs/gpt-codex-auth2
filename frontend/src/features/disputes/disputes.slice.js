import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import api from '../../util/api';
import { saveAsFile } from '../../util/files';

const initialState = {
  loading: false,
  uploading: false,
  disputeList: null,
  disputeEntity: {},
  searchParams: { page: 1, size: 25 },
  error: null,
  disputeTypes: [],
  disputeStatuses: [],
  disputeContinued: [],
  disputeProperties: [],
  loadingDisputeTypes: false,
  visibleCreate: false,
  selectedTypes: [],
  atkoExecuted: undefined
};

const actions = {
  create: createAsyncThunk('disputes/create', async ({ eic, properties }, { rejectWithValue }) => {
    try {
      const response = await api.disputes.create({ tko_eic: eic, tko_properties: properties });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),
  createDko: createAsyncThunk('dispute/dko', async (params, { rejectWithValue }) => {
    try {
      const response = await api.disputes.createDko(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),
  getList: createAsyncThunk('disputes/getList', async (params, { rejectWithValue }) => {
    try {
      const response = await api.disputes.getList(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),
  getEntity: createAsyncThunk('disputes/entity', async ({ uid }, { rejectWithValue }) => {
    try {
      const response = await api.disputes.getEntity(uid);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),
  getEntityDko: createAsyncThunk('disputes/getEntityDko', async ({ uid }, { rejectWithValue }) => {
    try {
      const response = await api.disputes.getEntityDko(uid);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),
  updateEntity: createAsyncThunk('disputes/updateEntity', async ({ uid, params }, { rejectWithValue }) => {
    try {
      const response = await api.disputes.updateEntity(uid, params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),
  updateEntityDko: createAsyncThunk('disputes/updateEntityDko', async ({ uid, params }, { rejectWithValue }) => {
    try {
      const response = await api.disputes.updateEntityDko(uid, params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response);
    }
  }),
  uploadFile: createAsyncThunk('disputes/uploadFile', async ({ uid, data }, { rejectWithValue }) => {
    try {
      const response = await api.disputes.uploadFile(uid, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),
  uploadFileDko: createAsyncThunk('disputes/uploadFileDko', async ({ uid, data }, { rejectWithValue }) => {
    try {
      const response = await api.disputes.uploadFileDko(uid, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),
  getSettings: createAsyncThunk('disputes/getSettings', async (_, { rejectWithValue }) => {
    try {
      const response = await api.disputes.getSettings();
      return {
        disputeTypes: response.data?.dispute_types,
        disputeContinued: response.data?.dispute_continued,
        disputeStatuses: response.data?.dispute_statuses,
        disputeProperties: response.data?.tko_properties
      };
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),
  updateProperty: createAsyncThunk('disputes/updateProperty', async ({ uid, params }, { rejectWithValue }) => {
    try {
      const response = await api.disputes.updateProps(uid, params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),
  doAction: createAsyncThunk('disputes/action', async ({ uid, action, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.disputes.doAction({ uid, action, params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),

  doActionDko: createAsyncThunk('disputes/doActionDko', async ({ uid, action, params = {} }, { rejectWithValue }) => {
    try {
      const response = await api.disputes.doActionDko({ uid, action, params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response);
    }
  }),
  downloadFile: createAsyncThunk('disputes/downloadFile', async ({ link, fileName }, { rejectWithValue }) => {
    try {
      const response = await api.disputes.downloadFile(link);
      saveAsFile(response.data, fileName, response.headers['content-type'] || '');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }),
  deleteFile: createAsyncThunk('disputes/deleteFile', async (link, { rejectWithValue }) => {
    try {
      const response = await api.disputes.deleteFile(link);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  })
};

const slice = createSlice({
  name: 'disputes',
  initialState,
  reducers: {
    setVisibleCreate: (state, { payload }) => {
      state.visibleCreate = payload;
    },
    setSelectedTypes: (state, { payload }) => {
      state.selectedTypes = payload;
    },
    setSearchParams: (state, { payload }) => {
      state.searchParams = payload;
    },
    setAtkoExecuted: (state, { payload }) => {
      state.atkoExecuted = payload;
    },
    clearSearchParams: (state) => {
      state.searchParams = initialState.searchParams;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(actions.getList.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.getList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.disputeList = payload;
      })
      .addCase(actions.getList.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error;
      });

    builder
      .addCase(actions.create.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.create.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedDisputeTypes = null;
        state.disputeList = payload;
      })
      .addCase(actions.create.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error;
      });

    builder
      .addCase(actions.createDko.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.createDko.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.disputeEntity = payload;
      })
      .addCase(actions.createDko.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error;
      });

    builder
      .addCase(actions.getEntity.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.getEntity.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.disputeEntity = payload;
      })
      .addCase(actions.getEntity.rejected, (state, { payload }) => {
        state.loading = false;
        state.disputeEntity = {};
        state.error = payload?.error;
      });

    builder
      .addCase(actions.getEntityDko.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.getEntityDko.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.disputeEntity = payload;
      })
      .addCase(actions.getEntityDko.rejected, (state, { payload }) => {
        state.loading = false;
        state.disputeEntity = {};
        state.error = payload?.data;
      });

    builder
      .addCase(actions.updateEntity.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.updateEntity.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.disputeEntity = payload;
      })
      .addCase(actions.updateEntity.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.data;
      });

    builder
      .addCase(actions.updateEntityDko.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.updateEntityDko.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.disputeEntity = payload;
      })
      .addCase(actions.updateEntityDko.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.data;
      });

    builder
      .addCase(actions.uploadFile.pending, (state) => {
        state.uploading = true;
      })
      .addCase(actions.uploadFile.fulfilled, (state, { payload }) => {
        state.uploading = false;
        state.disputeEntity = payload;
      })
      .addCase(actions.uploadFile.rejected, (state, { payload }) => {
        state.uploading = false;
        state.error = payload?.error;
      });

    builder
      .addCase(actions.uploadFileDko.pending, (state) => {
        state.uploading = true;
      })
      .addCase(actions.uploadFileDko.fulfilled, (state, { payload }) => {
        state.uploading = false;
        state.disputeEntity = payload;
      })
      .addCase(actions.uploadFileDko.rejected, (state, { payload }) => {
        state.uploading = false;
        state.error = payload?.data;
      });

    builder
      .addCase(actions.getSettings.pending, (state) => {
        state.disputeTypes = [];
        state.disputeContinued = [];
        state.disputeStatuses = [];
        state.disputeProperties = [];
      })
      .addCase(actions.getSettings.fulfilled, (state, { payload }) => {
        state.disputeTypes = payload?.disputeTypes;
        state.disputeContinued = payload?.disputeContinued;
        state.disputeStatuses = payload?.disputeStatuses;
        state.disputeProperties = payload?.disputeProperties;
      })
      .addCase(actions.getSettings.rejected, (state) => {
        state.disputeTypes = [];
        state.disputeContinued = [];
        state.disputeStatuses = [];
        state.disputeProperties = [];
      });

    builder
      .addCase(actions.updateProperty.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.updateProperty.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.disputeEntity = payload;
      })
      .addCase(actions.updateProperty.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error;
      });

    builder
      .addCase(actions.doAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.doAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.disputeEntity = payload;
      })
      .addCase(actions.doAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error;
      });

    builder
      .addCase(actions.doActionDko.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.doActionDko.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.disputeEntity = payload;
      })
      .addCase(actions.doActionDko.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.data;
      });

    builder
      .addCase(actions.downloadFile.pending, (state) => {
        state.loading = false;
      })
      .addCase(actions.downloadFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(actions.downloadFile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error;
      });

    builder
      .addCase(actions.deleteFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(actions.deleteFile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.disputeEntity = payload;
      })
      .addCase(actions.deleteFile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error;
      });
  }
});

export const disputesActions = { ...actions, ...slice.actions };
export default slice.reducer;
