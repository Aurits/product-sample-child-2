import * as yup from 'yup';

// Common validation schemas
export const emailSchema = yup
  .string()
  .email('Invalid email address')
  .required('Email is required');

export const passwordSchema = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number and special character'
  )
  .required('Password is required');

export const urlSchema = yup
  .string()
  .url('Must be a valid URL')
  .required('URL is required');

// Data source specific validations
export const dataSourceNameSchema = yup
  .string()
  .min(3, 'Name must be at least 3 characters')
  .max(50, 'Name must be less than 50 characters')
  .matches(
    /^[a-zA-Z0-9-_\s]+$/,
    'Name can only contain letters, numbers, spaces, hyphens and underscores'
  )
  .required('Name is required');

// Protocol specific validations
export const httpConfigSchema = yup.object({
  url: urlSchema,
  method: yup
    .string()
    .oneOf(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
    .required('HTTP method is required'),
  headers: yup.object().nullable(),
  timeout: yup
    .number()
    .min(1000, 'Timeout must be at least 1 second')
    .max(300000, 'Timeout cannot exceed 5 minutes'),
  retryCount: yup
    .number()
    .min(0, 'Retry count cannot be negative')
    .max(5, 'Maximum 5 retries allowed'),
});

export const websocketConfigSchema = yup.object({
  url: yup
    .string()
    .matches(/^wss?:\/\//, 'Must be a valid WebSocket URL (ws:// or wss://)')
    .required('WebSocket URL is required'),
  reconnectInterval: yup
    .number()
    .min(1000, 'Reconnect interval must be at least 1 second')
    .max(60000, 'Reconnect interval cannot exceed 1 minute'),
  maxReconnectAttempts: yup
    .number()
    .min(0, 'Max reconnect attempts cannot be negative')
    .max(10, 'Maximum 10 reconnect attempts allowed'),
});

export const grpcConfigSchema = yup.object({
  endpoint: yup
    .string()
    .matches(/^[a-zA-Z0-9.-]+:[0-9]+$/, 'Must be a valid gRPC endpoint (host:port)')
    .required('gRPC endpoint is required'),
  protoFile: yup.mixed().required('Proto file is required'),
  service: yup.string().required('Service name is required'),
  method: yup.string().required('Method name is required'),
});

export const queueConfigSchema = yup.object({
  brokerUrl: urlSchema,
  queueName: yup
    .string()
    .matches(/^[a-zA-Z0-9-_.]+$/, 'Invalid queue name format')
    .required('Queue name is required'),
  consumerGroup: yup.string().nullable(),
  maxMessages: yup
    .number()
    .min(1, 'Must process at least 1 message')
    .max(1000, 'Cannot process more than 1000 messages at once'),
});

// Validation helper functions
export const validateDataSourceName = (name: string): string | null => {
  try {
    dataSourceNameSchema.validateSync(name);
    return null;
  } catch (error) {
    return error instanceof yup.ValidationError ? error.message : 'Invalid name';
  }
};

export const validateUrl = (url: string): boolean => {
  try {
    urlSchema.validateSync(url);
    return true;
  } catch {
    return false;
  }
};

export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.validateSync(email);
    return true;
  } catch {
    return false;
  }
};

// Form validation utilities
export const getFieldError = (
  errors: any,
  fieldPath: string
): string | undefined => {
  return fieldPath.split('.').reduce((acc, part) => acc?.[part], errors)?.message;
};

export const hasFieldError = (errors: any, fieldPath: string): boolean => {
  return !!getFieldError(errors, fieldPath);
};

// Custom validators
export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const isValidPort = (port: number): boolean => {
  return Number.isInteger(port) && port >= 1 && port <= 65535;
};

export const isValidIpAddress = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// Sanitization functions
export const sanitizeUrl = (url: string): string => {
  return url.trim().replace(/\/+$/, ''); // Remove trailing slashes
};

export const sanitizeDataSourceName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' '); // Replace multiple spaces with single space
};