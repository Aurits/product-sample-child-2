# Data Flow Architecture

## Overview

This document describes the data flow architecture of the Product Sample Child 2 application, detailing how data moves through the system from user interactions to backend services and back to the UI.

## Architecture Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│   UI Components │────▶│  Redux Store     │────▶│   API Services  │
│                 │     │                  │     │                 │
└────────┬────────┘     └────────┬─────────┘     └────────┬────────┘
         │                       │                          │
         │                       │                          │
         ▼                       ▼                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│   User Actions  │     │    Middleware    │     │  Backend APIs   │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Data Flow Patterns

### 1. User Interaction Flow

1. **User Action**: User interacts with UI component (e.g., clicks button, submits form)
2. **Action Dispatch**: Component dispatches Redux action
3. **Middleware Processing**: Action passes through middleware chain
4. **State Update**: Reducer updates state based on action
5. **UI Re-render**: Connected components re-render with new state

```typescript
// Example: User creates a new data source
const handleSubmit = (formData: DataSourceFormData) => {
  dispatch(createDataSource(formData));
};
```

### 2. API Request Flow

1. **Action Creator**: Async thunk initiates API request
2. **Loading State**: Dispatch pending action
3. **API Call**: Service layer makes HTTP request
4. **Response Handling**: Process success/error response
5. **State Update**: Dispatch fulfilled/rejected action
6. **UI Update**: Components reflect new state

```typescript
// Example: Fetching data sources
export const fetchDataSources = createAsyncThunk(
  'dataSources/fetch',
  async () => {
    const response = await api.get('/data-sources');
    return response.data;
  }
);
```

### 3. WebSocket Data Flow

1. **Connection**: WebSocket service establishes connection
2. **Message Receipt**: Server sends real-time update
3. **Event Emission**: WebSocket service emits typed event
4. **State Update**: Listener dispatches Redux action
5. **UI Update**: Connected components update instantly

```typescript
// Example: Real-time status updates
wsService.on('message:statusUpdate', (payload) => {
  dispatch(updateDataSourceStatus(payload));
});
```

## State Management

### Redux Store Structure

```typescript
interface RootState {
  auth: AuthState;
  dataSources: DataSourcesState;
  notifications: NotificationState;
  ui: UIState;
}

interface DataSourcesState {
  entities: Record<string, DataSource>;
  ids: string[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
}
```

### Normalized State

We use normalized state structure for efficient updates:

```typescript
// Normalized structure
{
  entities: {
    '1': { id: '1', name: 'API 1', ... },
    '2': { id: '2', name: 'API 2', ... }
  },
  ids: ['1', '2']
}
```

## Middleware Chain

### 1. Authentication Middleware

Adds authentication headers to outgoing requests:

```typescript
const authMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.meta?.requiresAuth) {
    action.meta.headers = {
      ...action.meta.headers,
      Authorization: `Bearer ${store.getState().auth.token}`,
    };
  }
  return next(action);
};
```

### 2. Error Handling Middleware

Standardizes error handling across the application:

```typescript
const errorMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.error) {
    store.dispatch(showNotification({
      type: 'error',
      message: action.payload.message,
    }));
  }
  return next(action);
};
```

### 3. Analytics Middleware

Tracks user actions for analytics:

```typescript
const analyticsMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.meta?.track) {
    analytics.track(action.type, action.payload);
  }
  return next(action);
};
```

## Caching Strategy

### RTK Query Integration

For efficient data fetching and caching:

```typescript
const dataSourcesApi = createApi({
  reducerPath: 'dataSourcesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['DataSource'],
  endpoints: (builder) => ({
    getDataSources: builder.query<DataSource[], void>({
      query: () => 'data-sources',
      providesTags: ['DataSource'],
    }),
    createDataSource: builder.mutation<DataSource, Partial<DataSource>>({
      query: (body) => ({
        url: 'data-sources',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['DataSource'],
    }),
  }),
});
```

### Cache Invalidation

- **Time-based**: Cache expires after configured duration
- **Event-based**: Mutations invalidate related queries
- **Manual**: Explicit cache invalidation for specific scenarios

## Error Handling

### Error Boundaries

React error boundaries catch component errors:

```typescript
class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorReporting.log(error, errorInfo);
  }
}
```

### API Error Handling

Standardized error responses:

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

## Performance Optimizations

### 1. Memoization

Using selectors for expensive computations:

```typescript
export const selectFilteredDataSources = createSelector(
  [selectAllDataSources, selectActiveFilters],
  (dataSources, filters) => {
    // Expensive filtering logic
  }
);
```

### 2. Debouncing

Preventing excessive API calls:

```typescript
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  [handleSearch]
);
```

### 3. Virtualization

For large lists:

```typescript
<VirtualList
  items={dataSources}
  renderItem={renderDataSourceItem}
  itemHeight={80}
/>
```

## Security Considerations

### 1. Token Management

- Tokens stored in memory, not localStorage
- Automatic token refresh before expiration
- Secure token transmission over HTTPS

### 2. Input Validation

- Client-side validation for UX
- Server-side validation for security
- Sanitization of user inputs

### 3. CORS Configuration

- Whitelist allowed origins
- Validate preflight requests
- Restrict allowed methods

## Testing Data Flow

### Unit Tests

Test individual pieces:

```typescript
describe('dataSourcesSlice', () => {
  it('should handle fetchDataSources.fulfilled', () => {
    const state = reducer(initialState, 
      fetchDataSources.fulfilled(mockDataSources)
    );
    expect(state.loading).toBe(false);
    expect(state.ids).toHaveLength(mockDataSources.length);
  });
});
```

### Integration Tests

Test complete flows:

```typescript
it('should create and display new data source', async () => {
  render(<App />);
  
  fireEvent.click(screen.getByText('Add Data Source'));
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'New API' }
  });
  fireEvent.click(screen.getByText('Save'));
  
  await waitFor(() => {
    expect(screen.getByText('New API')).toBeInTheDocument();
  });
});
```

## Future Enhancements

1. **GraphQL Integration**: Replace REST with GraphQL for more efficient data fetching
2. **Offline Support**: Implement service workers for offline functionality
3. **Real-time Collaboration**: Add collaborative features with WebRTC
4. **Optimistic Updates**: Improve perceived performance with optimistic UI updates