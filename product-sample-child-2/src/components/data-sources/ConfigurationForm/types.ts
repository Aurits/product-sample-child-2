export interface DataSourceConfig {
  name: string;
  protocol: 'http' | 'websocket' | 'grpc' | 'queue';
  connectionDetails: Record<string, any>;
  description?: string;
  tags?: string[];
  enabled?: boolean;
}

export interface ConfigurationFormProps {
  /**
   * Initial form values for editing
   */
  initialValues?: DataSourceConfig;
  
  /**
   * Form submission handler
   */
  onSubmit: (values: DataSourceConfig) => void | Promise<void>;
  
  /**
   * Cancel/close handler
   */
  onCancel?: () => void;
  
  /**
   * Loading state during submission
   */
  isLoading?: boolean;
  
  /**
   * Disable form inputs
   */
  disabled?: boolean;
  
  /**
   * Show connection test button
   * @default true
   */
  showTestButton?: boolean;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    responseTime?: number;
    statusCode?: number;
    error?: string;
  };
}