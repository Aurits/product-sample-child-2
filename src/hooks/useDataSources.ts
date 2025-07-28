import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDataSources, 
  createDataSource, 
  updateDataSource, 
  deleteDataSource 
} from '../services/api/dataSources';
import { DataSourceConfig } from '../components/data-sources/ConfigurationForm/types';
import { RootState } from '../store';
import { setDataSources, setLoading, setError } from '../store/slices/dataSourcesSlice';

export const useDataSources = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { items, loading, error } = useSelector((state: RootState) => state.dataSources);

  // Fetch all data sources
  const { data, isLoading, error: queryError } = useQuery(
    'dataSources',
    fetchDataSources,
    {
      onSuccess: (data) => {
        dispatch(setDataSources(data));
      },
      onError: (error) => {
        dispatch(setError(error.message));
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Create data source mutation
  const createMutation = useMutation(createDataSource, {
    onSuccess: () => {
      queryClient.invalidateQueries('dataSources');
    },
  });

  // Update data source mutation
  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<DataSourceConfig> }) => 
      updateDataSource(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dataSources');
      },
    }
  );

  // Delete data source mutation
  const deleteMutation = useMutation(deleteDataSource, {
    onSuccess: () => {
      queryClient.invalidateQueries('dataSources');
    },
  });

  return {
    dataSources: items,
    isLoading: isLoading || loading,
    error: queryError || error,
    createDataSource: createMutation.mutate,
    updateDataSource: updateMutation.mutate,
    deleteDataSource: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
};