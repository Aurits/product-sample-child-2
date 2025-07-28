import { format, formatDistance, formatRelative, parseISO } from 'date-fns';

// Date formatters
export const formatDate = (date: string | Date, formatString = 'PPP'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'PPP p');
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

export const formatShortDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
};

// Number formatters
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// String formatters
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const titleCase = (str: string): string => {
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

export const camelToTitle = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

export const kebabToTitle = (str: string): string => {
  return str
    .split('-')
    .map(word => capitalize(word))
    .join(' ');
};

// Protocol formatters
export const formatProtocol = (protocol: string): string => {
  const protocolMap: Record<string, string> = {
    http: 'HTTP/REST',
    websocket: 'WebSocket',
    grpc: 'gRPC',
    queue: 'Message Queue',
  };
  return protocolMap[protocol] || protocol.toUpperCase();
};

// Status formatters
export const formatStatus = (status: string): { label: string; color: string } => {
  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: 'Active', color: 'success' },
    inactive: { label: 'Inactive', color: 'default' },
    error: { label: 'Error', color: 'error' },
    pending: { label: 'Pending', color: 'warning' },
    connected: { label: 'Connected', color: 'success' },
    disconnected: { label: 'Disconnected', color: 'default' },
  };
  return statusMap[status] || { label: capitalize(status), color: 'default' };
};

// Duration formatters
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

export const formatUptime = (startTime: string | Date): string => {
  const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
  const duration = Date.now() - start.getTime();
  return formatDuration(duration);
};

// JSON formatters
export const formatJson = (obj: any, indent = 2): string => {
  try {
    return JSON.stringify(obj, null, indent);
  } catch {
    return String(obj);
  }
};

export const parseJson = (str: string): any => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

// Error formatters
export const formatError = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unknown error occurred';
};

// List formatters
export const formatList = (items: string[], maxItems = 3): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length <= maxItems) {
    return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
  }
  return (
    items.slice(0, maxItems).join(', ') +
    ` and ${items.length - maxItems} more`
  );
};