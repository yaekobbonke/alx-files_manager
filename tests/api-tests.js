const request = require('supertest');
const app = require('../app');
const redisClient = require('../utils/redisClient');
const dbClient = require('../utils/dbClient');

// Test redisClient
describe('redisClient', () => {
  it('should set and get a value', async () => {
    const key = 'testKey';
    const value = 'testValue';
    
    await redisClient.set(key, value);
    const result = await redisClient.get(key);
    
    expect(result).toEqual(value);
  });
});

// Test dbClient
describe('dbClient', () => {
  it('should connect to the database', async () => {
    const isConnected = await dbClient.connect();
    
    expect(isConnected).toBeTruthy();
  });
  
  it('should disconnect from the database', async () => {
    const isDisconnected = await dbClient.disconnect();
    
    expect(isDisconnected).toBeTruthy();
  });
});

// Test endpoints
describe('Endpoints', () => {
  // Test GET /status
  describe('GET /status', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/status');
      
      expect(response.statusCode).toBe(200);
    });
  });

  // Test GET /stats
  describe('GET /stats', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/stats');
      
      expect(response.statusCode).toBe(200);
    });
  });
  
  // Test POST /users
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123',
        });
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  // Test GET /connect
  describe('GET /connect', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/connect');
      
      expect(response.statusCode).toBe(200);
    });
  });
  
  // Test GET /disconnect
  describe('GET /disconnect', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/disconnect');
      
      expect(response.statusCode).toBe(200);
    });
  });
  
  // Test GET /users/me
  describe('GET /users/me', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/users/me');
      
      expect(response.statusCode).toBe(200);
    });
  });

  // Test POST /files
  describe('POST /files', () => {
    it('should upload a new file', async () => {
      const response = await request(app)
        .post('/files')
        .send({
          name: 'test.jpg',
          type: 'image/jpeg',
          data: 'base64encodeddata',
          userId: '123456',
        });
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  // Test GET /files/:id
  describe('GET /files/:id', () => {
    it('should return the file with the specified ID', async () => {
      const fileId = '123456';
      
      const response = await request(app).get(`/files/${fileId}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', fileId);
    });
  });

  // Test GET /files (pagination)
  describe('GET /files', () => {
    it('should return a paginated list of files', async () => {
      const page = 1;
      const limit = 10;
      
      const response = await request(app).get(`/files?page=${page}&limit=${limit}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('page', page);
      expect(response.body).toHaveProperty('limit', limit);
      expect(response.body).toHaveProperty('files');
      expect(response.body.files).toHaveLength(limit);
    });
  });

  // Test PUT /files/:id/publish
  describe('PUT /files/:id/publish', () => {
    it('should publish the file with the specified ID', async () => {
      const fileId = '123456';
      
      const response = await request(app).put(`/files/${fileId}/publish`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message','File published successfully');
    });
  });

  // Test PUT /files/:id/unpublish
  describe('PUT /files/:id/unpublish', () => {
    it('should unpublish the file with the specified ID', async () => {
      const fileId = '123456';
      
      const response = await request(app).put(`/files/${fileId}/unpublish`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'File unpublished successfully');
    });
  });

  // Test GET /files/:id/data
  describe('GET /files/:id/data', () => {
    it('should return the data of the file with the specified ID', async () => {
      const fileId = '123456';
      
      const response = await request(app).get(`/files/${fileId}/data`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });
});
