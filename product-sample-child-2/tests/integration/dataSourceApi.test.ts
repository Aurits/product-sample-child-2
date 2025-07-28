import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { dataSourcesApi } from '../../src/services/api/dataSources';
import { DataSource, Protocol } from '../../src/types/dataSource';

const mockDataSource: DataSource = {
  id: '1',
  name: 'Test API',
  protocol: Protocol.HTTP,
  config: {
    endpoint: 'https://api.example.com',
    headers: {
      'Authorization': 'Bearer token',
    },
  },
  status: 'connected',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const server = setupServer(
  rest.get('/api/data-sources', (req, res, ctx) => {
    return res(ctx.json([mockDataSource]));
  }),
  
  rest.post('/api/data-sources', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({
      ...mockDataSource,
      id: '2',
      name: req.body?.name || 'New Data Source',
    }));
  }),
  
  rest.put('/api/data-sources/:id', (req, res, ctx) => {
    return res(ctx.json({
      ...mockDataSource,
      id: req.params.id,
      ...req.body,
    }));
  }),
  
  rest.delete('/api/data-sources/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  
  rest.post('/api/data-sources/:id/test', (req, res, ctx) => {
    return res(ctx.json({
      success: true,
      message: 'Connection successful',
      latency: 123,
    }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('DataSources API', () => {
  describe('getDataSources', () => {
    it('should fetch all data sources', async () => {
      const result = await dataSourcesApi.getDataSources();
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockDataSource);
    });

    it('should handle server errors', async () => {
      server.use(
        rest.get('/api/data-sources', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
        })
      );

      await expect(dataSourcesApi.getDataSources()).rejects.toThrow();
    });
  });

  describe('createDataSource', () => {
    it('should create a new data source', async () => {
      const newDataSource = {
        name: 'New API',
        protocol: Protocol.HTTP,
        config: {
          endpoint: 'https://new-api.example.com',
        },
      };

      const result = await dataSourcesApi.createDataSource(newDataSource);
      
      expect(result.id).toBe('2');
      expect(result.name).toBe('New API');
    });

    it('should validate required fields', async () => {
      const invalidDataSource = {
        name: '',
        protocol: Protocol.HTTP,
        config: {},
      };

      await expect(dataSourcesApi.createDataSource(invalidDataSource))
        .rejects.toThrow('Name is required');
    });
  });

  describe('updateDataSource', () => {
    it('should update an existing data source', async () => {
      const updates = {
        name: 'Updated API',
        config: {
          endpoint: 'https://updated.example.com',
        },
      };

      const result = await dataSourcesApi.updateDataSource('1', updates);
      
      expect(result.id).toBe('1');
      expect(result.name).toBe('Updated API');
    });
  });

  describe('deleteDataSource', () => {
    it('should delete a data source', async () => {
      await expect(dataSourcesApi.deleteDataSource('1')).resolves.not.toThrow();
    });

    it('should handle not found errors', async () => {
      server.use(
        rest.delete('/api/data-sources/:id', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ error: 'Not found' }));
        })
      );

      await expect(dataSourcesApi.deleteDataSource('999')).rejects.toThrow('Not found');
    });
  });

  describe('testConnection', () => {
    it('should test data source connection', async () => {
      const result = await dataSourcesApi.testConnection('1');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Connection successful');
      expect(result.latency).toBe(123);
    });

    it('should handle connection failures', async () => {
      server.use(
        rest.post('/api/data-sources/:id/test', (req, res, ctx) => {
          return res(ctx.json({
            success: false,
            message: 'Connection timeout',
            error: 'ETIMEDOUT',
          }));
        })
      );

      const result = await dataSourcesApi.testConnection('1');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Connection timeout');
    });
  });
});