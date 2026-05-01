// --- Bază de Date Fictivă (Mock Data) ---
export const mockPublicData = [
  { id: 1, year: '1', spec: 'Informatics', discipline: 'Programming 101', credits: 6, hours: 4, form: 'Full-time' },
  { id: 2, year: '2', spec: 'Mathematics', discipline: 'Calculus II', credits: 5, hours: 3, form: 'Full-time' },
  { id: 3, year: '3', spec: 'Physics', discipline: 'Quantum Mechanics', credits: 6, hours: 4, form: 'Part-time' },
];

export const mockStudents = [
  { id: '1001', name: 'Popescu Ion', group: '321A', year: '2', status: 'Active' },
  { id: '1002', name: 'Ionescu Maria', group: '321B', year: '2', status: 'Suspended' },
  { id: '1003', name: 'Dumitru Andrei', group: '311C', year: '1', status: 'Active' },
];

export const mockReports = [
  { id: '1001', name: 'Popescu Ion', discipline: 'Web Development', credits: 5, grade: '9', examDate: '2024-01-15' },
  { id: '1001', name: 'Popescu Ion', discipline: 'Databases', credits: 6, grade: '10', examDate: '2024-01-20' },
];

export const mockDocs = [
  { id: 'DOC-101', type: 'Scholarship Request', title: 'Merit Scholarship Q1', author: 'Popescu Ion', date: '2024-10-12', status: 'Pending' },
  { id: 'DOC-102', type: 'Medical Exemption', title: 'Absence Motivation', author: 'Ionescu Maria', date: '2024-10-15', status: 'Approved' },
];

export const mockUsers = [
  { username: 'admin.sys', name: 'System Admin', roles: 'Administrator', status: 'Active' },
  { username: 'prof.smith', name: 'John Smith', roles: 'Professor', status: 'Active' },
  { username: 'reg.office', name: 'Jane Doe', roles: 'Registrar', status: 'Active' },
];

export const mockAudit = [
  { time: '2024-10-24 10:23', user: 'prof.smith', action: 'Update Grade', entity: 'Student 1001', before: 'Grade: 8', after: 'Grade: 9' },
  { time: '2024-10-24 09:15', user: 'admin.sys', action: 'Create User', entity: 'User prof.smith', before: '-', after: 'Created' },
];

export const mockBackups = [
  { time: '2024-10-24 00:00', creator: 'System', desc: 'Daily Auto-Backup' },
  { time: '2024-10-17 00:00', creator: 'System', desc: 'Weekly Full Backup' },
];

export const mockQueries = [
  { id: 'Q-991', time: '10:24:01', user: 'prof.smith', query: 'SELECT * FROM grades WHERE student_id=1001', duration: '12ms', status: 'Success' },
  { id: 'Q-992', time: '10:24:05', user: 'admin.sys', query: 'UPDATE users SET roles="Admin" WHERE id=5', duration: '45ms', status: 'Success' },
  { id: 'Q-993', time: '10:25:00', user: 'System', query: 'BACKUP DATABASE afsms_db', duration: '1500ms', status: 'Running' },
];
