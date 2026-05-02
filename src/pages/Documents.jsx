import { useState, useEffect, useRef } from 'react';
import { 
  Mail, Search, Eye, CheckCircle, Trash, XCircle, Download, 
  FilePlus, ArrowRight, Filter, Plus, Send, User, Calendar, 
  Layers, Clock, Shield, AlertCircle, ChevronRight
} from 'lucide-react';
import Select from 'react-select';
import { documentsService, notificationsService, lookupService, adminService, groupsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function Documents() {
  const searchRef = useRef(null);
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '', authorKeyword: '', startDate: '', endDate: '', contentKeyword: ''
  });

  // Modals state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [showReuploadModal, setShowReuploadModal] = useState(false);

  // Forms state
  const [emailForm, setEmailForm] = useState({ targetType: 'FORMATION', groupId: '', subject: '', body: '' });
  const [uploadForm, setUploadForm] = useState({ title: '', type: '' });
  const [uploadFile, setUploadFile] = useState(null);
  const [forwardDocId, setForwardDocId] = useState(null);
  const [forwardUserId, setForwardUserId] = useState('');
  const [modificationDocId, setModificationDocId] = useState(null);
  const [modificationNote, setModificationNote] = useState('');
  const [reuploadDocId, setReuploadDocId] = useState(null);

  // Status/Data state
  const [emailStatus, setEmailStatus] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [studyFormations, setStudyFormations] = useState([]);
  const [customGroups, setCustomGroups] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);

  useKeyboardShortcuts({
    'Alt+U': () => {
      setShowUploadModal(true);
      setUploadStatus(null);
      setUploadForm({ title: '', type: '' });
      setUploadFile(null);
    },
    'Alt+E': () => {
      setShowEmailModal(true);
      setEmailStatus(null);
    },
    '/': (e) => {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    },
    'Escape': () => {
      setShowUploadModal(false);
      setShowEmailModal(false);
      setShowForwardModal(false);
      setShowModificationModal(false);
      setShowReuploadModal(false);
    }
  });

  useEffect(() => {
    fetchDocuments();
    if (user && ['ADMIN', 'PROFESSOR', 'SECRETARIAT'].includes(user.role)) {
      loadFormations();
      loadUsers();
      loadGroups();
    }
  }, [user]);

  const loadGroups = async () => {
    try {
      const res = await groupsService.getGroups();
      setCustomGroups(res.data || []);
    } catch (err) { console.error(err); }
  };

  const loadUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setSystemUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  };

  const loadFormations = async () => {
    try {
      const res = await lookupService.getStudyFormations();
      setStudyFormations(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentsService.getDocuments(filters);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await documentsService.updateStatus(id, newStatus);
      fetchDocuments();
    } catch (err) { console.error(err); }
  };

  const handleRequestModification = async (e) => {
    e.preventDefault();
    if (!modificationNote.trim()) return;
    try {
      await documentsService.updateStatus(modificationDocId, 'MODIFICATION', modificationNote);
      setShowModificationModal(false);
      fetchDocuments();
    } catch (err) { console.error(err); }
  };

  const handleReuploadDocument = async (e) => {
    e.preventDefault();
    setUploadStatus({ loading: true });
    try {
      const formData = new FormData();
      if (uploadFile) formData.append('file', uploadFile);
      
      await documentsService.reuploadDocument(reuploadDocId, formData);
      setUploadStatus({ success: true, message: language === 'ro' ? 'Document reîncărcat!' : 'Document re-uploaded!' });
      fetchDocuments();
      setTimeout(() => setShowReuploadModal(false), 1500);
    } catch (err) {
      setUploadStatus({ success: false, message: language === 'ro' ? 'Eroare reîncărcare.' : 'Re-upload failed.' });
    }
  };

  const handleForwardDocument = async (e) => {
    e.preventDefault();
    if (!forwardUserId) return;
    try {
      await documentsService.forwardDocument(forwardDocId, forwardUserId);
      setShowForwardModal(false);
      fetchDocuments();
    } catch (err) { console.error(err); }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    setUploadStatus({ loading: true });
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('type', uploadForm.type);
      if (uploadFile) formData.append('file', uploadFile);
      
      await documentsService.uploadDocument(formData);
      setUploadStatus({ success: true, message: language === 'ro' ? 'Document încărcat cu succes!' : 'Document uploaded successfully!' });
      fetchDocuments();
      setTimeout(() => setShowUploadModal(false), 1500);
    } catch (err) {
      setUploadStatus({ success: false, message: language === 'ro' ? 'Eroare încărcare. Verifică mărimea (max 10MB).' : 'Upload failed. Check file size (max 10MB).' });
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      await documentsService.deleteDocument(id);
      fetchDocuments();
    } catch (err) { console.error(err); }
  };

  const handleDownloadDocument = async (id, originalName) => {
    try {
      const response = await documentsService.downloadDocument(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName || `document-${id}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) { console.error(error); }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setEmailStatus({ loading: true });
    try {
      const res = await notificationsService.sendGroupEmail(emailForm);
      setEmailStatus({ success: true, message: res.data.message });
      setTimeout(() => setShowEmailModal(false), 2000);
    } catch (err) {
      setEmailStatus({ success: false, message: language === 'ro' ? 'Trimiterea email-ului a eșuat.' : 'Failed to send group email.' });
    }
  };

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-8 lg:p-12 animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            {t('doc_title')}
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            <Shield size={16} className="text-blue-600" /> {t('doc_subtitle')}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowEmailModal(true)}
            className="group bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all duration-300 flex items-center gap-3"
          >
            <Mail className="group-hover:scale-110 transition-transform" size={18} />
            <span>{t('group_email')}</span>
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="group bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3"
          >
            <Plus className="group-hover:rotate-90 transition-transform duration-500" size={18} />
            <span>{t('upload_new')}</span>
          </button>
        </div>
      </header>

      {/* Advanced Search Panel */}
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 mb-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Filter size={20} />
          </div>
          <h3 className="text-lg font-black text-slate-900">{t('advanced_filter')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <FilterInput label={t('th_doc_type')} placeholder="e.g. Request" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} />
          <FilterInput label={t('th_student')} placeholder="e.g. Popescu" value={filters.authorKeyword} onChange={e => setFilters({...filters, authorKeyword: e.target.value})} />
          <FilterInput label={language === 'ro' ? 'Dată Început' : 'Start Date'} type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} />
          <FilterInput label={language === 'ro' ? 'Dată Sfârșit' : 'End Date'} type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} />
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Cuvinte Cheie' : 'Keywords'}</label>
            <div className="relative group">
              <input 
                ref={searchRef}
                type="text" 
                placeholder={t('search')} 
                value={filters.contentKeyword} 
                onChange={e => setFilters({...filters, contentKeyword: e.target.value})}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={20} />
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={fetchDocuments}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            {t('apply')}
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <TableHead label={t('th_doc_type')} />
                <TableHead label={t('th_title')} />
                <TableHead label={t('th_author_flow')} />
                <TableHead label={t('th_created')} />
                <TableHead label={t('th_status')} />
                <TableHead label={t('th_actions')} />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="py-20 text-center"><LoadingSpinner /></td></tr>
              ) : documents.length === 0 ? (
                <tr><td colSpan="6" className="py-20 text-center text-slate-400 font-bold italic">{language === 'ro' ? 'Niciun document găsit.' : 'No records matching your search criteria.'}</td></tr>
              ) : documents.map((row) => (
                <tr key={row.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{row.type}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 text-sm">{row.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 truncate max-w-[200px]">{row.original_filename || 'Metadata Record'}</p>
                    {row.status === 'MODIFICATION' && row.revision_notes && (
                      <div className="mt-3 p-3 bg-orange-50/50 border border-orange-100 rounded-xl">
                        <p className="text-[10px] text-orange-600 font-black tracking-widest uppercase mb-1 flex items-center gap-1"><AlertCircle size={10} /> {language === 'ro' ? 'Motiv Întoarcere' : 'Return Reason'}</p>
                        <p className="text-xs font-bold text-orange-800">{row.revision_notes}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black">
                        {row.author_name?.[0] || 'S'}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 leading-none">{row.author_name || 'System'}</p>
                        {row.assigned_to_user_name && (
                          <p className="text-[10px] text-blue-600 font-black uppercase mt-1.5 flex items-center gap-1">
                            <ArrowRight size={10} /> {row.assigned_to_user_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-500">
                    {new Date(row.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <ActionButton 
                        icon={Download} 
                        color="text-blue-600 bg-blue-50" 
                        onClick={() => handleDownloadDocument(row.id, row.original_filename)}
                        disabled={!row.file_path}
                      />
                      
                      {row.status === 'MODIFICATION' && (user.role === 'STUDENT' || user.id === row.author_id) && (
                        <ActionButton icon={Plus} color="text-orange-600 bg-orange-50 border border-orange-100" onClick={() => { setReuploadDocId(row.id); setShowReuploadModal(true); }} />
                      )}

                      {['SECRETARIAT', 'ADMIN', 'PROFESSOR'].includes(user?.role) && (
                        <>
                          {['PENDING', 'DRAFT'].includes(row.status) && (
                            <ActionButton icon={AlertCircle} color="text-orange-600 bg-orange-50" onClick={() => { setModificationDocId(row.id); setShowModificationModal(true); }} />
                          )}
                          {row.status !== 'APPROVED' && (
                            <ActionButton icon={CheckCircle} color="text-emerald-600 bg-emerald-50" onClick={() => handleUpdateStatus(row.id, 'APPROVED')} />
                          )}
                          {row.status !== 'REJECTED' && (
                            <ActionButton icon={XCircle} color="text-rose-600 bg-rose-50" onClick={() => handleUpdateStatus(row.id, 'REJECTED')} />
                          )}
                          <ActionButton icon={ArrowRight} color="text-indigo-600 bg-indigo-50" onClick={() => { setForwardDocId(row.id); setForwardUserId(''); setShowForwardModal(true); }} />
                          <ActionButton icon={Trash} color="text-slate-400 hover:text-rose-600 bg-slate-50" onClick={() => handleDeleteDocument(row.id)} />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showUploadModal && (
        <Modal title={t('modal_upload_title')} onClose={() => setShowUploadModal(false)}>
           <form onSubmit={handleUploadDocument} className="space-y-6">
              {uploadStatus && <StatusAlert status={uploadStatus} />}
              <ModalInput label={language === 'ro' ? 'Titlu Intern' : 'Internal Title'} placeholder="e.g. Transcript Request - 2026" value={uploadForm.title} onChange={e => setUploadForm({...uploadForm, title: e.target.value})} />
              <ModalInput label={language === 'ro' ? 'Clasificare' : 'Classification'} placeholder="e.g. REQUEST" value={uploadForm.type} onChange={e => setUploadForm({...uploadForm, type: e.target.value})} />
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'ro' ? 'Selectează Fișier' : 'Select File Asset'}</label>
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setUploadFile(e.target.files[0])} />
                  <FilePlus className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{uploadFile ? uploadFile.name : (language === 'ro' ? 'Click sau Drag Fișier' : 'Click or Drag File')}</p>
                  <p className="text-[9px] text-slate-400 mt-2">PDF, DOCX, XLSX MAX 10MB</p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                 <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">{t('cancel')}</button>
                 <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">{language === 'ro' ? 'Începe Încărcarea' : 'Start Upload'}</button>
              </div>
           </form>
        </Modal>
      )}

      {showEmailModal && (
        <Modal title={t('modal_email_title')} onClose={() => setShowEmailModal(false)}>
          <form onSubmit={handleSendEmail} className="space-y-6">
            {emailStatus && <StatusAlert status={emailStatus} />}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button type="button" onClick={() => setEmailForm({...emailForm, targetType: 'FORMATION', groupId: ''})} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${emailForm.targetType === 'FORMATION' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{language === 'ro' ? 'Formațiune Studiu' : 'Study Formation'}</button>
              <button type="button" onClick={() => setEmailForm({...emailForm, targetType: 'GROUP', groupId: ''})} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${emailForm.targetType === 'GROUP' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{language === 'ro' ? 'Grup Utilizatori' : 'User Group'}</button>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Selectează Destinatar' : 'Select Target Recipient'}</label>
              <Select
                options={emailForm.targetType === 'FORMATION' ? studyFormations.map(f => ({ value: f.id, label: f.name })) : customGroups.map(g => ({ value: g.id, label: g.name }))}
                value={emailForm.groupId ? { value: emailForm.groupId, label: (emailForm.targetType === 'FORMATION' ? studyFormations : customGroups).find(x => x.id === emailForm.groupId)?.name } : null}
                onChange={opt => setEmailForm({...emailForm, groupId: opt?.value || ''})}
                styles={customSelectStyles}
                placeholder={language === 'ro' ? '-- Selectează Grup --' : "-- Select Group --"}
              />
            </div>

            <ModalInput label={language === 'ro' ? 'Subiect' : 'Subject Line'} placeholder="Internal communication subject" value={emailForm.subject} onChange={e => setEmailForm({...emailForm, subject: e.target.value})} />
            
            <div className="space-y-2">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Conținut Mesaj' : 'Message Body'}</label>
               <textarea rows="5" className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" value={emailForm.body} onChange={e => setEmailForm({...emailForm, body: e.target.value})} />
            </div>

            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-3">
              <Send size={16} /> {language === 'ro' ? 'Trimite Mesaj' : 'Broadcast Message'}
            </button>
          </form>
        </Modal>
      )}

      {showForwardModal && (
        <Modal title={t('modal_forward_title')} onClose={() => setShowForwardModal(false)}>
           <form onSubmit={handleForwardDocument} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Atribuie unui Agent' : 'Assign to Agent'}</label>
                <Select
                  options={systemUsers.map(u => ({ value: u.id, label: `${u.full_name} (${u.username})` }))}
                  value={forwardUserId ? { value: forwardUserId, label: systemUsers.find(u => u.id === forwardUserId)?.full_name } : null}
                  onChange={opt => setForwardUserId(opt?.value || '')}
                  styles={customSelectStyles}
                  placeholder={language === 'ro' ? '-- Căutare Personal --' : "-- Search Personnel --"}
                />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">{language === 'ro' ? 'Actualizează Atribuirea' : 'Update Assignment'}</button>
           </form>
        </Modal>
      )}

      {showModificationModal && (
        <Modal title={language === 'ro' ? 'Întoarcere pentru Modificare' : 'Return for Modification'} onClose={() => setShowModificationModal(false)}>
           <form onSubmit={handleRequestModification} className="space-y-6">
              <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                 <p className="text-xs font-bold text-orange-800 leading-relaxed">
                   {language === 'ro' ? 'Specifică motivul exact pentru care documentul este returnat. Studentul va vedea acest mesaj și va putea reîncărca o versiune corectată.' : 'Specify the exact reason for returning this document. The author will see this note and can upload a corrected version.'}
                 </p>
              </div>
              <div className="space-y-2">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'ro' ? 'Motiv (Obligatoriu)' : 'Reason (Required)'}</label>
                 <textarea required rows="4" className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none" value={modificationNote} onChange={e => setModificationNote(e.target.value)} placeholder={language === 'ro' ? 'Ex: Te rog să semnezi pe ultima pagină...' : 'Ex: Please sign the last page...'} />
              </div>
              <button type="submit" disabled={!modificationNote.trim()} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all disabled:opacity-50">{language === 'ro' ? 'Trimite înapoi' : 'Return Document'}</button>
           </form>
        </Modal>
      )}

      {showReuploadModal && (
        <Modal title={language === 'ro' ? 'Reîncarcă Document Corectat' : 'Re-upload Corrected Document'} onClose={() => setShowReuploadModal(false)}>
           <form onSubmit={handleReuploadDocument} className="space-y-6">
              {uploadStatus && <StatusAlert status={uploadStatus} />}
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 mb-6">
                 <p className="text-xs font-bold text-blue-800 leading-relaxed">
                   {language === 'ro' ? 'Încărcarea unui fișier nou va suprascrie varianta veche, iar documentul va reintra în procesul de aprobare (PENDING).' : 'Uploading a new file will replace the old one, and the document will re-enter the approval queue (PENDING).'}
                 </p>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'ro' ? 'Selectează Noul Fișier' : 'Select New File Asset'}</label>
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer relative bg-white">
                  <input required type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setUploadFile(e.target.files[0])} />
                  <FilePlus className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{uploadFile ? uploadFile.name : (language === 'ro' ? 'Click sau Drag Fișier' : 'Click or Drag File')}</p>
                </div>
              </div>
              <button type="submit" disabled={!uploadFile} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50">
                 {language === 'ro' ? 'Trimite Spre Re-Evaluare' : 'Submit for Re-Evaluation'}
              </button>
           </form>
        </Modal>
      )}
    </div>
  );
}

// Sub-components
function FilterInput({ label, type = "text", ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type={type} 
        {...props}
        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none"
      />
    </div>
  );
}

function TableHead({ label }) {
  return (
    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</th>
  );
}

function StatusBadge({ status }) {
  const config = {
    APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    DRAFT: "bg-slate-50 text-slate-400 border-slate-100",
    MODIFICATION: "bg-orange-50 text-orange-600 border-orange-100"
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${config[status] || config.PENDING}`}>
      {status}
    </span>
  );
}

