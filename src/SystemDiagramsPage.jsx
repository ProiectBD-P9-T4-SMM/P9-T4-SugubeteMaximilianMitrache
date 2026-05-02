import React, { useState, useCallback, useEffect } from 'react';

// List of all PNG diagrams by category

const BASE = import.meta.env.BASE_URL || '/P9-T4-SugubeteMaximilianMitrache/';
const coreDiagrams = [
  {
    category: 'Use Case',
    files: [
      'diagrams/core/use-case/use-case_v1.svg',
      'diagrams/core/use-case/use-case_v2.svg',
      'diagrams/core/use-case/use-case_v3.svg',
      'diagrams/core/use-case/use-case_v1.png',
      'diagrams/core/use-case/use-case_v2_secretariat_workflow.png',
      'diagrams/core/use-case/use-case_v3_secretariat_workflow.png',
    ],
    display: [
      {
        file: 'diagrams/core/use-case/use-case_v1.svg',
        title: 'AFSMS High-Level System Overview',
        description:
          'Maps all system actors — Visitor, Student, Professor, Registrar, and Admin — to their respective modules. Highlights SSO as the central authentication gateway included by all authenticated roles. Audit Logging underpins Reporting, Document Workflow, and User Group management as a cross-cutting dependency.',
      },
      {
        file: 'diagrams/core/use-case/use-case_v2.svg',
        title: 'Secretariat Deep-Dive',
        description:
          'Focuses exclusively on the Registrar\'s operational scope within the system. Covers curricula management, Excel-based data import, e-Grade Centralizer generation, and group messaging. Microsoft Excel and Outlook integrations are modeled as included subsystems tied to data and communication actions.',
      },
      {
        file: 'diagrams/core/use-case/use-case_v3.svg',
        title: 'Student & Professor Interactions',
        description:
          'Defines the academic-facing use cases shared between teaching staff and students. Professors handle grade editing and study formation views, while students access grades, documents, and reports. A validation error extension on grade editing enforces data integrity during faculty input.',
      },
    ],
  },
  {
    category: 'Activity',
    files: [
      'diagrams/core/activity/activity_v1.svg',
      'diagrams/core/activity/activity_v2.svg',
      'diagrams/core/activity/activity_v3.svg',
      'diagrams/core/activity/activity_v1.png',
      'diagrams/core/activity/activity_v2.png',
      'diagrams/core/activity/activity_v3.png',
    ],
    display: [
      {
        file: 'diagrams/core/activity/activity_v1.svg',
        title: 'Document Submission & Routing',
        description:
          'Traces a document\'s lifecycle from user submission through portal validation to server-side routing. The AFSMS server determines whether the document is informational, pending approval, or requires modification, then commits the state to the database. Audit logging and Outlook notifications are triggered asynchronously post-commit.',
      },
      {
        file: 'diagrams/core/activity/activity_v2.svg',
        title: 'Grade Report Generation',
        description:
          'Describes the end-to-end flow for generating a student grade centralizer report. The system validates data completeness after retrieval, sorts results alphabetically, and presents them in tabular form. Users then select an export format — PDF, XLS, or CSV — to download the final report.',
      },
      {
        file: 'diagrams/core/activity/activity_v3.svg',
        title: 'Admin Rollback Operation',
        description:
          'Outlines the privileged workflow for reverting the system to a prior state T-1. Admin privileges are verified before audit log access is granted and a target state is selected. Rollback success or failure is explicitly handled, with the outcome recorded in the audit log either way.',
      },
    ],
  },
  {
    category: 'Sequence',
    files: [
      'diagrams/core/sequence/sequence_v1.svg',
      'diagrams/core/sequence/sequence_v2.svg',
      'diagrams/core/sequence/sequence_v3.svg',
      'diagrams/core/sequence/sequence_v1.png',
      'diagrams/core/sequence/sequence_v2.png',
      'diagrams/core/sequence/sequence_v3.png',
    ],
    display: [
      {
        file: 'diagrams/core/sequence/sequence_v1.svg',
        title: 'SSO Authentication State Diagram',
        description:
          'Models the full authentication lifecycle from unauthenticated public access through SSO redirect to role assignment. Token validation via SAML/OAuth gates entry into the private zone, with invalid or expired tokens redirected to an access-denied boundary. Unauthorized roles are similarly denied and looped back to the login screen.',
      },
      {
        file: 'diagrams/core/sequence/sequence_v2.svg',
        title: 'RBAC User Registration & Access Flow',
        description:
          'Illustrates how a user moves from registration to restricted action execution under role-based access control. The system assigns predefined rights at registration, blocks insufficient privilege attempts, and allows an admin to customize the RBAC profile. Once updated, the user retries the action with elevated permissions.',
      },
      {
        file: 'diagrams/core/sequence/sequence_v3.svg',
        title: 'Unauthorized Access Attempt',
        description:
          'Simulates a student attempting to access a Registrar-restricted URL within an active authenticated session. Security middleware intercepts the HTTP request and evaluates it against the RBAC matrix, resulting in a 403 rejection. The violation is logged to the audit database and the user is force-navigated to a safe dashboard.',
      },
    ],
  },
  {
    category: 'Role-Based Access Control',
    files: [
      'diagrams/core/role-based-access-control/rbac_v1.svg',
      'diagrams/core/role-based-access-control/rbac_v2.svg',
      'diagrams/core/role-based-access-control/rbac_v3.svg',
      'diagrams/core/role-based-access-control/rbac_v1.png',
      'diagrams/core/role-based-access-control/rbac_v2.png',
      'diagrams/core/role-based-access-control/rbac_v3.png',
    ],
    display: [
      {
        file: 'diagrams/core/role-based-access-control/rbac_v1.svg',
        title: 'RBAC Core Class Diagram',
        description:
          'Defines the structural data model underpinning the access control system. Users own accounts, accounts issue session tokens and are assigned roles, and roles contain permissions. Permissions in turn govern access to specific system modules, forming a clean least-privilege hierarchy.',
      },
      {
        file: 'diagrams/core/role-based-access-control/rbac_v2.svg',
        title: 'RBAC Request Authorization Workflow',
        description:
          'Details the runtime access decision process for every incoming system request. A valid session token triggers role and permission queries, which are mapped against the requested module and action. Both allowed and denied outcomes feed into a centralized audit trail before the workflow concludes.',
      },
      {
        file: 'diagrams/core/role-based-access-control/rbac_v3.svg',
        title: 'Professor & Student Permission Instance Diagram',
        description:
          'Provides a concrete runtime example of two roles operating on the same academic record. The Professor account holds UPDATE permission on Academic Records, while the Student account is limited to READ on their own record. An explicit denial arrow from the Student account to the Write permission enforces the least-privilege principle visually.',
      },
    ],
  },
];


