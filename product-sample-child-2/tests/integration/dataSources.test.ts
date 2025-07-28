import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from '../../src/store';
import { useDataSources } from '../../src/hooks/useDataSources';
import * as dataSourcesApi from '../../src/services/api/dataSources';

// Mock the API module
jest.mock('../../src/services/api/dataSources');

const mockDataSources = [
  {
    id: '1',
    name: 'Test API',
    protocol: 'http' as const,
    connectionDetails: { url: 'https://api.test.com' },
    enabled: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'WebSocket Server',
    protocol: 'websocket' as const,
    connectionDetails: { url: 'wss://ws.test.com' },
    enabled: false,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

describe('Data Sources Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );

  describe('useDataSources Hook', () => {
    it('should fetch data sources on mount', async () => {
      (dataSourcesApi.fetchDataSources as jest.Mock).mockResolvedValue(mockDataSources);

      const { result } = renderHook(() => useDataSources(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.dataSources).toEqual(mockDataSources);
      });

      expect(dataSourcesApi.fetchDataSources).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Failed to fetch');
      (dataSourcesApi.fetchDataSources as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useDataSources(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });

    it('should create a new data source', async () => {
      const newDataSource = {
        id: '3',
        name: 'New Source',
        protocol: 'grpc' as const,
        connectionDetails: { endpoint: 'localhost:50051' },
        enabled: true,
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
      };

      (dataSourcesApi.fetchDataSources as jest.Mock).mockResolvedValue(mockDataSources);
      (dataSourcesApi.createDataSource as jest.Mock).mockResolvedValue(newDataSource);

      const { result } = renderHook(() => useDataSources(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.createDataSource({
        name: 'New Source',
        protocol: 'grpc',
        connectionDetails: { endpoint: 'localhost:50051' },
      });

      await waitFor(() => {
        expect(dataSourcesApi.createDataSource).toHaveBeenCalledWith({
          name: 'New Source',
          protocol: 'grpc',
          connectionDetails: { endpoint: 'localhost:50051' },
        });
      });
    });

    it('should update an existing data source', async () => {
      const updatedDataSource = {
        ...mockDataSources[0],
        name: 'Updated API',
      };

      (dataSourcesApi.fetchDataSources as jest.Mock).mockResolvedValue(mockDataSources);
      (dataSourcesApi.updateDataSource as jest.Mock).mockResolvedValue(updatedDataSource);

      const { result } = renderHook(() => useDataSources(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.updateDataSource({
        id: '1',
        data: { name: 'Updated API' },
      });

      await waitFor(() => {
        expect(dataSourcesApi.updateDataSource).toHaveBeenCalledWith('1', {
          name: 'Updated API',
        });
      });
    });

    it('should delete a data source', async () => {
      (dataSourcesApi.fetchDataSources as jest.Mock).mockResolvedValue(mockDataSources);
      (dataSourcesApi.deleteDataSource as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDataSources(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.deleteDataSource('1');

      await waitFor(() => {
        expect(dataSourcesApi.deleteDataSource).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Data Source State Management', () => {
    it('should maintain loading states correctly', async () => {
      (dataSourcesApi.fetchDataSources as jest.Mock).mockResolvedValue(mockDataSources);
      (dataSourcesApi.createDataSource as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockDataSources[0]), 100))
      );

      const { result } = renderHook(() => useDataSources(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      result.current.createDataSource({
        name: 'Test',
        protocol: 'http',
        connectionDetails: {},
      });

      expect(result.current.isCreating).toBe(true);

      await waitFor(() => {
        expect(result.current.isCreating).toBe(false);
      });
    });

    it('should handle concurrent operations', async () => {
      (dataSourcesApi.fetchDataSources as jest.Mock).mockResolvedValue(mockDataSources);
      (dataSourcesApi.updateDataSource as jest.Mock).mockResolvedValue(mockDataSources[0]);
      (dataSourcesApi.deleteDataSource as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDataSources(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Trigger multiple operations
      result.current.updateDataSource({ id: '1', data: { name: 'Updated' } });
      result.current.deleteDataSource('2');

      await waitFor(() => {
        expect(result.current.isUpdating).toBe(false);
        expect(result.current.isDeleting).toBe(false);
      });

      expect(dataSourcesApi.updateDataSource).toHaveBeenCalled();
      expect(dataSourcesApi.deleteDataSource).toHaveBeenCalled();
    });
  });
});