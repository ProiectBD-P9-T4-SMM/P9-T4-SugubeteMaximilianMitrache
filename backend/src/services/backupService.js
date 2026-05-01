const fs = require('fs');
const path = require('path');
const db = require('../db');

const BACKUP_DIR = path.join(__dirname, '../../backups');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
} else {
  try {
    fs.accessSync(BACKUP_DIR, fs.constants.W_OK);
  } catch (err) {
    console.error(`[BackupService] WARNING: BACKUP_DIR is not writable: ${BACKUP_DIR}`);
  }
}

const TABLES_TO_BACKUP = [
  'role', 'permission', 'role_permission',
  'user_account', 'user_role',
  'academic_year', 'specialization', 'curriculum', 'curriculum_snapshot', 
  'discipline', 'study_formation', 'student', 'grade',
  'document', 'audit_log_entry', 'user_group'
];

const createBackup = async (actorUserId = null, backupType = 'AUTOMATIC') => {
  try {
    const snapshot = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: {}
    };

    for (const table of TABLES_TO_BACKUP) {
      const result = await db.query(`SELECT * FROM ${table.toUpperCase()}`);
      snapshot.data[table] = result.rows;
    }

    const filename = `${backupType.toLowerCase()}_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const filePath = path.join(BACKUP_DIR, filename);
    
    await fs.promises.writeFile(filePath, JSON.stringify(snapshot, null, 2));

    await db.query(`
      INSERT INTO BACKUP_JOB (backup_type, started_at, finished_at, storage_location, status)
      VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $2, 'SUCCESS')
    `, [backupType, filename]);

    return { success: true, filename };
  } catch (error) {
    console.error('[BackupService] Backup failed:', error);
    throw error;
  }
};

module.exports = {
  createBackup,
  BACKUP_DIR,
  TABLES_TO_BACKUP
};