function ActionButton({ icon: Icon, color, onClick, disabled }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${color} p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100`}
    >
      <Icon size={16} />
    </button>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function ModalInput({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none"
        {...props}
      />
    </div>
  );
}

function StatusAlert({ status }) {
  const { t, language } = useLanguage();
  if (status.loading) return (
    <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
       <Clock size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">{language === 'ro' ? 'Se procesează cererea...' : 'Processing request...'}</span>
    </div>
  );
  return (
    <div className={`p-4 rounded-2xl flex items-start gap-3 ${status.success ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
       {status.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
       <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest">{status.success ? t('success') : t('error')}</p>
          <p className="text-xs font-bold mt-1 leading-relaxed">{status.message}</p>
       </div>
    </div>
  );
}

function LoadingSpinner() {
  const { language } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'ro' ? 'Preluare Active Academice' : 'Retrieving Academic Assets'}</span>
    </div>
  );
}

const customSelectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: '1rem',
    padding: '0.4rem',
    border: '2px solid transparent',
    backgroundColor: '#f8fafc',
    fontWeight: 'bold',
    fontSize: '0.875rem',
    boxShadow: 'none',
    '&:hover': { border: '2px solid transparent' },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : 'white',
    color: state.isSelected ? 'white' : '#1e293b',
    fontWeight: 'bold',
    fontSize: '0.875rem',
  })
};
