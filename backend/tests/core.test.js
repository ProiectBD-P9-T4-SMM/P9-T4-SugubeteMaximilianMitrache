const { auditableUpdate, auditableInsert, auditableDelete } = require('../src/services/auditService');
const db = require('../src/db');
const { requireAuth, requireRole } = require('../src/middleware/authMiddleware');

// Mock the DB module
jest.mock('../src/db', () => ({
  transaction: jest.fn(),
  query: jest.fn()
}));

describe('Audit Service Core Logic', () => {
  let mockClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = {
      query: jest.fn()
    };
    db.transaction.mockImplementation(async (callback) => {
      return await callback(mockClient);
    });
  });

  test('auditableInsert should insert a record and log the action', async () => {
    const actorUserId = 'user-123';
    const moduleName = 'ACADEMIC';
    const tableName = 'STUDENT';
    const insertFields = { name: 'John Doe', email: 'john@example.com' };

    mockClient.query.mockResolvedValueOnce({ rows: [{ id: 'new-student-id', ...insertFields }] });

    const result = await auditableInsert(actorUserId, moduleName, tableName, insertFields);

    expect(db.transaction).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO STUDENT'),
      ['John Doe', 'john@example.com']
    );
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO AUDIT_LOG_ENTRY'),
      expect.arrayContaining([actorUserId, 'INSERT', moduleName, 'STUDENT', 'new-student-id'])
    );
    expect(result.id).toBe('new-student-id');
  });

  test('auditableUpdate should fetch before snapshot, update, and log audit', async () => {
    const actorUserId = 'user-123';
    const moduleName = 'ACADEMIC';
    const tableName = 'STUDENT';
    const id = 'student-id';
    const updateFields = { email: 'new-email@example.com' };

    const beforeSnapshot = { id, name: 'John Doe', email: 'old-email@example.com' };
    const afterSnapshot = { id, name: 'John Doe', email: 'new-email@example.com' };

    mockClient.query
      .mockResolvedValueOnce({ rows: [beforeSnapshot] }) // Before snapshot
      .mockResolvedValueOnce({ rows: [afterSnapshot] })  // Update execution
      .mockResolvedValueOnce({});                      // Log Audit

    const result = await auditableUpdate(actorUserId, moduleName, tableName, id, updateFields);

    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM STUDENT'),
      [id]
    );
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE STUDENT'),
      ['new-email@example.com', id]
    );
    expect(result.email).toBe('new-email@example.com');
  });

  test('auditableUpdate should throw 404 if entity does not exist', async () => {
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    await expect(auditableUpdate('user-id', 'MOD', 'TABLE', 'id', {}))
      .rejects.toThrow('Entity not found');
  });
});

describe('Auth Middleware Logic', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, user: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  test('requireRole should block unauthorized roles', () => {
    req.user = { role: 'STUDENT' };
    const middleware = requireRole(['ADMIN', 'SECRETARIAT']);
    
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: true }));
    expect(next).not.toHaveBeenCalled();
  });

  test('requireRole should allow authorized roles', () => {
    req.user = { role: 'ADMIN' };
    const middleware = requireRole(['ADMIN', 'SECRETARIAT']);
    
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('Auth Middleware - requireAuth', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  test('should return 401 if no auth header', () => {
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('should return 401 if invalid auth header format', () => {
    req.headers.authorization = 'InvalidToken';
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('should call next and set req.user if token is valid', () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: '123', role: 'ADMIN' }, 'cheie_secreta_afsms_2026');
    req.headers.authorization = `Bearer ${token}`;

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.userId).toBe('123');
  });

  test('should return 403 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalid-token';
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

