import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (username) => api.post('/auth/login', { username }),
};

export const lookupService = {
  getAcademicYears: () => api.get('/lookup/academic-years'),
  getSpecializations: () => api.get('/lookup/specializations'),
  getStudyFormations: () => api.get('/lookup/study-formations'),
  getDisciplines: () => api.get('/lookup/disciplines'),
};

export const academicService = {
  getStudents: () => api.get('/academic/students'),
  getGrades: () => api.get('/academic/grades'),
  updateGrade: (id, data) => api.put(`/academic/grades/${id}`, data),
};

export default api;
