import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { fetchDataSources, deleteDataSource } from '../../../store/slices/dataSourcesSlice';
import { DataSource, ConnectionStatus } from '../../../types/dataSource';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { formatDate } from '../../../utils/formatters';

interface DataSourceListProps {
  onEdit: (dataSource: DataSource) => void;
  onTest: (dataSource: DataSource) => void;
}

export const DataSourceList: React.FC<DataSourceListProps> = ({ onEdit, onTest }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { dataSources, loading, error } = useSelector((state: RootState) => state.dataSources);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDataSources());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      await dispatch(deleteDataSource(id));
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getStatusColor = (status: ConnectionStatus): string => {
    switch (status) {
      case 'connected':
        return 'green';
      case 'disconnected':
        return 'red';
      case 'connecting':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return <div className="loading">Loading data sources...</div>;
  }

  if (error) {
    return <div className="error">Error loading data sources: {error}</div>;
  }

  if (dataSources.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Data Sources</h3>
        <p>Get started by adding your first data source.</p>
      </div>
    );
  }

  return (
    <div className="data-source-list">
      {dataSources.map((dataSource) => (
        <Card key={dataSource.id} className="data-source-card">
          <div className="card-header">
            <h3>{dataSource.name}</h3>
            <Badge color={getStatusColor(dataSource.status)}>
              {dataSource.status}
            </Badge>
          </div>
          
          <div className="card-body">
            <p className="protocol">Protocol: {dataSource.protocol}</p>
            <p className="endpoint">Endpoint: {dataSource.config.endpoint || 'N/A'}</p>
            <p className="last-tested">
              Last tested: {dataSource.lastTested ? formatDate(dataSource.lastTested) : 'Never'}
            </p>
          </div>
          
          <div className="card-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={() => onTest(dataSource)}
              disabled={dataSource.status === 'connecting'}
            >
              Test Connection
            </Button>
            
            <Button
              variant="primary"
              size="small"
              onClick={() => onEdit(dataSource)}
            >
              Edit
            </Button>
            
            <Button
              variant="danger"
              size="small"
              onClick={() => handleDelete(dataSource.id)}
            >
              {deleteConfirm === dataSource.id ? 'Confirm Delete' : 'Delete'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};