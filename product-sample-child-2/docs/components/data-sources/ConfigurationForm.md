# ConfigurationForm Component

## Overview

The `ConfigurationForm` component is the primary interface for configuring data source connections. It provides a dynamic form that adapts based on the selected protocol type.

## Import

```typescript
import { ConfigurationForm } from '@/components/data-sources/ConfigurationForm';
```

## Props

```typescript
interface ConfigurationFormProps {
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
```

## Usage

### Basic Usage

```tsx
<ConfigurationForm
  onSubmit={async (values) => {
    await createDataSource(values);
  }}
  onCancel={() => navigate('/data-sources')}
/>
```

### Edit Mode

```tsx
<ConfigurationForm
  initialValues={existingDataSource}
  onSubmit={async (values) => {
    await updateDataSource(id, values);
  }}
  isLoading={isUpdating}
/>
```

## Features

### Dynamic Protocol Fields

The form dynamically shows different fields based on the selected protocol:

#### HTTP/REST
- URL endpoint
- HTTP method (GET, POST, PUT, DELETE)
- Headers configuration
- Authentication options

#### WebSocket
- WebSocket URL
- Connection parameters
- Reconnection settings
- Event subscriptions

#### gRPC
- Service endpoint
- Proto file upload
- Method selection
- Metadata configuration

#### Message Queue
- Broker URL
- Queue/Topic name
- Consumer group
- Acknowledgment settings

### Validation

Built-in validation for all fields:

```typescript
const validationSchema = yup.object({
  name: yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  
  protocol: yup.string()
    .required('Protocol is required')
    .oneOf(['http', 'websocket', 'grpc', 'queue']),
  
  connectionDetails: yup.object().when('protocol', {
    is: 'http',
    then: yup.object({
      url: yup.string().url('Must be a valid URL').required('URL is required'),
      method: yup.string().oneOf(['GET', 'POST', 'PUT', 'DELETE']).required(),
      headers: yup.object()
    })
  })
});
```

### Connection Testing

Integrated connection testing functionality:

```tsx
const testConnection = async () => {
  const result = await api.testConnection(formValues);
  if (result.success) {
    showNotification('Connection successful!', 'success');
  } else {
    showNotification(`Connection failed: ${result.error}`, 'error');
  }
};
```

## Component Structure

```tsx
<form onSubmit={handleSubmit}>
  <FormSection title="Basic Information">
    <TextField name="name" label="Data Source Name" />
    <Select name="protocol" label="Protocol Type" />
  </FormSection>
  
  <FormSection title="Connection Details">
    {renderProtocolFields()}
  </FormSection>
  
  <FormSection title="Advanced Options">
    <Checkbox name="enableRetry" label="Enable automatic retry" />
    <NumberField name="timeout" label="Connection timeout (ms)" />
  </FormSection>
  
  <FormActions>
    <Button onClick={testConnection}>Test Connection</Button>
    <Button type="submit" variant="primary">Save</Button>
    <Button onClick={onCancel} variant="text">Cancel</Button>
  </FormActions>
</form>
```

## State Management

The component uses React Hook Form for form state management:

```tsx
const {
  register,
  handleSubmit,
  watch,
  control,
  formState: { errors, isValid }
} = useForm<DataSourceConfig>({
  defaultValues: initialValues,
  resolver: yupResolver(validationSchema),
  mode: 'onChange'
});
```

## Error Handling

Comprehensive error handling for:
- Validation errors
- Network errors
- Connection test failures
- Submission errors

```tsx
const handleError = (error: Error) => {
  if (error.response?.status === 400) {
    setFieldError('name', 'This name is already taken');
  } else {
    showNotification('An error occurred. Please try again.', 'error');
  }
};
```

## Accessibility

- Proper form labels and ARIA attributes
- Keyboard navigation support
- Error announcements for screen readers
- Focus management

## Performance Considerations

- Debounced validation for text inputs
- Memoized protocol field renderers
- Lazy loading of protocol-specific components
- Optimized re-renders with React.memo

## Testing

```tsx
describe('ConfigurationForm', () => {
  it('should submit valid form data', async () => {
    const onSubmit = jest.fn();
    const { getByLabelText, getByText } = render(
      <ConfigurationForm onSubmit={onSubmit} />
    );
    
    fireEvent.change(getByLabelText('Data Source Name'), {
      target: { value: 'Test Source' }
    });
    
    fireEvent.click(getByText('Save'));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Test Source',
        // ... other values
      });
    });
  });
});
```

## Related Components

- [ProtocolSelector](./ProtocolSelector.md) - Protocol selection dropdown
- [ConnectionTester](./ConnectionTester.md) - Connection testing UI
- [HTTPConfig](./HTTPConfig.md) - HTTP-specific configuration
- [WebSocketConfig](./WebSocketConfig.md) - WebSocket configuration