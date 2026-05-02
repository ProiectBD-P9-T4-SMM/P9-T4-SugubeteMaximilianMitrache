import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('afsms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (username) => api.post('/auth/login', { username }),
  register: (data) => api.post('/auth/register', data),
};

export const lookupService = {
  getAcademicYears: () => api.get('/lookup/academic-years'),
  getSpecializations: () => api.get('/academic/specializations'),
  getStudyFormations: () => api.get('/lookup/study-formations'),
  getDisciplines: () => api.get('/lookup/disciplines'),
};

export const academicService = {
  getStudents: () => api.get('/academic/students'),
  addStudent: (data) => api.post('/academic/students', data),
  updateStudent: (id, data) => api.put(`/academic/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/academic/students/${id}`),
  addStudentsBulk: (students) => api.post('/academic/students/bulk', { students }),
  getGrades: () => api.get('/academic/grades'),
  addGrade: (data) => api.post('/academic/grades', data),
  updateGrade: (id, data) => api.put(`/academic/grades/${id}`, data),
  getCurricula: () => api.get('/academic/curricula'),
  getStudentEnrollments: (studentId) => api.get(`/academic/student-enrollments/${studentId}`),
  enrollStudent: (data) => api.post('/academic/enroll-student', data),
  updateEnrollmentFormation: (data) => api.post('/academic/update-enrollment-formation', data),
  unenrollStudent: (studentId, curriculumId) => api.delete(`/academic/unenroll-student/${studentId}/${curriculumId}`),
  exportGrades: (params) => api.get('/academic/grades/export', { params, responseType: 'blob' }),
  importGrades: (formData) => api.post('/academic/grades/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getGradeTemplate: (params) => api.get('/academic/grades/template', { params, responseType: 'blob' }),
};

export const reportsService = {
  getCentralizer: (params) => api.get('/reports/centralizer', { params }),
};

export const documentsService = {
  getDocuments: (params) => api.get('/documents', { params }),
  updateStatus: (id, status) => api.put(`/documents/${id}/status`, { status }),
  forwardDocument: (id, userId) => api.put(`/documents/${id}/forward`, { userId }),
  uploadDocument: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  downloadDocument: (id) => api.get(`/documents/download/${id}`, { responseType: 'blob' }),
  deleteDocument: (id) => api.delete(`/documents/${id}`)
};

export const groupsService = {
  getGroups: () => api.get('/groups'),
  createGroup: (data) => api.post('/groups', data),
  updateGroup: (id, data) => api.put(`/groups/${id}`, data),
  deleteGroup: (id) => api.delete(`/groups/${id}`),
  getMembers: (id) => api.get(`/groups/${id}/members`),
  addMember: (id, userId) => api.post(`/groups/${id}/members`, { userId }),
  removeMember: (id, userId) => api.delete(`/groups/${id}/members/${userId}`),
};

export const notificationsService = {
  sendGroupEmail: (data) => api.post('/notifications/send', data),
};

export const auditService = {
  getLogs: (params) => api.get('/audit', { params }),
  rollback: (logId) => api.post(`/audit/rollback/${logId}`),
  pitr: (targetTimestamp) => api.post('/audit/pitr', { targetTimestamp }),
};

export const adminService = {
  getRoles: () => api.get('/admin/roles'),
  createRole: (data) => api.post('/admin/roles', data),
  updateRole: (id, data) => api.put(`/admin/roles/${id}`, data),
  deleteRole: (id) => api.delete(`/admin/roles/${id}`),
  
  getUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateUserRole: (id, roleId) => api.put(`/admin/users/${id}/role`, { roleId }),
  
  getActiveQueries: () => api.get('/admin/queries'),
  getEmailLogs: () => api.get('/admin/emails'),
  getBackups: () => api.get('/admin/backups'),
  getBackupConfig: () => api.get('/admin/backups/config'),
  updateBackupConfig: (data) => api.put('/admin/backups/config', data),
  createBackup: () => api.post('/admin/backups/create'),
  restoreBackup: (filename) => api.post('/admin/backups/restore', { filename }),
  downloadBackup: (filename) => api.get(`/admin/backups/download/${filename}`, { responseType: 'blob' }),
  triggerAuditArchiving: () => api.post('/admin/audit/archive')
};

export const configService = {
  getSettings: () => api.get('/config/settings'),
  updateSettings: (data) => api.put('/config/settings', data),
  getAcademicYears: () => api.get('/config/academic-years'),
  createAcademicYear: (data) => api.post('/config/academic-years', data),
  updateAcademicYear: (id, data) => api.put(`/config/academic-years/${id}`, data),
  deleteAcademicYear: (id) => api.delete(`/config/academic-years/${id}`),
  getSpecializations: () => api.get('/config/specializations'),
  createSpecialization: (data) => api.post('/config/specializations', data),
  updateSpecialization: (id, data) => api.put(`/config/specializations/${id}`, data),
  deleteSpecialization: (id) => api.delete(`/config/specializations/${id}`),
};

export const publicService = {
  getCurricula: () => axios.get(`${API_URL}/public/curricula`)
};

export default api;
