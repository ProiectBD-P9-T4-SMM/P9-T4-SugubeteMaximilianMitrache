import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, UserPlus, X } from 'lucide-react';
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGroups();
    loadSystemUsers();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadMembers(selectedGroup.id);
    } else {
      setMembers([]);
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
    <div className="flex-1 bg-slate-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Users className="text-blue-600" size={40} /> User Groups
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Groups List */}
          <div className="md:col-span-1 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4">Groups</h3>
            
            <form onSubmit={handleCreateGroup} className="mb-6 space-y-3">
              <input required type="text" placeholder="Group Name" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} className="w-full p-2 border rounded text-sm" />
              <input type="text" placeholder="Description" value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} className="w-full p-2 border rounded text-sm" />
              <button type="submit" className="w-full bg-blue-600 text-white rounded p-2 text-sm font-bold flex justify-center items-center gap-2">
                <Plus size={16} /> Create Group
              </button>
            </form>

            <div className="space-y-2">
              {loading ? <p className="text-sm text-slate-500">Loading...</p> : groups.map(g => (
                <div key={g.id} 
                     className={`p-3 rounded-xl border cursor-pointer transition flex justify-between items-center ${selectedGroup?.id === g.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50 border-transparent'}`}
                     onClick={() => setSelectedGroup(g)}>
                  <div>
                    <div className="font-bold text-slate-800">{g.name}</div>
                    <div className="text-xs text-slate-500">{g.description}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteGroup(g.id); }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Members List */}
          <div className="md:col-span-2 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
            {selectedGroup ? (
              <>
                <h3 className="font-bold text-xl mb-2">{selectedGroup.name} - Members</h3>
                <p className="text-sm text-slate-500 mb-6">{selectedGroup.description}</p>

                <form onSubmit={handleAddMember} className="flex gap-3 mb-6">
                  <Select
                    className="flex-1 text-sm"
                    options={systemUsers.filter(u => !members.find(m => m.user_account_id === u.id)).map(u => ({ value: u.id, label: `${u.full_name} (${u.email})` }))}
                    value={selectedUserId ? { value: selectedUserId, label: systemUsers.find(u => u.id === selectedUserId)?.full_name } : null}
                    onChange={option => setSelectedUserId(option ? option.value : '')}
                    placeholder="-- Search User to Add --"
                    isClearable
                  />
                  <button type="submit" className="bg-emerald-600 text-white rounded px-4 py-2 text-sm font-bold flex items-center gap-2">
                    <UserPlus size={16} /> Add Member
                  </button>
                </form>

                <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600 font-bold">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Username</th>
                        <th className="p-3">Email</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {members.length === 0 ? (
                        <tr><td colSpan="4" className="p-4 text-center text-slate-500">No members yet.</td></tr>
                      ) : members.map(m => (
                        <tr key={m.user_account_id}>
                          <td className="p-3 font-medium">{m.full_name}</td>
                          <td className="p-3 text-slate-500">{m.username}</td>
                          <td className="p-3 text-slate-500">{m.email}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleRemoveMember(m.user_account_id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Users size={64} className="mb-4 opacity-50" />
                <p>Select a group to view and manage its members</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
