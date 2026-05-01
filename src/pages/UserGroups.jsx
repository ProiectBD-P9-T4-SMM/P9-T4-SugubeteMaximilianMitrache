import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, UserPlus, X, Edit, Save, Check } from 'lucide-react';
import Select from 'react-select';
import { groupsService, adminService } from '../services/api';

export default function UserGroups() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGroups();
    loadSystemUsers();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadMembers(selectedGroup.id);
      setIsEditing(false);
      setEditForm({ name: selectedGroup.name, description: selectedGroup.description });
    } else {
      setMembers([]);
      setIsEditing(false);
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await groupsService.getGroups();
      setGroups(res.data);
    } catch (err) {
      console.error('Failed to load groups', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSystemUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setSystemUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const loadMembers = async (groupId) => {
    try {
      const res = await groupsService.getMembers(groupId);
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to load members', err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await groupsService.createGroup({ name: newGroupName, description: newGroupDesc });
      setNewGroupName('');
      setNewGroupDesc('');
      loadGroups();
    } catch (err) {
      alert('Failed to create group');
    }
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    if (!selectedGroup) return;
    try {
      const res = await groupsService.updateGroup(selectedGroup.id, editForm);
      setSelectedGroup(res.data);
      setIsEditing(false);
      loadGroups();
    } catch (err) {
      alert('Failed to update group');
    }
  };

  const handleDeleteGroup = async (id) => {
    if (!window.confirm('Delete this group?')) return;
    try {
      await groupsService.deleteGroup(id);
      if (selectedGroup?.id === id) setSelectedGroup(null);
      loadGroups();
    } catch (err) {
      alert('Failed to delete group');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !selectedGroup) return;
    try {
      await groupsService.addMember(selectedGroup.id, selectedUserId);
      setSelectedUserId('');
      loadMembers(selectedGroup.id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await groupsService.removeMember(selectedGroup.id, userId);
      loadMembers(selectedGroup.id);
    } catch (err) {
      alert('Failed to remove member');
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 min-h-screen p-6">
      <div className="w-full space-y-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Users className="text-blue-600" size={32} /> User Groups
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Groups List */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Registry Groups</h3>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-black">{groups.length} Groups</span>
            </div>
            
            <form onSubmit={handleCreateGroup} className="mb-6 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <input required type="text" placeholder="New Group Name" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
              <input type="text" placeholder="Group Description" value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
              <button type="submit" className="w-full bg-slate-900 text-white rounded-xl py-3 text-xs font-black flex justify-center items-center gap-2 hover:bg-black shadow-lg transition-all">
                <Plus size={16} /> Create Group
              </button>
            </form>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : groups.map(g => (
                <div key={g.id} 
                     className={`p-4 rounded-2xl border cursor-pointer transition flex justify-between items-center group ${selectedGroup?.id === g.id ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100' : 'hover:bg-slate-50 border-slate-100 bg-white'}`}
                     onClick={() => setSelectedGroup(g)}>
                  <div className="flex-1 min-w-0">
                    <div className={`font-black text-sm truncate ${selectedGroup?.id === g.id ? 'text-white' : 'text-slate-800'}`}>{g.name}</div>
                    <div className={`text-[10px] font-bold truncate ${selectedGroup?.id === g.id ? 'text-blue-100' : 'text-slate-400'}`}>{g.description || 'No description provided'}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteGroup(g.id); }} className={`p-2 rounded-xl transition-all ${selectedGroup?.id === g.id ? 'text-white/50 hover:text-white hover:bg-white/10' : 'text-slate-300 hover:text-red-600 hover:bg-red-50'}`}>
                        <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Members List & Edit Section */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col min-h-[70vh]">
            {selectedGroup ? (
              <div className="flex flex-col h-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex-1 w-full">
                        {isEditing ? (
                            <form onSubmit={handleUpdateGroup} className="space-y-3 bg-blue-50 p-6 rounded-2xl border border-blue-100 animate-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Editing Group Identity</h4>
                                    <button type="button" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-black outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="Group Name" />
                                    <input type="text" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" placeholder="Description" />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="submit" className="bg-blue-600 text-white rounded-xl px-6 py-2.5 text-xs font-black flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                                        <Check size={16} /> Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-center justify-between group">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-black text-2xl text-slate-900">{selectedGroup.name}</h3>
                                        <button onClick={() => setIsEditing(true)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                            <Edit size={18} />
                                        </button>
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 mt-1">{selectedGroup.description || 'This group has no description yet.'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                         <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Member Enrollment</h4>
                         <span className="text-[10px] font-black text-slate-400 uppercase">{members.length} Active Members</span>
                    </div>

                    <form onSubmit={handleAddMember} className="flex flex-col md:flex-row gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex-1">
                            <Select
                                className="text-sm"
                                options={systemUsers.filter(u => !members.find(m => m.user_account_id === u.id)).map(u => ({ value: u.id, label: `${u.full_name} (${u.email})` }))}
                                value={selectedUserId ? { value: selectedUserId, label: systemUsers.find(u => u.id === selectedUserId)?.full_name } : null}
                                onChange={option => setSelectedUserId(option ? option.value : '')}
                                placeholder="-- Search Global User Directory --"
                                isClearable
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: '0.75rem',
                                        padding: '0.25rem',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: 'none',
                                        '&:hover': { border: '1px solid #cbd5e1' }
                                    })
                                }}
                            />
                        </div>
                        <button type="submit" className="bg-emerald-600 text-white rounded-xl px-6 py-3 text-xs font-black flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">
                            <UserPlus size={16} /> Enroll User
                        </button>
                    </form>

                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Identity</th>
                                    <th className="px-6 py-4">Credentials</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4 text-right">Access</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {members.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-300 italic font-bold">No members are currently enrolled in this group.</td></tr>
                                ) : members.map(m => (
                                    <tr key={m.user_account_id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="font-black text-slate-800 text-sm">{m.full_name}</div>
                                            <div className="text-[10px] font-bold text-slate-400">ID: {m.user_account_id.slice(0, 8)}...</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[10px] font-black text-blue-600">{m.username}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500">{m.email}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleRemoveMember(m.user_account_id)} className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                <X size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200">
                <Users size={80} className="mb-6 opacity-20" strokeWidth={1} />
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Governance & Membership</h4>
                <p className="text-xs font-bold text-slate-300 mt-2">Select a group from the registry to manage members and settings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
