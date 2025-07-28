import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  TextField, 
  Select, 
  MenuItem,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Box,
  Paper
} from '@mui/material';
import { Button } from '../../common/Button';
import { DataSourceConfig, ConfigurationFormProps } from './types';
import { HTTPConfig } from '../HTTPConfig';
import { WebSocketConfig } from '../WebSocketConfig';
import { GRPCConfig } from '../GRPCConfig';
import { QueueConfig } from '../QueueConfig';
import { testDataSourceConnection } from '../../../services/api/dataSources';
import styles from './ConfigurationForm.module.css';

const validationSchema = yup.object({
  name: yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  protocol: yup.string()
    .required('Protocol is required')
    .oneOf(['http', 'websocket', 'grpc', 'queue']),
  connectionDetails: yup.object()
});

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  disabled = false,
  showTestButton = true
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const { register, handleSubmit, watch, control, formState: { errors }, getValues } = useForm<DataSourceConfig>({
    defaultValues: initialValues || {
      name: '',
      protocol: 'http',
      connectionDetails: {}
    },
    resolver: yupResolver(validationSchema)
  });
  
  const protocol = watch('protocol');
  
  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const values = getValues();
      const response = await testDataSourceConnection(values);
      setTestResult({
        success: response.success,
        message: response.message
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection test failed: ' + (error as Error).message
      });
    } finally {
      setTesting(false);
    }
  };
  
  const renderProtocolConfig = () => {
    switch (protocol) {
      case 'http':
        return <HTTPConfig control={control} errors={errors} disabled={disabled} />;
      case 'websocket':
        return <WebSocketConfig control={control} errors={errors} disabled={disabled} />;
      case 'grpc':
        return <GRPCConfig control={control} errors={errors} disabled={disabled} />;
      case 'queue':
        return <QueueConfig control={control} errors={errors} disabled={disabled} />;
      default:
        return null;
    }
  };
  
  return (
    <Paper className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Box className={styles.section}>
          <h3>Basic Information</h3>
          
          <TextField
            {...register('name')}
            label="Data Source Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={disabled}
            fullWidth
            margin="normal"
          />
          
          <FormControl fullWidth margin="normal">
            <FormLabel>Protocol Type</FormLabel>
            <Controller
              name="protocol"
              control={control}
              render={({ field }) => (
                <Select {...field} disabled={disabled}>
                  <MenuItem value="http">HTTP/REST</MenuItem>
                  <MenuItem value="websocket">WebSocket</MenuItem>
                  <MenuItem value="grpc">gRPC</MenuItem>
                  <MenuItem value="queue">Message Queue</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Box>
        
        <Box className={styles.section}>
          <h3>Connection Details</h3>
          {renderProtocolConfig()}
        </Box>
        
        {testResult && (
          <Alert 
            severity={testResult.success ? 'success' : 'error'}
            className={styles.alert}
          >
            {testResult.message}
          </Alert>
        )}
        
        <Box className={styles.actions}>
          {showTestButton && (
            <Button 
              onClick={testConnection}
              disabled={testing || disabled}
              variant="secondary"
            >
              {testing ? (
                <>
                  <CircularProgress size={16} />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
          )}
          
          <Box className={styles.formActions}>
            {onCancel && (
              <Button onClick={onCancel} variant="ghost" disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              loading={isLoading}
              disabled={disabled}
            >
              {initialValues ? 'Update' : 'Create'} Data Source
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

ConfigurationForm.displayName = 'ConfigurationForm';