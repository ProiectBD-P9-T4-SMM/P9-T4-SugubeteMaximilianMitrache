const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { auditableUpdate, auditableInsert } = require('../services/auditService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.xls', '.xlsx', '.csv', '.xml', '.txt', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.ppt', '.pptx', '.zip', '.rar', '.mp4', '.mov'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      const err = new Error('Invalid file type. Allowed extensions: ' + allowedExtensions.join(', '));
      err.status = 400;
      cb(err, false);
    }
  }
});
router.use(requireAuth);

// GET /api/documents - Advanced Search
router.get('/', async (req, res, next) => {
  try {
    const { type, author_id, startDate, endDate, contentKeyword } = req.query;

    let query = `
      SELECT d.id, d.title, d.type, d.content, d.status, d.created_at,
             d.file_path, d.original_filename, d.assigned_to_user_id,
             u.full_name as author_name,
             u2.full_name as assigned_to_user_name
      FROM DOCUMENT d
      LEFT JOIN USER_ACCOUNT u ON d.author_id = u.id
      LEFT JOIN USER_ACCOUNT u2 ON d.assigned_to_user_id = u2.id
      WHERE 1=1
    `;
    const params = [];

    if (type) {
      params.push(type);
      query += ` AND d.type = $${params.length}`;
    }
    if (author_id) {
      params.push(author_id);
      query += ` AND d.author_id = $${params.length}`;
    }
    if (startDate) {
      params.push(startDate);
      query += ` AND d.created_at >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      // add 1 day to endDate to include the entire day
      query += ` AND d.created_at < $${params.length}::date + interval '1 day'`;
    }
    if (contentKeyword) {
      params.push(`%${contentKeyword}%`);
      query += ` AND (d.title ILIKE $${params.length} OR d.content ILIKE $${params.length})`;
    }
    if (req.query.authorKeyword) {
      params.push(`%${req.query.authorKeyword}%`);
      query += ` AND u.full_name ILIKE $${params.length}`;
    }

    query += ` ORDER BY d.created_at DESC`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// PUT /api/documents/:id/status - Update Status (Workflow)
router.put('/:id/status', requireRole(['SECRETARIAT', 'ADMIN', 'PROFESSOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. APPROVED, REJECTED

    // Audit the document status update
    const updatedDocument = await auditableUpdate(
      req.user.userId,
      'DOCUMENT_FLOW',
      'DOCUMENT',
      id,
      { status }
    );

    res.json(updatedDocument);
  } catch (error) {
    next(error);
  }
});

// PUT /api/documents/:id/forward - Forward Document (Workflow)
router.put('/:id/forward', requireRole(['SECRETARIAT', 'ADMIN', 'PROFESSOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; 

    const updatedDocument = await auditableUpdate(
      req.user.userId,
      'DOCUMENT_FLOW',
      'DOCUMENT',
      id,
      { assigned_to_user_id: userId || null }
    );

    res.json(updatedDocument);
  } catch (error) {
    next(error);
  }
});

// POST /api/documents - Upload a new document
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const { title, type } = req.body;
    const file = req.file;

    if (!title || !type) {
      return res.status(400).json({ error: true, message: 'Missing title or type' });
    }

    let filePath = null;
    let originalFilename = null;

    if (file) {
      filePath = file.filename;
      originalFilename = file.originalname;
    }

    const insertFields = {
      title,
      type,
      status: 'DRAFT',
      author_id: req.user.userId,
      created_at: new Date().toISOString()
    };

    if (filePath) {
      insertFields.file_path = filePath;
      insertFields.original_filename = originalFilename;
      insertFields.content = title; // fallback for full text search
    }

    const newDoc = await auditableInsert(
      req.user.userId,
      'DOCUMENT_FLOW',
      'DOCUMENT',
      insertFields
    );

    res.status(201).json(newDoc);
  } catch (error) {
    next(error);
  }
});

// GET /api/documents/download/:id - Download document
router.get('/download/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT file_path, original_filename FROM DOCUMENT WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Document not found' });
    }
    
    const doc = result.rows[0];
    if (!doc.file_path) {
      return res.status(404).json({ error: true, message: 'No file attached to this document' });
    }
    
    const fullPath = path.join(__dirname, '../../../uploads', doc.file_path);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: true, message: 'File not found on server' });
    }
    
    res.download(fullPath, doc.original_filename);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/documents/:id - Delete document
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Optional: Get file path to delete the physical file as well
    const fileResult = await db.query('SELECT file_path FROM DOCUMENT WHERE id = $1', [id]);
    
    const result = await db.query('DELETE FROM DOCUMENT WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Document not found' });
    }

    if (fileResult.rows.length > 0 && fileResult.rows[0].file_path) {
      const fullPath = path.join(__dirname, '../../../uploads', fileResult.rows[0].file_path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    res.json({ message: 'Document deleted successfully', id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
