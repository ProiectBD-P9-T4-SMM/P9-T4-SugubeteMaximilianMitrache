import { useState, useEffect } from 'react';
import { Mail, Search, Eye, CheckCircle, Trash } from 'lucide-react';
import { documentsService, notificationsService, lookupService } from '../services/api';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '', author_id: '', startDate: '', endDate: '', contentKeyword: ''
  });

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ groupId: '', subject: '', body: '' });
  const [studyFormations, setStudyFormations] = useState([]);
  const [emailStatus, setEmailStatus] = useState(null);

  useEffect(() => {
    fetchDocuments();
    loadFormations();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentsService.getDocuments(filters);
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFormations = async () => {
    try {
      const res = await lookupService.getStudyFormations();
      setStudyFormations(res.data);
    } catch (err) {
      console.error("Failed to load formations", err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await documentsService.updateStatus(id, newStatus);
      fetchDocuments(); // refresh list
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setEmailStatus({ loading: true });
    try {
      const res = await notificationsService.sendGroupEmail(emailForm);
      setEmailStatus({ success: true, message: res.data.message });
      setTimeout(() => setShowEmailModal(false), 2000);
    } catch (err) {
      setEmailStatus({ success: false, message: err.response?.data?.message || 'Failed to send' });
    }
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Documents & Workflow</h2>
        <button 
          onClick={() => { setShowEmailModal(true); setEmailStatus(null); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition flex items-center space-x-2"
        >
          <Mail className="h-4 w-4" />
          <span>Send Group Email (Outlook)</span>
        </button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Compose Group Email</h3>
            {emailStatus && (
              <div className={`p-3 rounded mb-4 text-sm ${emailStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {emailStatus.loading ? 'Sending via Nodemailer...' : emailStatus.message}
              </div>
            )}
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Group</label>
                <select required value={emailForm.groupId} onChange={e => setEmailForm({...emailForm, groupId: e.target.value})} className="w-full p-2 border border-slate-300 rounded">
                  <option value="">-- Select Group --</option>
                  {studyFormations.map(f => <option key={f.id} value={f.id}>{f.name} (Year {f.study_year})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input required type="text" value={emailForm.subject} onChange={e => setEmailForm({...emailForm, subject: e.target.value})} className="w-full p-2 border border-slate-300 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message Body</label>
                <textarea required rows="4" value={emailForm.body} onChange={e => setEmailForm({...emailForm, body: e.target.value})} className="w-full p-2 border border-slate-300 rounded"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowEmailModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={emailStatus?.loading}>Send Email</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Document type</label>
          <input type="text" placeholder="e.g. Cerere bursa" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
          <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
          <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Full-text search</label>
          <input type="text" placeholder="Keywords..." value={filters.contentKeyword} onChange={e => setFilters({...filters, contentKeyword: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 text-sm" />
        </div>
        <button onClick={fetchDocuments} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-md font-medium transition flex items-center justify-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Type', 'Title', 'Author', 'Created Date', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-4 text-slate-500">Loading documents...</td></tr>
            ) : documents.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-4 text-slate-500">No documents found matching filters.</td></tr>
            ) : documents.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">{row.type}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{row.title}</td>
                <td className="px-6 py-4">{row.author_name || 'System'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(row.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                    row.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                  <button className="text-slate-600 hover:text-slate-900" title="View"><Eye className="h-4 w-4" /></button>
                  {row.status !== 'APPROVED' && (
                    <button onClick={() => handleUpdateStatus(row.id, 'APPROVED')} className="text-green-600 hover:text-green-900" title="Approve"><CheckCircle className="h-4 w-4" /></button>
                  )}
                  {row.status !== 'REJECTED' && (
                    <button onClick={() => handleUpdateStatus(row.id, 'REJECTED')} className="text-red-600 hover:text-red-900" title="Reject"><Trash className="h-4 w-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
