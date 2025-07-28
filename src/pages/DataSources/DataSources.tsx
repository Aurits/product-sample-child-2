import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  TextField, 
  InputAdornment,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDataSources } from '../../hooks/useDataSources';
import { DataSourceCard } from '../../components/data-sources/DataSourceCard';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import styles from './DataSources.module.css';

export const DataSources: React.FC = () => {
  const navigate = useNavigate();
  const { dataSources, isLoading, error, deleteDataSource } = useDataSources();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProtocol, setFilterProtocol] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleCreateNew = () => {
    navigate('/data-sources/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/data-sources/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this data source?')) {
      deleteDataSource(id);
    }
  };

  const filteredDataSources = dataSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProtocol = filterProtocol === 'all' || source.protocol === filterProtocol;
    
    return matchesSearch && matchesProtocol;
  });

  if (isLoading) {
    return <LoadingState message="Loading data sources..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <Box className={styles.container}>
      {/* Header */}
      <Box className={styles.header}>
        <Typography variant="h4" component="h1">
          Data Sources
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
        >
          New Data Source
        </Button>
      </Box>

      {/* Filters */}
      <Box className={styles.filters}>
        <TextField
          placeholder="Search data sources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className={styles.searchField}
        />

        <Button
          startIcon={<FilterIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          variant="outlined"
        >
          {filterProtocol === 'all' ? 'All Protocols' : filterProtocol.toUpperCase()}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => { setFilterProtocol('all'); setAnchorEl(null); }}>
            All Protocols
          </MenuItem>
          <MenuItem onClick={() => { setFilterProtocol('http'); setAnchorEl(null); }}>
            HTTP/REST
          </MenuItem>
          <MenuItem onClick={() => { setFilterProtocol('websocket'); setAnchorEl(null); }}>
            WebSocket
          </MenuItem>
          <MenuItem onClick={() => { setFilterProtocol('grpc'); setAnchorEl(null); }}>
            gRPC
          </MenuItem>
          <MenuItem onClick={() => { setFilterProtocol('queue'); setAnchorEl(null); }}>
            Message Queue
          </MenuItem>
        </Menu>
      </Box>

      {/* Data Sources Grid */}
      {filteredDataSources.length === 0 ? (
        <EmptyState
          title="No data sources found"
          description={
            searchQuery || filterProtocol !== 'all'
              ? "Try adjusting your search or filters"
              : "Create your first data source to get started"
          }
          action={
            !searchQuery && filterProtocol === 'all' && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
              >
                Create Data Source
              </Button>
            )
          }
        />
      ) : (
        <Grid container spacing={3}>
          {filteredDataSources.map(source => (
            <Grid item xs={12} md={6} lg={4} key={source.id}>
              <DataSourceCard
                dataSource={source}
                onEdit={() => handleEdit(source.id)}
                onDelete={() => handleDelete(source.id)}
                onTest={() => navigate(`/data-sources/${source.id}/test`)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

DataSources.displayName = 'DataSources';