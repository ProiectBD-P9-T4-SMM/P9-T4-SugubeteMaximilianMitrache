# Automated Faculty Student Management System (AFSMS)

> **Romanian Project Name:** Gestiunea Automată a Studenților Facultății (GASF)

> <p>Authors:</p>
> <p>Sugubete Andrei CR3.2B</p>
> <p>Maximilian Andrei CR3.2B</p>
> <p>Mitrache Marian Nicușor CR3.2B</p>

[![LaTeX](https://github.com/ProiectBD-P9-T4-SMM/P9-T4-SugubeteMaximilianMitrache/actions/workflows/latex-release.yml/badge.svg)](https://github.com/ProiectBD-P9-T4-SMM/P9-T4-SugubeteMaximilianMitrache/actions/workflows/latex-release.yml) [![Website](https://github.com/ProiectBD-P9-T4-SMM/P9-T4-SugubeteMaximilianMitrache/actions/workflows/deploy.yml/badge.svg)](https://github.com/ProiectBD-P9-T4-SMM/P9-T4-SugubeteMaximilianMitrache/actions/workflows/deploy.yml)

---

🌐 **[Visit the Website](https://ProiectBD-P9-T4-SMM.github.io/P9-T4-SugubeteMaximilianMitrache/)**

### 📚 Documentation

| Link | Description |
|---|---|
| [View Latest Releases](https://github.com/ProiectBD-P9-T4-SMM/P9-T4-SugubeteMaximilianMitrache/releases) | All compiled PDF versions |
| [Download main.pdf](https://github.com/ProiectBD-P9-T4-SMM/P9-T4-SugubeteMaximilianMitrache/releases/latest/download/main.pdf) | Complete system specification |
| [Download main_revised.pdf](https://github.com/ProiectBD-P9-T4-SMM/P9-T4-SugubeteMaximilianMitrache/releases/latest/download/main_revised.pdf) | Revised documentation |

---

## 📖 Overview

The **Automated Faculty Student Management System (AFSMS)** is a comprehensive, secure, web-based platform designed to digitalize and optimize the administrative and educational workflows within a university faculty.

Moving away from manual paperwork, AFSMS provides centralized management of academic curricula, student formations, examination grading, and administrative document circulation. By integrating natively with Microsoft Office and institutional Single Sign-On (SSO), it drastically reduces administrative overhead for the registrar's office while providing real-time transparency for students and teaching staff.

## ✨ Key Features

* **Role-Based Web Portal:** Dual perspectives including a **Public Portal** for general information (curricula, schedules) and a secure **Private Portal** (authenticated via SSO) for tailored academic operations.
* **Advanced Academic Data Management:** Bulk import, validate, and manage data corresponding to curricula (study plans), study formations, and student enrollments.
* **Automated Reporting & Export:** Instantly generate official standardized documents, such as the *e-Grade Centralizer* (e-Centralizatorul de note) and *e-Transcript* (e-Registrul matricol). Export formats include `.CSV`, `.XML`, `.XLS`, and secure `.PDF`.
* **Document Workflow Management:** Route electronic documents within the secretariat for information, approval, or modification. Features advanced search by file type, creation date, author, or content.
* **Audit Logging & Point-in-Time Recovery:** Comprehensive, append-only activity logging tracking "who did what and when." Features built-in database rollback and offline backup capabilities to prevent and correct data collection errors safely.
* **Microsoft Ecosystem Integration:** Seamless bidirectional integration with **Microsoft Excel** for bulk data operations and **Microsoft Outlook** (via Graph API/SMTP) for mass group communications.

## System Diagrams & Mockups


<table>
  <tr>
    <td align="center"><img src="docs/diagrams/Web%20Portal%20-%20System%20Use%20Case%20Diagram.png" alt="Web Portal - System Use Case Diagram" width="300"/><br/><sub>Use Case Diagram</sub></td>
    <td align="center"><img src="docs/diagrams/Web%20Portal%20-%20Access%20Management.png" alt="Web Portal - Access Management" width="300"/><br/><sub>Access Management</sub></td>
    <td align="center"><img src="docs/diagrams/Document%20Workflow%20and%20Search%20-%20Management%20Interface.png" alt="Document Workflow and Search" width="300"/><br/><sub>Document Workflow</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/diagrams/Audit%20Logging%20and%20Data%20Recovery%20-%20Rollback.png" alt="Audit Logging and Data Recovery" width="300"/><br/><sub>Audit Logging & Recovery</sub></td>
    <td align="center"><img src="docs/diagrams/Mockup%20-%20Login%20Screen.png" alt="Login Screen" width="300"/><br/><sub>Login Screen</sub></td>
    <td align="center"><img src="docs/diagrams/Mockup%20-%20Dashboard.png" alt="Dashboard" width="300"/><br/><sub>Dashboard</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/diagrams/Mockup%20-%20Students%20and%20Curiccula.png" alt="Students and Curricula" width="300"/><br/><sub>Students & Curricula</sub></td>
    <td align="center"><img src="docs/diagrams/Mockup%20-%20Documents%20and%20Workflow.png" alt="Documents and Workflow" width="300"/><br/><sub>Documents & Workflow</sub></td>
    <td align="center"><img src="docs/diagrams/Mockup%20-%20Egrade%20centralizer.png" alt="E-Grade Centralizer" width="300"/><br/><sub>E-Grade Centralizer</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/diagrams/Mockup%20-%20Administration%20and%20Audit%20-%20User%20roles.png" alt="User Roles" width="300"/><br/><sub>User Roles</sub></td>
    <td align="center"><img src="docs/diagrams/Mockup%20-%20Administration%20and%20Audit%20-%20Audit%20Log.png" alt="Audit Log" width="300"/><br/><sub>Audit Log</sub></td>
    <td align="center"><img src="docs/diagrams/Mockup%20-%20Administration%20and%20Audit%20-%20Query%20Monitor.png" alt="Query Monitor" width="300"/><br/><sub>Query Monitor</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/diagrams/Mockup%20-%20Adminstration%20and%20Audit%20-%20Rollback.png" alt="Rollback" width="300"/><br/><sub>Rollback</sub></td>
    <td align="center"><img src="docs/diagrams/Reporting%20and%20Export%20-%20Egrade%20Centralizer.png" alt="Reporting and Export" width="300"/><br/><sub>Reporting & Export</sub></td>
    <td></td>
  </tr>
</table>

## �👥 User Roles

1. **Registrar / Secretariat Staff:** Heavy users managing academic records, generating reports, and overseeing document workflows.
2. **Professors / Teaching Staff:** Enter grades and communicate with student groups during exam sessions.
3. **Students:** Read-only access to their personal academic standing, grades, and schedules.
4. **System Administrators:** IT staff handling system configuration, SSO integration, role assignments, and database recovery.
5. **General Public:** Unauthenticated guests viewing public faculty information.

---

## 🏗️ Architecture & Technologies

AFSMS uses a scalable client-server architecture designed to handle concurrent user spikes during peak exam sessions while strictly adhering to EU GDPR regulations.

* **Frontend / Client:** Responsive Web Application built with **React 19** + **Vite** + **Tailwind CSS v4**. Optimized with dropdowns (selection lists) to minimize manual data entry errors.
* **Backend / API:** **Node.js** + **Express 5** REST API server (default port `3000`). Connects to the database via the `pg` driver.
* **Authentication:** **Mock SSO (JWT-based)** for development and testing (built-in, no external provider required). Designed to be replaced with institutional SSO in production.
* **Database (DBMS):** **PostgreSQL 15+** — supports robust transaction logging, complex queries, and point-in-time recovery.
* **Email Notifications:** Configurable via `EMAIL_PROVIDER` environment variable — three supported modes:
  * `mock` (default, Ethereal) — captures emails locally without sending real messages.
  * `graph` — Microsoft Graph API for production bulk email (requires Azure AD app registration).
  * `smtp` — classic SMTP fallback (compatible with Office 365, Gmail, on-premise servers).
* **Integrations:**
  * Microsoft Graph API (bulk email via `$batch`)
  * PDF generation (jsPDF + jsPDF-AutoTable)
  * CSV / XLS import & export (PapaParse, xlsx)

## ⚡ Performance & Quality Assurance

To meet the rigorous standards of the university environment, AFSMS v1.0 implements formalized performance benchmarks and an extensive automated testing suite.

### Performance Benchmarks (SRS v1.0)
* **Simultaneous Capacity:** Support for up to **200 concurrent users** during peak exam sessions.
* **Report Load Time:** 95% of report generation requests (PDF/XLS) complete in **< 3000ms**.
* **Data Commitment:** Registry updates and grade entries are processed in **< 1000ms**.
* **System Uptime:** Designed for 99.9% availability during active semesters.

### Testing & Coverage
AFSMS uses **Jest** for automated unit and integration testing.
* **Mandated Coverage:** Minimum 80% (per SRS NFR-AFSMS-QUAL-005).
* **Current Coverage:** **~90%** statements and lines (83% branches/functions) — covering the Audit Service and Auth Middleware (`backend/tests/core.test.js`).
* **Verify Tests:**
  ```bash
  cd backend && npm test -- --coverage
  ```

### Coding Standards
The project adheres to strict coding standards (**CODE-01 to CODE-10**):
* Single Responsibility Principle (SRP) for all service functions.
* Consistent `camelCase` for variables and `PascalCase` for classes.
* Comprehensive audit logging for every state-changing operation.


## 🔒 Security & Safety Guidelines

* **Traffic:** All data in transit is encrypted via HTTPS (TLS 1.2+).
* **Access Control:** Strict role-based access control (RBAC). A standalone credential database is avoided in favor of institutional SSO.
* **Data Integrity:** The system prevents saving invalid data at the UI module level. All successful CRUD operations are permanently logged for auditing.

---

## 🚀 Getting Started (Development Setup)

### Prerequisites

* [Node.js](https://nodejs.org/) v20+ and npm
* Modern web browser (Chrome 100+, Firefox 100+, Safari, Edge)
* [PostgreSQL 15+](https://www.postgresql.org/) database server

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ProiectBD-P9-T4-SMM/P9-T4-SugubeteMaximilianMitrache.git
   cd P9-T4-SugubeteMaximilianMitrache
   ```

2. **Frontend** — install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173/P9-T4-SugubeteMaximilianMitrache/`.

3. **Backend** — install dependencies and start the API server:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory (see `docs/Email_Configuration_Guide.md` for email options):
   ```env
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/afsms
   JWT_SECRET=your_jwt_secret
   EMAIL_PROVIDER=mock
   ```
   Then start the server:
   ```bash
   npm run dev   # development (nodemon)
   # or
   npm start     # production
   ```
   The API will be available at `http://localhost:3000/`.

4. **Database** — apply the schema and seed data:
   ```bash
   psql -d afsms -f src/schema.sql
   psql -d afsms -f src/seed.sql
   ```

5. Build the frontend for production:
   ```bash
   npm run build
   ```

### Live Demo

The latest `main` branch is automatically deployed via GitHub Actions to GitHub Pages:

🔗 **https://ProiectBD-P9-T4-SMM.github.io/P9-T4-SugubeteMaximilianMitrache/**

## 📚 Documentation

Comprehensive documentation mapping directly to the IEEE 830-1998 Software Requirements Specification (SRS) standards is available for this project.

* **Registrar Operations Manual:** Step-by-step guides for workflow and reporting.
* **Professor Quick Start Guide:** Instructions for grade entry and student communication.
* **Administrator Guide:** Setup, backups, and point-in-time recovery processes.

## 📄 License

This project is licensed under the [MIT License](LICENSE) — see the LICENSE file for details. *(Update according to university/institutional policies).*
