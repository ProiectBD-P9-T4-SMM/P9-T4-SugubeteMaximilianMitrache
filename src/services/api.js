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
};

export const reportsService = {
  getCentralizer: (params) => api.get('/reports/centralizer', { params }),
};

export const documentsService = {
  getDocuments: (params) => api.get('/documents', { params }),
  updateStatus: (id, status) => api.put(`/documents/${id}/status`, { status }),
  uploadDocument: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  downloadDocument: (id) => api.get(`/documents/download/${id}`, { responseType: 'blob' }),
  deleteDocument: (id) => api.delete(`/documents/${id}`)
};

export const notificationsService = {
  sendGroupEmail: (data) => api.post('/notifications/send', data),
};

export const auditService = {
  getLogs: () => api.get('/audit'),
  rollback: (logId) => api.post(`/audit/rollback/${logId}`),
};

export const adminService = {
  getRoles: () => api.get('/admin/roles'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, roleId) => api.put(`/admin/users/${id}/role`, { roleId }),
  getActiveQueries: () => api.get('/admin/queries'),
  getBackups: () => api.get('/admin/backups'),
  createBackup: () => api.post('/admin/backups/create'),
  restoreBackup: (filename) => api.post('/admin/backups/restore', { filename })
};

export const publicService = {
  getCurricula: () => axios.get(`${API_URL}/public/curricula`)
};

export default api;
