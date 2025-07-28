import { apiClient } from './client';
import { DataSourceConfig } from '../../components/data-sources/ConfigurationForm/types';

export interface DataSource extends DataSourceConfig {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastConnectedAt?: string;
  status?: 'active' | 'inactive' | 'error';
}

export interface TestConnectionRequest {
  protocol: string;
  connectionDetails: Record<string, any>;
}

export interface TestConnectionResponse {
  success: boolean;
  message: string;
  details?: {
    responseTime: number;
    statusCode?: number;
    error?: string;
  };
}

// Data source CRUD operations
export const fetchDataSources = async (): Promise<DataSource[]> => {
  return apiClient.get<DataSource[]>('/data-sources');
};

export const fetchDataSourceById = async (id: string): Promise<DataSource> => {
  return apiClient.get<DataSource>(`/data-sources/${id}`);
};

export const createDataSource = async (data: DataSourceConfig): Promise<DataSource> => {
  return apiClient.post<DataSource>('/data-sources', data);
};

export const updateDataSource = async (
  id: string, 
  data: Partial<DataSourceConfig>
): Promise<DataSource> => {
  return apiClient.patch<DataSource>(`/data-sources/${id}`, data);
};

export const deleteDataSource = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/data-sources/${id}`);
};

// Connection testing
export const testDataSourceConnection = async (
  config: TestConnectionRequest
): Promise<TestConnectionResponse> => {
  return apiClient.post<TestConnectionResponse>('/data-sources/test-connection', config);
};

// Data source actions
export const enableDataSource = async (id: string): Promise<DataSource> => {
  return apiClient.post<DataSource>(`/data-sources/${id}/enable`);
};

export const disableDataSource = async (id: string): Promise<DataSource> => {
  return apiClient.post<DataSource>(`/data-sources/${id}/disable`);
};

// Data source metrics
export interface DataSourceMetrics {
  dataSourceId: string;
  messagesReceived: number;
  messagesProcessed: number;
  errorCount: number;
  averageResponseTime: number;
  uptime: number;
  lastError?: {
    message: string;
    timestamp: string;
  };
}

export const fetchDataSourceMetrics = async (id: string): Promise<DataSourceMetrics> => {
  return apiClient.get<DataSourceMetrics>(`/data-sources/${id}/metrics`);
};

// Bulk operations
export interface BulkImportRequest {
  dataSources: DataSourceConfig[];
}

export interface BulkImportResponse {
  imported: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}

export const bulkImportDataSources = async (
  data: BulkImportRequest
): Promise<BulkImportResponse> => {
  return apiClient.post<BulkImportResponse>('/data-sources/bulk-import', data);
};

export const exportDataSources = async (): Promise<DataSourceConfig[]> => {
  return apiClient.get<DataSourceConfig[]>('/data-sources/export');
};