import React from 'react';

// List of all PNG diagrams by category

const BASE = import.meta.env.BASE_URL || '/P9-T4-SugubeteMaximilianMitrache/';
const suguDiagrams = [
  {
    category: 'Use Case',
    files: [
      'diagrams/sugu/use-case/use-case_v1.png',
      'diagrams/sugu/use-case/use-case_v2_secretariat_workflow.png',
      'diagrams/sugu/use-case/use-case_v3_secretariat_workflow.png',
    ],
  },
  {
    category: 'Activity',
    files: [
      'diagrams/sugu/activity/activity_v1.png',
      'diagrams/sugu/activity/activity_v2.png',
      'diagrams/sugu/activity/activity_v3.png',
    ],
  },
  {
    category: 'Sequence',
    files: [
      'diagrams/sugu/sequence/sequence_v1.png',
      'diagrams/sugu/sequence/sequence_v2.png',
      'diagrams/sugu/sequence/sequence_v3.png',
    ],
  },
  {
    category: 'Role-Based Access Control',
    files: [
      'diagrams/sugu/role-based-access-control/rbac_v1.png',
      'diagrams/sugu/role-based-access-control/rbac_v2.png',
      'diagrams/sugu/role-based-access-control/rbac_v3.png',
    ],
  },
];

export default function SuguDiagramsPage() {
  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">SUGU Diagrams</h2>
      <p className="text-slate-600 mb-8">All generated diagrams for the SUGU system, grouped by type.</p>
      {suguDiagrams.map((group) => (
        <div key={group.category} className="mb-10">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">{group.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.files.map((file, idx) => {
              const imgSrc = BASE + file;
              return (
                <div key={file} className="bg-white rounded-lg shadow border border-slate-200 p-4 flex flex-col items-center">
                  <img src={imgSrc} alt={`${group.category} Diagram ${idx + 1}`} className="max-w-full max-h-80 object-contain mb-2" />
                  <span className="text-xs text-slate-500 break-all">{file.split('/').pop()}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