export default function SystemDiagramsPage() {
  // Flatten all images for modal navigation
  const allImages = coreDiagrams.flatMap((group) =>
    group.display.map((item, idx) => ({
      src: BASE + item.file,
      label: `${group.category} - ${item.file.split('/').pop()}`,
      title: item.title,
      description: item.description,
      group: group.category,
      idx,
    }))
  );

  const [modalIdx, setModalIdx] = useState(null); // null = closed, else index in allImages
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  // Keyboard navigation and zoom
  const handleKeyDown = useCallback(
    (e) => {
      if (modalIdx === null) return;
      if (e.key === 'Escape') setModalIdx(null);
      if (e.key === 'ArrowLeft') setModalIdx((i) => (i > 0 ? i - 1 : allImages.length - 1));
      if (e.key === 'ArrowRight') setModalIdx((i) => (i < allImages.length - 1 ? i + 1 : 0));
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.2, 5));
      if (e.key === '-') setZoom((z) => Math.max(z - 0.2, 0.2));
      if (e.key === '0') { setZoom(1); setOffset({ x: 0, y: 0 }); }
    },
    [modalIdx, allImages.length]
  );
  useEffect(() => {
    if (modalIdx !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [modalIdx, handleKeyDown]);

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">System Architecture Diagrams</h2>
      <p className="text-slate-600 mb-8">Official AFSMS process logic and architectural blueprints. Click any image to view fullscreen and use ←/→ to navigate.</p>
      {coreDiagrams.map((group) => (
        <div key={group.category} className="mb-10">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">{group.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.display.map((item, idx) => {
              const imgSrc = BASE + item.file;
              const globalIdx = allImages.findIndex((img) => img.src === imgSrc);
              return (
                <div key={item.file} className="bg-white rounded-lg shadow border border-slate-200 p-4 flex flex-col items-center">
                  <img
                    src={imgSrc}
                    alt={`${group.category} Diagram ${idx + 1}`}
                    className="max-w-full max-h-80 object-contain mb-3 cursor-pointer transition hover:scale-105"
                    onClick={() => setModalIdx(globalIdx)}
                  />
                  <p className="text-sm font-semibold text-slate-700 text-center mb-1">{item.title}</p>
                  <p className="text-xs text-slate-500 text-center leading-relaxed mb-2">{item.description}</p>
                  <span className="text-xs text-slate-400 break-all">{item.file.split('/').pop()}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Fullscreen Modal */}
      {modalIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setModalIdx(null)}
        >
          <button
            className="absolute top-4 right-6 text-3xl font-bold bg-white bg-opacity-90 text-black rounded shadow-lg px-3 py-1 hover:bg-opacity-100 hover:text-blue-700 transition"
            style={{textShadow: '0 2px 8px #0008'}}
            onClick={(e) => { e.stopPropagation(); setModalIdx(null); }}
            aria-label="Close"
          >
            ×
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-bold bg-white bg-opacity-90 text-black rounded shadow-lg px-3 py-1 hover:bg-opacity-100 hover:text-blue-700 transition"
            style={{textShadow: '0 2px 8px #0008'}}
            onClick={(e) => { e.stopPropagation(); setModalIdx(modalIdx > 0 ? modalIdx - 1 : allImages.length - 1); }}
            aria-label="Previous"
          >
            ‹
          </button>
          <div
            className="flex items-center justify-center w-full h-full"
            style={{ cursor: dragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default' }}
            onMouseDown={(e) => {
              if (zoom === 1) return;
              setDragging(true);
              setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
              e.stopPropagation();
            }}
            onMouseMove={(e) => {
              if (!dragging) return;
              setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
              e.stopPropagation();
            }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onWheel={(e) => {
              if (e.deltaY < 0) setZoom((z) => Math.min(z + 0.2, 5));
              if (e.deltaY > 0) setZoom((z) => Math.max(z - 0.2, 0.2));
            }}
          >
            <img
              src={allImages[modalIdx].src}
              alt={allImages[modalIdx].label}
              className="max-h-[90vh] max-w-[90vw] object-contain border-4 border-white rounded shadow-xl select-none"
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                transition: dragging ? 'none' : 'transform 0.2s',
                cursor: dragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default',
              }}
              draggable={false}
            />
          </div>
          <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2">
            <button className="bg-white bg-opacity-90 text-black px-3 py-1 rounded text-lg font-bold shadow hover:bg-opacity-100 hover:text-blue-700 transition" onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(z - 0.2, 0.2)); }}>-</button>
            <button className="bg-white bg-opacity-90 text-black px-3 py-1 rounded text-lg font-bold shadow hover:bg-opacity-100 hover:text-blue-700 transition" onClick={(e) => { e.stopPropagation(); setZoom(1); setOffset({ x: 0, y: 0 }); }}>Reset</button>
            <button className="bg-white bg-opacity-90 text-black px-3 py-1 rounded text-lg font-bold shadow hover:bg-opacity-100 hover:text-blue-700 transition" onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(z + 0.2, 5)); }}>+</button>
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl font-bold bg-white bg-opacity-90 text-black rounded shadow-lg px-3 py-1 hover:bg-opacity-100 hover:text-blue-700 transition"
            style={{textShadow: '0 2px 8px #0008'}}
            onClick={(e) => { e.stopPropagation(); setModalIdx(modalIdx < allImages.length - 1 ? modalIdx + 1 : 0); }}
            aria-label="Next"
          >
            ›
          </button>
          <div className="absolute bottom-6 left-0 right-0 text-center flex flex-col items-center">
            <span className="inline-block bg-white bg-opacity-90 text-black rounded shadow px-3 py-1 text-sm font-medium mb-1" style={{textShadow: '0 2px 8px #0008'}}>
              {allImages[modalIdx].title} ({modalIdx + 1} / {allImages.length})
            </span>
            <span className="inline-block bg-white bg-opacity-80 text-black rounded shadow px-2 py-0.5 text-xs font-normal" style={{textShadow: '0 2px 8px #0008'}}>
              ESC to close, ←/→ to navigate, Mouse wheel/± to zoom, drag to pan
            </span>
          </div>
        </div>
      )}
    </div>
  );
}