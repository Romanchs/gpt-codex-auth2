import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
  data: null,
  validFilters: false,
  styles: {
    table: {
      mt: '12px',
      mb: 2,
      borderRadius: 8,
      boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.12)'
    },
    tableHeader: {
      p: '16px 32px',
      borderRadius: '8px 8px 0 0',
      backgroundColor: '#223B82'
    },
    tableTitle: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.4
    },
    tableBody: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      alignItems: 'center',
      p: '12px 24px',
      borderRadius: '0 0 8px 8px',
      backgroundColor: '#ffffff',
      '& .MuiChip-deletable': {
        borderRadius: '24px'
      }
    }
  }
};

const isValidData = (data) => {
  if (
    !data.edit_type ||
    !moment(data.period_begin, moment.ISO_8601).isValid() ||
    (['AP_COMPANIES', 'AP_MEASUREMENT_INTERVAL'].includes(data.edit_type) &&
      !moment(data.period_end, moment.ISO_8601).isValid()) ||
    (['AP_PROPERTIES'].includes(data.edit_type) &&
      (!data.ap_properties.length || !moment(data.period_end, moment.ISO_8601).isValid()))
  ) {
    return false;
  }
  if (!data.ap_type) return false;

  return !(!data.description || data.description.length < 10 || data.description.length > 200);
};

const slice = createSlice({
  name: 'updateApsHistory',
  initialState,
  reducers: {
    setInitData(state, { payload }) {
      state.data = payload;
      state.validFilters = isValidData(payload);
    },
    setData(state, { payload }) {
      state.data = payload;
    },
    reset(state) {
      state.data = {};
      state.validFilters = false;
    }
  }
});

export const { setInitData, setData, reset } = slice.actions;
export default slice.reducer;
