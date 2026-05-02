import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Activity, Shield, Users, Mail, Database, Terminal, Plus, Trash2, Edit2, X, Check, Save, Clock, Settings } from 'lucide-react';
import { auditService, adminService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function AuditLogs() {
  const { t, language } = useLanguage();
  const [adminTab, setAdminTab] = useState('audit');
  const [auditLogs, setAuditLogs] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [rollbackStatus, setRollbackStatus] = useState(null);

  // Users and Roles state
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [queries, setQueries] = useState([]);
  const [backups, setBackups] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [backupConfig, setBackupConfig] = useState({ cron_expression: '0 0 * * *', enabled: false });
  const [pitrTimestamp, setPitrTimestamp] = useState('');

  // Modals / Forms state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ sso_subject: '', username: '', email: '', full_name: '', account_status: 'ACTIVE' });
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Settings state
  const [systemSettings, setSystemSettings] = useState({});
  const [academicYears, setAcademicYears] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [showYearModal, setShowYearModal] = useState(false);
  const [editingYear, setEditingYear] = useState(null);
  const [yearForm, setYearForm] = useState({ year_start: 2024, year_end: 2025, is_active: false });
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);
  const [specForm, setSpecForm] = useState({ code: '', name: '', degree_level: 'Bachelor', is_active: true });

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ code: '', name: '', description: '' });

  useEffect(() => {
    if (adminTab === 'audit') fetchAuditLogs(paginationMeta.page);
    if (adminTab === 'users') {
      fetchUsers();
      fetchRoles();
    }
    if (adminTab === 'queries') fetchQueries();
    if (adminTab === 'backups') {
      fetchBackups();
      fetchBackupConfig();
    }
    if (adminTab === 'emails') fetchEmailLogs();
    if (adminTab === 'settings') {
      fetchSystemSettings();
      fetchAcademicYears();
      fetchSpecializations();
    }
  }, [adminTab]);

  const fetchSystemSettings = async () => {
    try {
      const res = await configService.getSettings();
      setSystemSettings(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAcademicYears = async () => {
    try {
      const res = await configService.getAcademicYears();
      setAcademicYears(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchSpecializations = async () => {
    try {
      const res = await configService.getSpecializations();
      setSpecializations(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchBackupConfig = async () => {
    try {
      const res = await adminService.getBackupConfig();
      if (res.data) setBackupConfig(res.data);
    } catch (err) {
      console.error("Failed to fetch backup config", err);
    }
  };

  const handleUpdateBackupConfig = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateBackupConfig({
        cronExpression: backupConfig.cron_expression,
        enabled: backupConfig.enabled
      });
      setRollbackStatus({ success: true, message: language === 'ro' ? 'Programare backup actualizată!' : 'Backup schedule updated!' });
      setTimeout(() => setRollbackStatus(null), 3000);
    } catch (err) {
      alert(language === 'ro' ? 'Eroare la actualizarea programării' : 'Failed to update schedule');
    }
  };

  const fetchEmailLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getEmailLogs();
      setEmailLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch email logs", err);
    } finally {
      setLoading(false);
    }
  };

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
      fetchUsers();
    } catch (err) {
      alert(language === 'ro' ? 'Eroare la actualizarea rolului' : 'Failed to update role');
    }
  };

  const fetchAuditLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await auditService.getLogs({ page, limit: 20 });
      setAuditLogs(res.data.data);
      setPaginationMeta(res.data.meta);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (log) => {
    const isInsert = log.action_type === 'INSERT';
    const msg = isInsert 
      ? (language === 'ro' ? `Sigur doriți să ANULAȚI această creare? Aceasta va ȘTERGE înregistrarea ${log.entity_id} din ${log.entity_type}.` : `Are you sure you want to UNDO this creation? This will DELETE record ${log.entity_id} from ${log.entity_type}.`)
      : (language === 'ro' ? `Sigur doriți să reveniți asupra acestei ACTUALIZĂRI ${log.entity_type}?` : `Are you sure you want to rollback this ${log.entity_type} UPDATE?`);

    if (!window.confirm(msg)) return;
    
    try {
      const res = await auditService.rollback(log.id);
      setRollbackStatus({ success: true, message: res.data.message });
      fetchAuditLogs(); 
      setTimeout(() => setRollbackStatus(null), 3000);
    } catch (err) {
      setRollbackStatus({ success: false, message: err.response?.data?.message || (language === 'ro' ? 'Revenirea a eșuat' : 'Rollback failed') });
      setTimeout(() => setRollbackStatus(null), 3000);
    }
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      await adminService.createBackup();
      fetchBackups();
      setRollbackStatus({ success: true, message: language === 'ro' ? 'Instantaneu baza de date creat cu succes!' : 'Database snapshot created successfully!' });
    } catch (err) {
      console.error("Backup trigger failed:", err);
      setRollbackStatus({ success: false, message: language === 'ro' ? 'Eroare la crearea instantaneului' : 'Failed to create snapshot' });
    } finally {
      setLoading(false);
      setTimeout(() => setRollbackStatus(null), 3000);
    }
  };

  const handleRestoreBackup = async (filename) => {
    if (!window.confirm(language === 'ro' ? `⚠️ ATENȚIE: Aceasta va suprascrie TOATE datele curente cu conținutul din ${filename}. Continuați?` : `⚠️ CAUTION: This will overwrite ALL current data with the contents of ${filename}. Proceed?`)) return;
    
    setLoading(true);
    try {
      await adminService.restoreBackup(filename);
      setRollbackStatus({ success: true, message: language === 'ro' ? 'Baza de date RESTAURATĂ cu succes!' : 'Database RESTORED successfully!' });
      fetchAuditLogs();
    } catch (err) {
      setRollbackStatus({ success: false, message: (language === 'ro' ? 'Restaurarea a eșuat: ' : 'Restoration failed: ') + (err.response?.data?.message || err.message) });
    } finally {
      setLoading(false);
      setTimeout(() => setRollbackStatus(null), 5000);
    }
  };

  const handleDownloadBackup = async (filename) => {
    try {
      const response = await adminService.downloadBackup(filename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert((language === 'ro' ? 'Eroare la descărcarea backup-ului: ' : 'Failed to download backup: ') + (err.response?.data?.message || err.message));
    }
  };

  const handleManualArchive = async () => {
    if (!window.confirm(language === 'ro' ? 'Doriți să rulați manual procesul de arhivare a logurilor mai vechi de 5 ani?' : 'Do you want to manually run the archiving process for logs older than 5 years?')) return;
    setLoading(true);
    try {
      const res = await adminService.triggerAuditArchiving();
      setRollbackStatus({ success: true, message: res.data.message });
      setTimeout(() => setRollbackStatus(null), 5000);
    } catch (err) {
      setRollbackStatus({ success: false, message: language === 'ro' ? 'Arhivarea a eșuat' : 'Archiving failed' });
      setTimeout(() => setRollbackStatus(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handlePITR = async () => {
    if (!pitrTimestamp) return;
    if (!window.confirm(language === 'ro' 
      ? `⚠️ ATENȚIE: Aceasta va REVENI TOATE modificările de sistem la starea din ${new Date(pitrTimestamp).toLocaleString()}. Continuați?` 
      : `⚠️ CAUTION: This will REVERT ALL system changes to the state at ${new Date(pitrTimestamp).toLocaleString()}. Proceed?`)) return;

    setLoading(true);
    try {
      const res = await auditService.pitr(pitrTimestamp);
      setRollbackStatus({ success: true, message: res.data.message });
      fetchAuditLogs();
    } catch (err) {
      setRollbackStatus({ success: false, message: err.response?.data?.message || (language === 'ro' ? 'PITR a eșuat' : 'PITR failed') });
    } finally {
      setLoading(false);
      setTimeout(() => setRollbackStatus(null), 5000);
    }
  };

  const handleSaveYear = async (e) => {
    e.preventDefault();
    try {
      if (editingYear) {
        await configService.updateAcademicYear(editingYear.id, yearForm);
      } else {
        await configService.createAcademicYear(yearForm);
      }
      setShowYearModal(false);
      fetchAcademicYears();
    } catch (err) { alert('Failed to save academic year'); }
  };

  const handleSaveSpec = async (e) => {
    e.preventDefault();
    try {
      if (editingSpec) {
        await configService.updateSpecialization(editingSpec.id, specForm);
      } else {
        await configService.createSpecialization(specForm);
      }
      setShowSpecModal(false);
      fetchSpecializations();
    } catch (err) { alert('Failed to save specialization'); }
  };

  // User CRUD
  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, userForm);
      } else {
        await adminService.createUser(userForm);
      }
      setShowUserModal(false);
      fetchUsers();
    } catch (err) {
      alert(language === 'ro' ? 'Eroare la salvarea utilizatorului' : 'Failed to save user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm(language === 'ro' ? 'Sigur doriți să ștergeți acest cont de utilizator?' : 'Are you sure you want to delete this user account?')) return;
    try {
      await adminService.deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert(language === 'ro' ? 'Eroare la ștergerea utilizatorului' : 'Failed to delete user');
    }
  };

  // Role CRUD
  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await adminService.updateRole(editingRole.id, roleForm);
      } else {
        await adminService.createRole(roleForm);
      }
      setShowRoleModal(false);
      fetchRoles();
    } catch (err) {
      alert(language === 'ro' ? 'Eroare la salvarea rolului' : 'Failed to save role');
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm(language === 'ro' ? 'Sigur doriți să ștergeți acest rol?' : 'Are you sure you want to delete this role?')) return;
    try {
      await adminService.deleteRole(id);
      fetchRoles();
    } catch (err) {
      alert(language === 'ro' ? 'Eroare la ștergerea rolului' : 'Failed to delete role');
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 min-h-screen p-6">
      <div className="w-full space-y-6">
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Shield className="text-blue-600" size={32} /> {t('admin_title')}
                </h2>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">{t('admin_subtitle')}</p>
            </div>
            {rollbackStatus && (
                <div className={`px-4 py-2 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${rollbackStatus.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <span className="font-black text-xs">{rollbackStatus.success ? (language === 'ro' ? 'SISTEM OK:' : 'SYSTEM OK:') : (language === 'ro' ? 'ALERTA SISTEM:' : 'SYSTEM ALERT:')}</span>
                    <span className="text-xs font-bold">{rollbackStatus.message}</span>
                </div>
            )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {[
                { id: 'audit', label: language === 'ro' ? 'Registre Audit' : 'Audit Logs', icon: Activity },
                { id: 'users', label: language === 'ro' ? 'Utilizatori și Roluri' : 'Users & Roles', icon: Users },
                { id: 'emails', label: language === 'ro' ? 'Notificări' : 'Notifications', icon: Mail },
                { id: 'settings', label: language === 'ro' ? 'Configurare' : 'Settings', icon: Settings },
                { id: 'queries', label: language === 'ro' ? 'Monitor DB' : 'DB Monitor', icon: Terminal },
                { id: 'backups', label: language === 'ro' ? 'Recuperare' : 'Recovery', icon: Database },
            ].map(t => (
                <button 
                    key={t.id}
                    onClick={() => setAdminTab(t.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${adminTab === t.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
                >
                    <t.icon size={16} />
                    {t.label}
                </button>
            ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            {adminTab === 'audit' && (
                <div className="space-y-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-800">
                        <div className="flex-1">
                            <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                                <Clock className="text-blue-400" size={24} /> {language === 'ro' ? 'Restaurare Granulară (Time Travel)' : 'Granular Point-in-Time Recovery'}
                            </h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                {language === 'ro' 
                                    ? 'Inversați toate operațiunile în mod secvențial până la un marcaj temporal precis folosind registrul de trasabilitate.' 
                                    : 'Reverse all operations sequentially back to a precise timestamp using the traceability ledger.'}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <input 
                                type="datetime-local" 
                                value={pitrTimestamp}
                                onChange={(e) => setPitrTimestamp(e.target.value)}
                                className="bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-blue-500/20 transition-all w-full"
                            />
                            <button 
                                onClick={handlePITR}
                                disabled={!pitrTimestamp || loading}
                                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {language === 'ro' ? 'Execută Restaurare' : 'Execute Recovery'}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">{language === 'ro' ? 'Registru Trasabilitate Operațiuni' : 'Operations Traceability Ledger'}</h3>
                        <button onClick={() => fetchAuditLogs(paginationMeta.page)} className="text-blue-600 font-black text-[10px] uppercase">{language === 'ro' ? 'Reîmprospătare' : 'Refresh Logs'}</button>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="min-w-full divide-y divide-slate-100 text-sm">
                            <thead className="bg-slate-50/50">
                                <tr>{[language === 'ro' ? 'Marcaj Timp' : 'Timestamp', language === 'ro' ? 'Identitate' : 'Identity', language === 'ro' ? 'Operațiune' : 'Operation', language === 'ro' ? 'Modul / Entitate' : 'Module / Entity', language === 'ro' ? 'Instantanee' : 'Snapshots', language === 'ro' ? 'Acțiune' : 'Action'].map(h => <th key={h} className="px-6 py-4 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">{h}</th>)}</tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {auditLogs.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-black text-slate-700 text-xs">{new Date(row.occurred_at).toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO')}</div>
                                            <div className="text-[10px] font-bold text-slate-400">{new Date(row.occurred_at).toLocaleTimeString(language === 'en' ? 'en-US' : 'ro-RO')}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-600 text-xs">{row.actor_name || 'System'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${
                                                row.action_type === 'INSERT' ? 'bg-blue-50 text-blue-600' :
                                                row.action_type === 'UPDATE' ? 'bg-amber-50 text-amber-600' :
                                                row.action_type === 'DELETE' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
                                            }`}>{row.action_type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-slate-800 text-[10px]">{row.module}</div>
                                            <div className="text-[9px] font-bold text-slate-400">{row.entity_type}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {row.before_snapshot_json && <span className="bg-red-50 text-red-500 p-1.5 rounded-lg font-black text-[8px] uppercase">{language === 'ro' ? 'Înainte' : 'Before'}</span>}
                                                {row.after_snapshot_json && <span className="bg-emerald-50 text-emerald-500 p-1.5 rounded-lg font-black text-[8px] uppercase">{language === 'ro' ? 'După' : 'After'}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {(row.action_type === 'UPDATE' || row.action_type === 'INSERT') && (
                                                <button onClick={() => handleRollback(row)} className="bg-slate-900 text-white px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all">Rollback</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between px-2 pt-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {language === 'ro' 
                                ? `Afișare ${auditLogs.length} din ${paginationMeta.total} înregistrări total` 
                                : `Showing ${auditLogs.length} of ${paginationMeta.total} total records`}
                        </p>
                        <div className="flex gap-2">
                            <button 
                                disabled={paginationMeta.page <= 1}
                                onClick={() => fetchAuditLogs(paginationMeta.page - 1)}
                                className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
                            >
                                {language === 'ro' ? 'Anterior' : 'Previous'}
                            </button>
                            <button 
                                disabled={paginationMeta.page >= paginationMeta.totalPages}
                                onClick={() => fetchAuditLogs(paginationMeta.page + 1)}
                                className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
                            >
                                {language === 'ro' ? 'Următor' : 'Next'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mt-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                                <Shield size={18} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest">
                                    {language === 'ro' ? 'Politică Retenție Date' : 'Data Retention Policy'}
                                </h4>
                                <p className="text-[10px] font-bold text-amber-700/80 mt-1">
                                    {language === 'ro' 
                                        ? 'Conform reglementărilor instituționale, registrele de audit sunt păstrate pentru o perioadă de 5 ani. Datele mai vechi sunt arhivate automat într-un depozit securizat extern la intervale regulate.' 
                                        : 'Per institutional regulations, audit logs are retained for a period of 5 years. Older data is automatically archived to a secure external repository at regular intervals.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {adminTab === 'users' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Roles Section */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">{language === 'ro' ? 'Profiluri Permisiuni' : 'Permission Profiles'}</h3>
                                <button onClick={() => { setEditingRole(null); setRoleForm({ code: '', name: '', description: '' }); setShowRoleModal(true); }} className="text-blue-600 font-black text-[10px] uppercase flex items-center gap-1"><Plus size={14} /> {language === 'ro' ? 'Adaugă Rol' : 'Add Role'}</button>
                            </div>
                            <div className="space-y-2">
                                {roles.map(role => (
                                    <div key={role.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center group">
                                        <div>
                                            <div className="font-black text-slate-800 text-sm">{role.name}</div>
                                            <div className="text-[10px] font-bold text-blue-600 font-mono uppercase tracking-tighter">{role.code}</div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => { setEditingRole(role); setRoleForm({ code: role.code, name: role.name, description: role.description }); setShowRoleModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDeleteRole(role.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Users Section */}
                        <div className="lg:col-span-8 space-y-4">
                             <div className="flex items-center justify-between px-2">
                                <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">{language === 'ro' ? 'Conturi Active' : 'Active Accounts'}</h3>
                                <button onClick={() => { setEditingUser(null); setUserForm({ sso_subject: '', username: '', email: '', full_name: '', account_status: 'ACTIVE' }); setShowUserModal(true); }} className="text-blue-600 font-black text-[10px] uppercase flex items-center gap-1"><Plus size={14} /> {language === 'ro' ? 'Utilizator Nou' : 'New User'}</button>
                            </div>
                            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                <table className="min-w-full divide-y divide-slate-100 text-sm">
                                    <thead className="bg-slate-50/50">
                                        <tr>{[language === 'ro' ? 'Identitate Utilizator' : 'User Identity', language === 'ro' ? 'Context SSO' : 'SSO Context', 'Status', language === 'ro' ? 'Rol Atribuit' : 'Assigned Role', language === 'ro' ? 'Acțiune' : 'Action'].map(h => <th key={h} className="px-6 py-4 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">{h}</th>)}</tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-50">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                                                <td className="px-6 py-4">
                                                    <div className="font-black text-slate-800 text-sm">{u.full_name}</div>
                                                    <div className="text-[10px] font-bold text-slate-400">{u.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-mono text-[9px] font-black text-blue-600 uppercase">{u.username}</div>
                                                    <div className="text-[8px] font-bold text-slate-300 truncate max-w-[80px]" title={u.sso_subject}>{u.sso_subject}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                     <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase ${u.account_status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{u.account_status}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Select 
                                                        options={roles.map(r => ({ value: r.id, label: r.name }))}
                                                        value={u.role_id ? { value: u.role_id, label: roles.find(r => r.id === u.role_id)?.name } : null}
                                                        onChange={(option) => handleRoleChange(u.id, option ? option.value : '')}
                                                        placeholder={language === 'ro' ? '-- Rol --' : "-- Role --"}
                                                        styles={{
                                                            control: (base) => ({
                                                                ...base,
                                                                borderRadius: '0.75rem',
                                                                border: '1px solid #e2e8f0',
                                                                fontSize: '10px',
                                                                fontWeight: '900',
                                                                boxShadow: 'none',
                                                                minWidth: '120px'
                                                            })
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => { setEditingUser(u); setUserForm({ sso_subject: u.sso_subject, username: u.username, email: u.email, full_name: u.full_name, account_status: u.account_status }); setShowUserModal(true); }} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={14} /></button>
                                                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {adminTab === 'emails' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">{language === 'ro' ? 'Registre Comunicare' : 'Communication Logs'}</h3>
                        <button onClick={fetchEmailLogs} className="text-blue-600 font-black text-[10px] uppercase">{language === 'ro' ? 'Reîmprospătare' : 'Refresh'}</button>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="min-w-full divide-y divide-slate-100 text-sm">
                            <thead className="bg-slate-50/50">
                                <tr>{[language === 'ro' ? 'Trimis la' : 'Sent At', language === 'ro' ? 'Expeditor' : 'Sender', language === 'ro' ? 'Țintă' : 'Target', language === 'ro' ? 'Subiect' : 'Subject', 'Status', language === 'ro' ? 'Acțiune' : 'Action'].map(h => <th key={h} className="px-6 py-4 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">{h}</th>)}</tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {emailLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4 whitespace-nowrap text-[10px] font-black text-slate-400">{new Date(log.sent_at).toLocaleString(language === 'en' ? 'en-US' : 'ro-RO')}</td>
                                        <td className="px-6 py-4 font-black text-slate-700 text-xs">{log.sent_by || 'System'}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-blue-600 text-[10px] uppercase">{log.group_name || (language === 'ro' ? 'Formațiune Academică' : 'Academic Formation')}</div>
                                            <div className="text-[9px] font-bold text-slate-400 truncate max-w-[150px]" title={log.recipients}>{log.recipients}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-600 text-xs">{log.subject}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">{log.delivery_status}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => setSelectedEmail(log)}
                                                className="bg-blue-600 text-white px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-1"
                                            >
                                                <Mail size={12} /> {language === 'ro' ? 'Vezi Mail' : 'View Mail'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {adminTab === 'queries' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">{language === 'ro' ? 'Activitate Live Bază de Date' : 'Live Database Activity'}</h3>
                        <button onClick={fetchQueries} className="text-blue-600 font-black text-[10px] uppercase flex items-center gap-1"><Activity size={14} /> {language === 'ro' ? 'Reîmprospătare Monitor' : 'Refresh Monitor'}</button>
                    </div>
                    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-900">
                        <table className="min-w-full divide-y divide-slate-800 text-sm">
                            <thead className="bg-slate-800/50">
                                <tr>{['PID', 'User', language === 'ro' ? 'Stare' : 'State', language === 'ro' ? 'Context Interogare' : 'Query Context'].map(h => <th key={h} className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px]">{h}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {queries.map(q => (
                                    <tr key={q.pid} className="hover:bg-slate-800 transition-all">
                                        <td className="px-6 py-4 font-mono text-[10px] font-black text-blue-400">{q.pid}</td>
                                        <td className="px-6 py-4 font-black text-slate-300 text-xs">{q.username}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase ${q.state === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>{q.state}</span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[9px] text-slate-500 max-w-xl truncate" title={q.query}>{q.query}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {adminTab === 'settings' && (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Institutional Metadata */}
                        <div className="space-y-6">
                            <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px] px-2">{language === 'ro' ? 'Metadate Instituționale' : 'Institutional Metadata'}</h3>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Denumire Facultate' : 'Faculty Name'}</label>
                                    <input type="text" value={systemSettings.FACULTY_NAME || ''} onChange={e => setSystemSettings({...systemSettings, FACULTY_NAME: e.target.value})} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Decan Facultate' : 'Dean of Faculty'}</label>
                                    <input type="text" value={systemSettings.DEAN_NAME || ''} onChange={e => setSystemSettings({...systemSettings, DEAN_NAME: e.target.value})} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Notă Informativă Portal' : 'Portal Information Notice'}</label>
                                    <textarea rows="3" value={systemSettings.PORTAL_NOTICE || ''} onChange={e => setSystemSettings({...systemSettings, PORTAL_NOTICE: e.target.value})} className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all resize-none"></textarea>
                                </div>
                                <button onClick={async () => {
                                    try {
                                        await configService.updateSettings(systemSettings);
                                        setRollbackStatus({ success: true, message: language === 'ro' ? 'Setări salvate!' : 'Settings saved!' });
                                        setTimeout(() => setRollbackStatus(null), 3000);
                                    } catch (err) { alert('Failed to save settings'); }
                                }} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                                    <Save size={18} /> {language === 'ro' ? 'Salvează Configurația' : 'Save Configuration'}
                                </button>
                            </div>
                        </div>

                        {/* Academic Calendar */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">{language === 'ro' ? 'Calendar Academic' : 'Academic Calendar'}</h3>
                                <button onClick={() => { setEditingYear(null); setYearForm({ year_start: 2024, year_end: 2025, is_active: false }); setShowYearModal(true); }} className="text-blue-600 font-black text-[10px] uppercase flex items-center gap-1"><Plus size={14} /> {language === 'ro' ? 'An Nou' : 'New Year'}</button>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-slate-100 text-sm">
                                    <thead className="bg-slate-50/50">
                                        <tr>{['Interval', 'Status', 'Action'].map(h => <th key={h} className="px-6 py-4 text-left font-black text-slate-400 uppercase tracking-widest text-[9px]">{h}</th>)}</tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {academicYears.map(ay => (
                                            <tr key={ay.id} className="hover:bg-slate-50/50 transition-all group">
                                                <td className="px-6 py-4 font-black text-slate-700 text-xs">{ay.year_start} - {ay.year_end}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase ${ay.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{ay.is_active ? (language === 'ro' ? 'Activ' : 'Active') : (language === 'ro' ? 'Inactiv' : 'Inactive')}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => { setEditingYear(ay); setYearForm({ year_start: ay.year_start, year_end: ay.year_end, is_active: ay.is_active }); setShowYearModal(true); }} className="p-2 text-slate-300 hover:text-blue-600 rounded-xl transition-all"><Edit2 size={14} /></button>
                                                        <button onClick={async () => {
                                                            if (window.confirm('Delete academic year?')) {
                                                                await configService.deleteAcademicYear(ay.id);
                                                                fetchAcademicYears();
                                                            }
                                                        }} className="p-2 text-slate-300 hover:text-red-600 rounded-xl transition-all"><Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Institutional Structure (Specializations) */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">{language === 'ro' ? 'Structură Instituțională (Specializări)' : 'Institutional Structure (Specializations)'}</h3>
                            <button onClick={() => { setEditingSpec(null); setSpecForm({ code: '', name: '', degree_level: 'Bachelor', is_active: true }); setShowSpecModal(true); }} className="text-blue-600 font-black text-[10px] uppercase flex items-center gap-1"><Plus size={14} /> {language === 'ro' ? 'Specializare Nouă' : 'New Specialization'}</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {specializations.map(spec => (
                                <div key={spec.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${spec.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                            <Shield size={24} />
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => { setEditingSpec(spec); setSpecForm({ code: spec.code, name: spec.name, degree_level: spec.degree_level, is_active: spec.is_active }); setShowSpecModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all"><Edit2 size={14} /></button>
                                            <button onClick={async () => {
                                                if (window.confirm('Delete specialization?')) {
                                                    await configService.deleteSpecialization(spec.id);
                                                    fetchSpecializations();
                                                }
                                            }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-xl transition-all"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    <div className="font-black text-slate-800 text-sm mb-1">{spec.name}</div>
                                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono mb-4">{spec.code}</div>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{spec.degree_level}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase ${spec.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{spec.is_active ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {adminTab === 'backups' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Manual Backup Card */}
                        <div className="bg-slate-900 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-slate-200 border border-slate-800">
                            <div>
                                <h3 className="text-xl font-black text-white mb-2">{language === 'ro' ? 'Instantaneu Manual' : 'Manual Snapshot'}</h3>
                                <p className="text-slate-400 text-[10px] font-black leading-relaxed uppercase tracking-widest mb-6">{language === 'ro' ? 'Sistem de recuperare imediată. Declanșați un instantaneu criptat instantaneu al bazei de date.' : 'Immediate point-in-time recovery system. Trigger an instant encrypted database snapshot.'}</p>
                            </div>
                            <button onClick={handleCreateBackup} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-3">
                                <Database size={20} /> {language === 'ro' ? 'Crează Instantaneu Manual' : 'Create Manual Snapshot'}
                            </button>
                            <button onClick={handleManualArchive} disabled={loading} className="w-full mt-4 bg-slate-800 text-slate-300 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black border border-slate-700 transition-all flex items-center justify-center gap-3">
                                <Shield size={20} /> {language === 'ro' ? 'Arhivare Manuală 5 Ani' : 'Manual 5-Year Archive'}
                            </button>
                        </div>

                        {/* Automatic Backup Card */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                            <form onSubmit={handleUpdateBackupConfig} className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 mb-1">{language === 'ro' ? 'Automatizare Temporizată' : 'Timed Automation'}</h3>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{language === 'ro' ? 'Protocol de Backup programat bazat pe CRON' : 'Scheduled CRON-based Backup Protocol'}</p>
                                    </div>
                                    <label className={`relative inline-flex items-center cursor-pointer p-1 rounded-xl transition-all ${backupConfig.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <input type="checkbox" className="hidden" checked={backupConfig.enabled} onChange={e => setBackupConfig({...backupConfig, enabled: e.target.checked})} />
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2">{backupConfig.enabled ? (language === 'ro' ? 'Activat' : 'Enabled') : (language === 'ro' ? 'Dezactivat' : 'Disabled')}</span>
                                    </label>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Expresie CRON' : 'CRON Expression'}</label>
                                        <div className="flex gap-2">
                                            <input 
                                                required 
                                                type="text" 
                                                value={backupConfig.cron_expression} 
                                                onChange={e => setBackupConfig({...backupConfig, cron_expression: e.target.value})} 
                                                className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-black outline-none focus:ring-4 focus:ring-blue-50 transition-all" 
                                                placeholder="e.g. 0 0 * * *" 
                                            />
                                            <button type="submit" className="bg-slate-900 text-white px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">{language === 'ro' ? 'Actualizare' : 'Update'}</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button type="button" onClick={() => setBackupConfig({...backupConfig, cron_expression: '0 0 * * *'})} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[8px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 transition-all">{language === 'ro' ? 'Zilnic la Miezul Nopții' : 'Midnight Daily'}</button>
                                        <button type="button" onClick={() => setBackupConfig({...backupConfig, cron_expression: '0 0 * * 0'})} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[8px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 transition-all">{language === 'ro' ? 'Săptămânal (Dum)' : 'Weekly (Sun)'}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px] px-2">{language === 'ro' ? 'Instantanee Verificate prin Criptare' : 'Encryption-Verified Snapshots'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {backups.map(b => (
                                <div key={b.filename} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                            <Database size={24} />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-slate-300 uppercase">{language === 'ro' ? 'Mărime' : 'Size'}</div>
                                            <div className="text-xs font-black text-slate-600">{(b.size / 1024).toFixed(2)} KB</div>
                                        </div>
                                    </div>
                                    <div className="font-mono text-[10px] font-black text-slate-800 mb-1 truncate" title={b.filename}>{b.filename}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-6">{new Date(b.createdAt).toLocaleString(language === 'en' ? 'en-US' : 'ro-RO')}</div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleDownloadBackup(b.filename)} className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all">{language === 'ro' ? 'Descărcare' : 'Download'}</button>
                                        <button onClick={() => handleRestoreBackup(b.filename)} className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">{language === 'ro' ? 'Restaurare' : 'Restore'}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                      <div>
                          <h3 className="text-xl font-black text-slate-900">{editingUser ? (language === 'ro' ? 'Modificare Cont' : 'Account Modification') : (language === 'ro' ? 'Provizionare Cont Nou' : 'New Account Provisioning')}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{language === 'ro' ? 'Protocol Management Identitate' : 'Identity Management Protocol'}</p>
                      </div>
                      <button onClick={() => setShowUserModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleSaveUser} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Nume Complet' : 'Full Name'}</label>
                            <input required type="text" value={userForm.full_name} onChange={e => setUserForm({...userForm, full_name: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Utilizator' : 'Username'}</label>
                            <input required type="text" value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                        </div>
                      </div>
                      <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Adresă Email' : 'Email Address'}</label>
                            <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                      </div>
                      <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Subiect SSO (Identificator Unic)' : 'SSO Subject (Unique Identifier)'}</label>
                            <input required type="text" value={userForm.sso_subject} onChange={e => setUserForm({...userForm, sso_subject: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-black outline-none focus:ring-4 focus:ring-blue-50 transition-all" placeholder="e.g. auth0|..." />
                      </div>
                      <div className="space-y-1 pt-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Status Cont' : 'Account Status'}</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border cursor-pointer transition-all font-black text-[10px] uppercase tracking-widest ${userForm.account_status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-50' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                                    <input type="radio" className="hidden" checked={userForm.account_status === 'ACTIVE'} onChange={() => setUserForm({...userForm, account_status: 'ACTIVE'})} />
                                    {userForm.account_status === 'ACTIVE' && <Check size={14} />} {language === 'ro' ? 'Activ' : 'Active'}
                                </label>
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border cursor-pointer transition-all font-black text-[10px] uppercase tracking-widest ${userForm.account_status === 'SUSPENDED' ? 'bg-red-50 border-red-500 text-red-600 shadow-lg shadow-red-50' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                                    <input type="radio" className="hidden" checked={userForm.account_status === 'SUSPENDED'} onChange={() => setUserForm({...userForm, account_status: 'SUSPENDED'})} />
                                    {userForm.account_status === 'SUSPENDED' && <Check size={14} />} {language === 'ro' ? 'Suspendat' : 'Suspended'}
                                </label>
                            </div>
                      </div>
                      <div className="flex gap-3 pt-6">
                          <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">{t('cancel')}</button>
                          <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2">
                              <Save size={18} /> {editingUser ? (language === 'ro' ? 'Actualizare Profil' : 'Update Profile') : (language === 'ro' ? 'Creare Cont' : 'Create Account')}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Academic Year Modal */}
      {showYearModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-900">{editingYear ? 'Edit Academic Year' : 'New Academic Year'}</h3>
                      <button onClick={() => setShowYearModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleSaveYear} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Year</label>
                              <input required type="number" value={yearForm.year_start} onChange={e => setYearForm({...yearForm, year_start: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Year</label>
                              <input required type="number" value={yearForm.year_end} onChange={e => setYearForm({...yearForm, year_end: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                          </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <input type="checkbox" checked={yearForm.is_active} onChange={e => setYearForm({...yearForm, is_active: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
                          <label className="text-xs font-black text-slate-700 uppercase tracking-widest">Set as Active Year</label>
                      </div>
                      <div className="flex gap-3 pt-6">
                          <button type="button" onClick={() => setShowYearModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                          <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2">
                              <Save size={18} /> Save Year
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Specialization Modal */}
      {showSpecModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-900">{editingSpec ? 'Edit Specialization' : 'New Specialization'}</h3>
                      <button onClick={() => setShowSpecModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleSaveSpec} className="space-y-4">
                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                          <input required type="text" value={specForm.name} onChange={e => setSpecForm({...specForm, name: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Code</label>
                              <input required type="text" value={specForm.code} onChange={e => setSpecForm({...specForm, code: e.target.value.toUpperCase()})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-black outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Level</label>
                              <select value={specForm.degree_level} onChange={e => setSpecForm({...specForm, degree_level: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-blue-50 transition-all">
                                  <option value="Bachelor">Bachelor</option>
                                  <option value="Master">Master</option>
                                  <option value="Doctorate">Doctorate</option>
                              </select>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <input type="checkbox" checked={specForm.is_active} onChange={e => setSpecForm({...specForm, is_active: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
                          <label className="text-xs font-black text-slate-700 uppercase tracking-widest">Active Specialization</label>
                      </div>
                      <div className="flex gap-3 pt-6">
                          <button type="button" onClick={() => setShowSpecModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                          <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2">
                              <Save size={18} /> Save Specialization
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Email View Modal */}
      {selectedEmail && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[90vh]">
                  <div className="flex justify-between items-center mb-6 flex-shrink-0">
                      <div>
                          <h3 className="text-xl font-black text-slate-900">{language === 'ro' ? 'Previzualizare E-mail (Phantom Mail)' : 'E-mail Preview (Phantom Mail)'}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{language === 'ro' ? 'Protocol Monitorizare Notificări' : 'Notification Monitoring Protocol'}</p>
                      </div>
                      <button onClick={() => setSelectedEmail(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
                  </div>
                  
                  <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                      <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{language === 'ro' ? 'Expeditor' : 'Sender'}</label>
                                  <div className="text-sm font-black text-slate-700">{selectedEmail.sent_by || 'System'}</div>
                              </div>
                              <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{language === 'ro' ? 'Trimis la' : 'Sent At'}</label>
                                  <div className="text-sm font-bold text-slate-600">{new Date(selectedEmail.sent_at).toLocaleString(language === 'en' ? 'en-US' : 'ro-RO')}</div>
                              </div>
                          </div>
                          <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{language === 'ro' ? 'Destinatari' : 'Recipients'}</label>
                              <div className="text-xs font-mono bg-white p-3 rounded-xl border border-slate-200 text-blue-600 break-all">{selectedEmail.recipients}</div>
                          </div>
                          <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{language === 'ro' ? 'Subiect' : 'Subject'}</label>
                              <div className="text-sm font-black text-slate-900">{selectedEmail.subject}</div>
                          </div>
                      </div>

                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-2">{language === 'ro' ? 'Conținut Mesaj' : 'Message Content'}</label>
                          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[200px]">
                              {selectedEmail.body_preview}
                          </div>
                      </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex-shrink-0">
                      <button onClick={() => setSelectedEmail(null)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                          {language === 'ro' ? 'Închide Previzualizarea' : 'Close Preview'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                      <div>
                          <h3 className="text-xl font-black text-slate-900">{editingRole ? (language === 'ro' ? 'Rafinare Rol' : 'Role Refinement') : (language === 'ro' ? 'Definire Profil Nou' : 'New Profile Definition')}</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{language === 'ro' ? 'Configurare Control Acces' : 'Access Control Configuration'}</p>
                      </div>
                      <button onClick={() => setShowRoleModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleSaveRole} className="space-y-4">
                      <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Etichetă Rol (Nume Afișat)' : 'Role Label (Display Name)'}</label>
                            <input required type="text" value={roleForm.name} onChange={e => setRoleForm({...roleForm, name: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-blue-50 transition-all" placeholder="e.g. Dean" />
                      </div>
                      <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Cod Sistem (Cheie Imutabilă)' : 'System Code (Immutable Key)'}</label>
                            <input required type="text" value={roleForm.code} onChange={e => setRoleForm({...roleForm, code: e.target.value.toUpperCase()})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-black outline-none focus:ring-4 focus:ring-blue-50 transition-all" placeholder="E.G. DEAN_OFFICE" />
                      </div>
                      <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Scop Responsabilitate' : 'Responsibility Scope'}</label>
                            <textarea rows="3" value={roleForm.description} onChange={e => setRoleForm({...roleForm, description: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all resize-none" placeholder={language === 'ro' ? 'Descrieți permisiunile și nivelul de acces...' : "Describe the permissions and access level..."}></textarea>
                      </div>
                      <div className="flex gap-3 pt-6">
                          <button type="button" onClick={() => setShowRoleModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">{t('cancel')}</button>
                          <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2">
                              <Save size={18} /> {editingRole ? (language === 'ro' ? 'Actualizare Profil' : 'Update Profile') : (language === 'ro' ? 'Inițializare Rol' : 'Initialize Role')}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
