const cron = require('node-cron');
const db = require('../db');
const { createBackup } = require('./backupService');

const { archiveOldLogs } = require('./auditService');

let currentJob = null;

const initScheduler = async () => {
  try {
    const res = await db.query('SELECT * FROM BACKUP_CONFIG LIMIT 1');
    if (res.rows.length > 0) {
      const config = res.rows[0];
      if (config.enabled) {
        startJob(config.cron_expression);
        console.log(`[Scheduler] Automatic backups enabled with schedule: ${config.cron_expression}`);
      } else {
        console.log('[Scheduler] Automatic backups are disabled.');
      }
    }

    // Schedule Audit Log Archiving (Daily at 1 AM)
    cron.schedule('0 1 * * *', async () => {
      console.log('[Scheduler] Running automated audit log archiving (5-year retention)...');
      try {
        const archivedCount = await archiveOldLogs();
        if (archivedCount > 0) {
          console.log(`[Scheduler] Successfully archived ${archivedCount} old audit entries.`);
        }
      } catch (err) {
        console.error('[Scheduler] Audit archiving failed:', err);
      }
    });
    console.log('[Scheduler] Audit log archiving job scheduled (Daily at 01:00).');

  } catch (error) {
    console.error('[Scheduler] Initialization failed:', error);
  }
};

const startJob = (cronExpression) => {
  if (currentJob) {
    currentJob.stop();
  }
  
  currentJob = cron.schedule(cronExpression, async () => {
    console.log(`[Scheduler] Running automatic backup at ${new Date().toISOString()}`);
    try {
      await createBackup(null, 'AUTOMATIC');
      console.log('[Scheduler] Automatic backup completed successfully.');
    } catch (err) {
      console.error('[Scheduler] Automatic backup failed:', err);
    }
  });
};

const updateSchedule = async (cronExpression, enabled) => {
  try {
    await db.query(
      'UPDATE BACKUP_CONFIG SET cron_expression = $1, enabled = $2, updated_at = CURRENT_TIMESTAMP',
      [cronExpression, enabled]
    );
    
    if (enabled) {
      startJob(cronExpression);
    } else if (currentJob) {
      currentJob.stop();
      currentJob = null;
    }
    
    return { success: true };
  } catch (error) {
    console.error('[Scheduler] Update failed:', error);
    throw error;
  }
};

module.exports = {
  initScheduler,
  updateSchedule
};
