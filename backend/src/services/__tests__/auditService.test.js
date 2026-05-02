const db = require('../../db');
const { logAudit, auditableUpdate, auditableInsert, auditableDelete } = require('../auditService');

// Mock the DB module
jest.mock('../../db', () => {
  const mClient = {
    query: jest.fn()
  };
  return {
    transaction: jest.fn(async (cb) => {
      return await cb(mClient);
    }),
    query: jest.fn(),
    mClient
  };
});

describe('auditService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logAudit', () => {
    it('should correctly insert an audit log entry', async () => {
      db.mClient.query.mockResolvedValueOnce({});
      
      const beforeSnapshot = { id: 1, status: 'DRAFT' };
      const afterSnapshot = { id: 1, status: 'APPROVED' };
      
      await logAudit(
        db.mClient,
        'user-123',
        'UPDATE',
        'TEST_MODULE',
        'DOCUMENT',
        'doc-1',
        beforeSnapshot,
        afterSnapshot
      );

      expect(db.mClient.query).toHaveBeenCalledTimes(1);
      const callArgs = db.mClient.query.mock.calls[0];
      expect(callArgs[0]).toContain('INSERT INTO AUDIT_LOG_ENTRY');
      expect(callArgs[1]).toEqual([
        'user-123',
        'UPDATE',
        'TEST_MODULE',
        'DOCUMENT',
        'doc-1',
        JSON.stringify(beforeSnapshot),
        JSON.stringify(afterSnapshot)
      ]);
    });
  });

  describe('auditableInsert', () => {
    it('should perform an insert and log it', async () => {
      // Mock the insert returning the new record
      db.mClient.query
        .mockResolvedValueOnce({ rows: [{ id: 99, name: 'New Entry' }] }) // insertQuery
        .mockResolvedValueOnce({}); // logAudit query

      const result = await auditableInsert('user-123', 'MODULE', 'TEST_TABLE', { name: 'New Entry' });

      expect(result).toEqual({ id: 99, name: 'New Entry' });
      expect(db.mClient.query).toHaveBeenCalledTimes(2); // one for insert, one for log
      
      // Check if INSERT query was formed correctly
      const insertCall = db.mClient.query.mock.calls[0];
      expect(insertCall[0]).toContain('INSERT INTO TEST_TABLE (name)');
      expect(insertCall[1]).toEqual(['New Entry']);
    });
  });

  describe('auditableUpdate', () => {
    it('should perform an update and log both before and after states', async () => {
      db.mClient.query
        .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Old' }] }) // beforeResult
        .mockResolvedValueOnce({ rows: [{ id: 1, name: 'New' }] }) // afterResult
        .mockResolvedValueOnce({}); // logAudit

      const result = await auditableUpdate('user-1', 'MOD', 'TEST_TABLE', 1, { name: 'New' });

      expect(result).toEqual({ id: 1, name: 'New' });
      expect(db.mClient.query).toHaveBeenCalledTimes(3);

      const updateCall = db.mClient.query.mock.calls[1];
      expect(updateCall[0]).toContain('UPDATE TEST_TABLE');
      expect(updateCall[1]).toEqual(['New', 1]);
    });

    it('should throw NOT_FOUND error if entity does not exist', async () => {
      db.mClient.query.mockResolvedValueOnce({ rows: [] }); // beforeResult empty

      await expect(auditableUpdate('user-1', 'MOD', 'TEST_TABLE', 99, { name: 'New' }))
        .rejects.toThrow('Entity not found');
      
      expect(db.mClient.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('auditableDelete', () => {
    it('should perform a delete and log the before state', async () => {
      db.mClient.query
        .mockResolvedValueOnce({ rows: [{ id: 1, name: 'To Delete' }] }) // beforeResult
        .mockResolvedValueOnce({}) // delete query
        .mockResolvedValueOnce({}); // logAudit

      const result = await auditableDelete('user-1', 'MOD', 'TEST_TABLE', 1);

      expect(result).toEqual({ success: true });
      expect(db.mClient.query).toHaveBeenCalledTimes(3);

      const deleteCall = db.mClient.query.mock.calls[1];
      expect(deleteCall[0]).toContain('DELETE FROM TEST_TABLE');
      expect(deleteCall[1]).toEqual([1]);
    });

    it('should throw error if entity to delete does not exist', async () => {
      db.mClient.query.mockResolvedValueOnce({ rows: [] }); // beforeResult empty

      await expect(auditableDelete('user-1', 'MOD', 'TEST_TABLE', 99))
        .rejects.toThrow('Entity not found');
    });
  });
});
