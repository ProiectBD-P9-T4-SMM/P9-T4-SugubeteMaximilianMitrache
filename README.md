# Automated Faculty Student Management System (AFSMS)

> **Romanian Project Name:** Gestiunea Automată a Studenților Facultății (GASF)

> <p>Authors:</p>
> <p>Sugubete Andrei CR3.2B</p>
> <p>Maximilian Andrei CR3.2B</p>
> <p>Mitrache Marian Nicușor CR3.2B</p>

[![LaTeX](https://github.com/andreisugu/AFSMS/actions/workflows/latex-release.yml/badge.svg)](https://github.com/andreisugu/AFSMS/actions/workflows/latex-release.yml) [![Website](https://github.com/andreisugu/AFSMS/actions/workflows/deploy.yml/badge.svg)](https://github.com/andreisugu/AFSMS/actions/workflows/deploy.yml)

---

🌐 **[Visit the Website](https://andreisugu.github.io/AFSMS/)**

### 📚 Documentation

| Link | Description |
|---|---|
| [View Latest Releases](https://github.com/andreisugu/AFSMS/releases) | All compiled PDF versions |
| [Download main.pdf](https://github.com/andreisugu/AFSMS/releases/latest/download/main.pdf) | Complete system specification |
| [Download main_revised.pdf](https://github.com/andreisugu/AFSMS/releases/latest/download/main_revised.pdf) | Revised documentation |

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
    <td align="center"><img src="docs/diagrame/Web%20Portal%20-%20System%20Use%20Case%20Diagram.png" alt="Web Portal - System Use Case Diagram" width="300"/><br/><sub>Use Case Diagram</sub></td>
    <td align="center"><img src="docs/diagrame/Web%20Portal%20-%20Access%20Management.png" alt="Web Portal - Access Management" width="300"/><br/><sub>Access Management</sub></td>
    <td align="center"><img src="docs/diagrame/Document%20Workflow%20and%20Search%20-%20Management%20Interface.png" alt="Document Workflow and Search" width="300"/><br/><sub>Document Workflow</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/diagrame/Audit%20Logging%20and%20Data%20Recovery%20-%20Rollback.png" alt="Audit Logging and Data Recovery" width="300"/><br/><sub>Audit Logging & Recovery</sub></td>
    <td align="center"><img src="docs/diagrame/Mockup%20-%20Login%20Screen.png" alt="Login Screen" width="300"/><br/><sub>Login Screen</sub></td>
    <td align="center"><img src="docs/diagrame/Mockup%20-%20Dashboard.png" alt="Dashboard" width="300"/><br/><sub>Dashboard</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/diagrame/Mockup%20-%20Students%20and%20Curiccula.png" alt="Students and Curricula" width="300"/><br/><sub>Students & Curricula</sub></td>
    <td align="center"><img src="docs/diagrame/Mockup%20-%20Documents%20and%20Workflow.png" alt="Documents and Workflow" width="300"/><br/><sub>Documents & Workflow</sub></td>
    <td align="center"><img src="docs/diagrame/Mockup%20-%20Egrade%20centralizer.png" alt="E-Grade Centralizer" width="300"/><br/><sub>E-Grade Centralizer</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/diagrame/Mockup%20-%20Administration%20and%20Audit%20-%20User%20roles.png" alt="User Roles" width="300"/><br/><sub>User Roles</sub></td>
    <td align="center"><img src="docs/diagrame/Mockup%20-%20Administration%20and%20Audit%20-%20Audit%20Log.png" alt="Audit Log" width="300"/><br/><sub>Audit Log</sub></td>
    <td align="center"><img src="docs/diagrame/Mockup%20-%20Administration%20and%20Audit%20-%20Query%20Monitor.png" alt="Query Monitor" width="300"/><br/><sub>Query Monitor</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/diagrame/Mockup%20-%20Adminstration%20and%20Audit%20-%20Rollback.png" alt="Rollback" width="300"/><br/><sub>Rollback</sub></td>
    <td align="center"><img src="docs/diagrame/Reporting%20and%20Export%20-%20Egrade%20Centralizer.png" alt="Reporting and Export" width="300"/><br/><sub>Reporting & Export</sub></td>
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

* **Frontend / Client:** Responsive Web Application built with **React** + **Vite** + **Tailwind CSS v4**. Optimized with dropdowns (selection lists) to minimize manual data entry errors.
* **Authentication:** Institutional Single Sign-On (SAML 2.0 / OAuth 2.0).
* **Database (DBMS):** Relational Database (e.g., MySQL 8.0+ or PostgreSQL 15+) supporting robust transaction logging, complex queries, and point-in-time recovery.
* **Integrations:**
  * Microsoft Graph API (Excel/Outlook)
  * PDF Rendering Engine (e.g., iText or TCPDF)

## 🔒 Security & Safety Guidelines

* **Traffic:** All data in transit is encrypted via HTTPS (TLS 1.2+).
* **Access Control:** Strict role-based access control (RBAC). A standalone credential database is avoided in favor of institutional SSO.
* **Data Integrity:** The system prevents saving invalid data at the UI module level. All successful CRUD operations are permanently logged for auditing.

---

## 🚀 Getting Started (Development Setup)

### Prerequisites

* [Node.js](https://nodejs.org/) v18+ and npm
* Modern web browser (Chrome 100+, Firefox 100+, Safari, Edge)
* Relational Database Management System (MySQL/PostgreSQL)
* Access to Institutional SSO Provider (for local testing, an SSO mock can be used)
* Microsoft API Keys (if testing Outlook/Excel integrations)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/andreisugu/AFSMS.git
   ```

2. Navigate to the project directory and install dependencies:
   ```bash
   cd AFSMS
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173/`.

4. Build for production:
   ```bash
   npm run build
   ```

### Live Demo

The latest `main` branch is automatically deployed via GitHub Actions to GitHub Pages:

🔗 **https://andreisugu.github.io/AFSMS/**

## 📚 Documentation

Comprehensive documentation mapping directly to the IEEE 830-1998 Software Requirements Specification (SRS) standards is available for this project.

* **Registrar Operations Manual:** Step-by-step guides for workflow and reporting.
* **Professor Quick Start Guide:** Instructions for grade entry and student communication.
* **Administrator Guide:** Setup, backups, and point-in-time recovery processes.

## 📄 License

This project is licensed under the [MIT License](LICENSE) — see the LICENSE file for details. *(Update according to university/institutional policies).*
