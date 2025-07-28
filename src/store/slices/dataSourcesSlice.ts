import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { DataSource } from '../../services/api/dataSources';
import * as dataSourcesApi from '../../services/api/dataSources';

interface DataSourcesState {
  items: DataSource[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: DataSourcesState = {
  items: [],
  selectedId: null,
  loading: false,
  error: null,
  lastFetch: null,
};

// Async thunks
export const fetchDataSourcesThunk = createAsyncThunk(
  'dataSources/fetchAll',
  async () => {
    const data = await dataSourcesApi.fetchDataSources();
    return data;
  }
);

export const createDataSourceThunk = createAsyncThunk(
  'dataSources/create',
  async (config: Parameters<typeof dataSourcesApi.createDataSource>[0]) => {
    const data = await dataSourcesApi.createDataSource(config);
    return data;
  }
);

export const updateDataSourceThunk = createAsyncThunk(
  'dataSources/update',
  async ({ id, data }: { id: string; data: Parameters<typeof dataSourcesApi.updateDataSource>[1] }) => {
    const result = await dataSourcesApi.updateDataSource(id, data);
    return result;
  }
);

export const deleteDataSourceThunk = createAsyncThunk(
  'dataSources/delete',
  async (id: string) => {
    await dataSourcesApi.deleteDataSource(id);
    return id;
  }
);

// Slice
const dataSourcesSlice = createSlice({
  name: 'dataSources',
  initialState,
  reducers: {
    setDataSources: (state, action: PayloadAction<DataSource[]>) => {
      state.items = action.payload;
      state.lastFetch = Date.now();
      state.error = null;
    },
    selectDataSource: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload;
    },
    updateDataSourceStatus: (state, action: PayloadAction<{ id: string; status: DataSource['status'] }>) => {
      const dataSource = state.items.find(item => item.id === action.payload.id);
      if (dataSource) {
        dataSource.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch data sources
    builder
      .addCase(fetchDataSourcesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataSourcesThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.lastFetch = Date.now();
      })
      .addCase(fetchDataSourcesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data sources';
      });

    // Create data source
    builder
      .addCase(createDataSourceThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createDataSourceThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create data source';
      });

    // Update data source
    builder
      .addCase(updateDataSourceThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateDataSourceThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update data source';
      });

    // Delete data source
    builder
      .addCase(deleteDataSourceThunk.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.selectedId === action.payload) {
          state.selectedId = null;
        }
      })
      .addCase(deleteDataSourceThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete data source';
      });
  },
});

// Actions
export const {
  setDataSources,
  selectDataSource,
  updateDataSourceStatus,
  setLoading,
  setError,
  clearError,
} = dataSourcesSlice.actions;

// Selectors
export const selectAllDataSources = (state: { dataSources: DataSourcesState }) => 
  state.dataSources.items;

export const selectDataSourceById = (id: string) => (state: { dataSources: DataSourcesState }) =>
  state.dataSources.items.find(item => item.id === id);

export const selectActiveDataSources = (state: { dataSources: DataSourcesState }) =>
  state.dataSources.items.filter(item => item.status === 'active');

export const selectDataSourcesByProtocol = (protocol: string) => (state: { dataSources: DataSourcesState }) =>
  state.dataSources.items.filter(item => item.protocol === protocol);

// Export reducer
export default dataSourcesSlice.reducer;