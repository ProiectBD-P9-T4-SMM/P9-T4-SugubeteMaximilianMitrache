import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { auditService, adminService } from '../services/api';

export default function AuditLogs() {
  const [adminTab, setAdminTab] = useState('audit');
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rollbackStatus, setRollbackStatus] = useState(null);

  // Users and Roles state
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [queries, setQueries] = useState([]);
  const [backups, setBackups] = useState([]);

  useEffect(() => {
    if (adminTab === 'audit') fetchAuditLogs();
    if (adminTab === 'users') {
      fetchUsers();
      fetchRoles();
    }
    if (adminTab === 'queries') fetchQueries();
    if (adminTab === 'backups') fetchBackups();
  }, [adminTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await adminService.getRoles();
      setRoles(res.data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await adminService.getActiveQueries();
      setQueries(res.data);
    } catch (err) {
      console.error("Failed to fetch queries", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const res = await adminService.getBackups();
      setBackups(res.data);
    } catch (err) {
      console.error("Failed to fetch backups", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, roleId) => {
    try {
      await adminService.updateUserRole(userId, roleId);
      fetchUsers(); // Refresh to reflect change
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await auditService.getLogs();
      setAuditLogs(res.data);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (log) => {
    const isInsert = log.action_type === 'INSERT';
    const msg = isInsert 
      ? `Are you sure you want to UNDO this creation? This will DELETE record ${log.entity_id} from ${log.entity_type}.`
      : `Are you sure you want to rollback this ${log.entity_type} UPDATE?`;

    if (!window.confirm(msg)) return;
    
    try {
      const res = await auditService.rollback(log.id);
      setRollbackStatus({ success: true, message: res.data.message });
      fetchAuditLogs(); // refresh
      setTimeout(() => setRollbackStatus(null), 3000);
    } catch (err) {
      setRollbackStatus({ success: false, message: err.response?.data?.message || 'Rollback failed' });
      setTimeout(() => setRollbackStatus(null), 3000);
    }
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      await adminService.createBackup();
      fetchBackups();
      setRollbackStatus({ success: true, message: 'Database snapshot created successfully!' });
    } catch (err) {
      setRollbackStatus({ success: false, message: 'Failed to create snapshot' });
    } finally {
      setLoading(false);
      setTimeout(() => setRollbackStatus(null), 3000);
    }
  };

  const handleRestoreBackup = async (filename) => {
    if (!window.confirm(`⚠️ CAUTION: This will overwrite ALL current data with the contents of ${filename}. Proceed?`)) return;
    
    setLoading(true);
    try {
      await adminService.restoreBackup(filename);
      setRollbackStatus({ success: true, message: 'Database RESTORED successfully!' });
      fetchAuditLogs();
    } catch (err) {
      setRollbackStatus({ success: false, message: 'Restoration failed: ' + (err.response?.data?.message || err.message) });
    } finally {
      setLoading(false);
      setTimeout(() => setRollbackStatus(null), 5000);
    }
  };

  const handleDownloadBackup = (filename) => {
    window.open(`http://localhost:3000/api/admin/backups/download/${filename}`, '_blank');
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Administration & Audit</h2>

      {rollbackStatus && (
        <div className={`p-4 rounded-md mb-4 flex items-center justify-between ${rollbackStatus.success ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          <div className="flex items-center space-x-2">
            <span className="font-bold">{rollbackStatus.success ? '✓' : '⚠'}</span>
            <span>{rollbackStatus.message}</span>
          </div>
        </div>
      )}

      {/* Inner Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        {[
          { id: 'audit', label: 'Audit Log & Rollback' },
          { id: 'users', label: 'Users & Roles' },
          { id: 'queries', label: 'Query Monitor (DBA)' },
          { id: 'backups', label: 'Backups & Recovery (PITR)' },
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setAdminTab(t.id)}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${adminTab === t.id ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>{['Timestamp', 'User', 'Action', 'Entity', 'Before', 'After', 'Rollback'].map(h => <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading && auditLogs.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
              ) : auditLogs.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{new Date(row.occurred_at).toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-xs">{row.actor_name || 'System'}</td>
                  <td className="px-6 py-4 font-medium">{row.action_type}</td>
                  <td className="px-6 py-4">{row.entity_type}</td>
                  <td className="px-6 py-4 text-red-500 text-xs align-top">
                    {row.before_snapshot_json ? (
                      <pre className="whitespace-pre-wrap overflow-x-auto p-2 bg-slate-50 rounded border border-red-100 max-w-xs max-h-32">
                        {JSON.stringify(row.before_snapshot_json, null, 2)}
                      </pre>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-green-600 text-xs align-top">
                    {row.after_snapshot_json ? (
                      <pre className="whitespace-pre-wrap overflow-x-auto p-2 bg-slate-50 rounded border border-green-100 max-w-xs max-h-32">
                        {JSON.stringify(row.after_snapshot_json, null, 2)}
                      </pre>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {(row.action_type === 'UPDATE' || row.action_type === 'INSERT') && (
                      <button 
                        onClick={() => handleRollback(row)}
                        className={`hover:text-white border px-2 py-1 rounded text-xs transition ${
                          row.action_type === 'INSERT' 
                            ? 'text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-600' 
                            : 'text-red-600 border-red-200 bg-red-50 hover:bg-red-600'
                        }`}
                        title={row.action_type === 'INSERT' ? 'Undo creation (Delete)' : 'Restore previous values'}
                      >
                        {row.action_type === 'INSERT' ? 'Undo Insert' : 'Rollback'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {adminTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>{['Name', 'Email', 'SSO Subject', 'Status', 'Role'].map(h => <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading && users.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-slate-500">Loading users...</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{user.full_name}</td>
                  <td className="px-6 py-4 text-slate-500">{user.email}</td>
                  <td className="px-6 py-4 font-mono text-xs">{user.sso_subject}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.account_status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.account_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="border border-slate-300 rounded p-1 text-sm bg-white focus:ring-blue-500"
                      value={user.role_id || ''}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="" disabled>-- Select Role --</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {adminTab === 'queries' && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-800">Active PostgreSQL Queries</h3>
            <button onClick={fetchQueries} className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium flex items-center space-x-1">
              <Activity className="h-3 w-3" />
              <span>Refresh Monitor</span>
            </button>
          </div>
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>{['PID', 'User', 'State', 'Last Change', 'Query'].map(h => <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading && queries.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4 text-slate-500">Loading queries...</td></tr>
                ) : queries.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4 text-slate-500">No active queries.</td></tr>
                ) : queries.map((q) => (
                  <tr key={q.pid} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs">{q.pid}</td>
                    <td className="px-6 py-4">{q.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${q.state === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {q.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{new Date(q.state_change).toLocaleTimeString()}</td>
                    <td className="px-6 py-4 font-mono text-xs max-w-md truncate text-slate-700" title={q.query}>
                      {q.query}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminTab === 'backups' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-6 rounded-lg">
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-1">Manual Database Snapshots</h3>
              <p className="text-sm text-blue-700">Create point-in-time snapshots for recovery or offline archiving (REQ-AFSMS-55/56).</p>
            </div>
            <button 
              onClick={handleCreateBackup}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-bold shadow-lg transition disabled:opacity-50 flex items-center space-x-2"
            >
              <Activity className="h-5 w-5" />
              <span>Create Snapshot</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 font-semibold text-slate-700">Available Recovery Points</div>
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>{['Filename', 'Size', 'Created At', 'Actions'].map(h => <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading && backups.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-4">Loading backups...</td></tr>
                ) : backups.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-4 text-slate-500">No snapshots found.</td></tr>
                ) : backups.map((b) => (
                  <tr key={b.filename} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{b.filename}</td>
                    <td className="px-6 py-4 text-slate-500">{(b.size / 1024).toFixed(2)} KB</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(b.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button 
                        onClick={() => handleDownloadBackup(b.filename)}
                        className="text-emerald-600 hover:text-emerald-800 font-bold flex items-center space-x-1"
                      >
                        Download
                      </button>
                      <button 
                        onClick={() => handleRestoreBackup(b.filename)}
                        className="text-red-600 hover:text-red-800 font-bold border border-red-200 px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                      >
                        Restore DB
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
