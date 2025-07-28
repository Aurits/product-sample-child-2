import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ConnectionStatusCard } from '../../components/visualizations/ConnectionStatus';
import { MetricsDashboard } from '../../components/visualizations/MetricsDashboard';
import { RecentActivityList } from '../../components/features/RecentActivityList';
import { QuickActions } from '../../components/features/QuickActions';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const { items: dataSources } = useSelector((state: RootState) => state.dataSources);
  const { connections } = useSelector((state: RootState) => state.realtime);

  const activeConnections = Object.values(connections).filter(
    conn => conn === 'connected'
  ).length;

  const totalDataSources = dataSources.length;
  const enabledDataSources = dataSources.filter(ds => ds.enabled).length;

  return (
    <Box className={styles.container}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Paper className={styles.summaryCard}>
            <Typography variant="h6" color="textSecondary">
              Total Data Sources
            </Typography>
            <Typography variant="h3">
              {totalDataSources}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper className={styles.summaryCard}>
            <Typography variant="h6" color="textSecondary">
              Active Sources
            </Typography>
            <Typography variant="h3" color="primary">
              {enabledDataSources}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper className={styles.summaryCard}>
            <Typography variant="h6" color="textSecondary">
              Live Connections
            </Typography>
            <Typography variant="h3" color="success.main">
              {activeConnections}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper className={styles.summaryCard}>
            <Typography variant="h6" color="textSecondary">
              Error Rate
            </Typography>
            <Typography variant="h3" color="error.main">
              0.2%
            </Typography>
          </Paper>
        </Grid>

        {/* Connection Status */}
        <Grid item xs={12} md={8}>
          <Paper className={styles.section}>
            <Typography variant="h6" gutterBottom>
              Connection Status
            </Typography>
            <Box className={styles.connectionGrid}>
              {dataSources.map(source => (
                <ConnectionStatusCard
                  key={source.id}
                  dataSource={source}
                  status={connections[source.id] || 'disconnected'}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper className={styles.section}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <QuickActions />
          </Paper>
        </Grid>

        {/* Metrics Dashboard */}
        <Grid item xs={12}>
          <Paper className={styles.section}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <MetricsDashboard />
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper className={styles.section}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <RecentActivityList limit={10} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

Dashboard.displayName = 'Dashboard';