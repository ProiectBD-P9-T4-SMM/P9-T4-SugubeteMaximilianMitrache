import React, { useState, useCallback, useEffect } from 'react';

// List of all PNG diagrams by category

const BASE = import.meta.env.BASE_URL || '/P9-T4-SugubeteMaximilianMitrache/';
const suguDiagrams = [
  {
    category: 'Use Case',
    files: [
      'diagrams/sugu/use-case/use-case_v1.svg',
      'diagrams/sugu/use-case/use-case_v2.svg',
      'diagrams/sugu/use-case/use-case_v3.svg',
      'diagrams/sugu/use-case/use-case_v1.png',
      'diagrams/sugu/use-case/use-case_v2_secretariat_workflow.png',
      'diagrams/sugu/use-case/use-case_v3_secretariat_workflow.png',
    ],
    display: [
      'diagrams/sugu/use-case/use-case_v1.svg',
      'diagrams/sugu/use-case/use-case_v2.svg',
      'diagrams/sugu/use-case/use-case_v3.svg',
    ],
  },
  {
    category: 'Activity',
    files: [
      'diagrams/sugu/activity/activity_v1.svg',
      'diagrams/sugu/activity/activity_v2.svg',
      'diagrams/sugu/activity/activity_v3.svg',
      'diagrams/sugu/activity/activity_v1.png',
      'diagrams/sugu/activity/activity_v2.png',
      'diagrams/sugu/activity/activity_v3.png',
    ],
    display: [
      'diagrams/sugu/activity/activity_v1.svg',
      'diagrams/sugu/activity/activity_v2.svg',
      'diagrams/sugu/activity/activity_v3.svg',
    ],
  },
  {
    category: 'Sequence',
    files: [
      'diagrams/sugu/sequence/sequence_v1.svg',
      'diagrams/sugu/sequence/sequence_v2.svg',
      'diagrams/sugu/sequence/sequence_v3.svg',
      'diagrams/sugu/sequence/sequence_v1.png',
      'diagrams/sugu/sequence/sequence_v2.png',
      'diagrams/sugu/sequence/sequence_v3.png',
    ],
    display: [
      'diagrams/sugu/sequence/sequence_v1.svg',
      'diagrams/sugu/sequence/sequence_v2.svg',
      'diagrams/sugu/sequence/sequence_v3.svg',
    ],
  },
  {
    category: 'Role-Based Access Control',
    files: [
      'diagrams/sugu/role-based-access-control/rbac_v1.svg',
      'diagrams/sugu/role-based-access-control/rbac_v2.svg',
      'diagrams/sugu/role-based-access-control/rbac_v3.svg',
      'diagrams/sugu/role-based-access-control/rbac_v1.png',
      'diagrams/sugu/role-based-access-control/rbac_v2.png',
      'diagrams/sugu/role-based-access-control/rbac_v3.png',
    ],
    display: [
      'diagrams/sugu/role-based-access-control/rbac_v1.svg',
      'diagrams/sugu/role-based-access-control/rbac_v2.svg',
      'diagrams/sugu/role-based-access-control/rbac_v3.svg',
    ],
  },
];


export default function SuguDiagramsPage() {
  // Flatten all images for modal navigation
  const allImages = suguDiagrams.flatMap((group) =>
    group.display.map((file, idx) => ({
      src: BASE + file,
      label: `${group.category} - ${file.split('/').pop()}`,
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
      <h2 className="text-2xl font-bold text-slate-800 mb-6">SUGU Diagrams</h2>
      <p className="text-slate-600 mb-8">All generated diagrams for the SUGU system, grouped by type. Click any image to view fullscreen and use ←/→ to navigate.</p>
      {suguDiagrams.map((group) => (
        <div key={group.category} className="mb-10">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">{group.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.display.map((file, idx) => {
              const imgSrc = BASE + file;
              const globalIdx = allImages.findIndex((img) => img.src === imgSrc);
              return (
                <div key={file} className="bg-white rounded-lg shadow border border-slate-200 p-4 flex flex-col items-center">
                  <img
                    src={imgSrc}
                    alt={`${group.category} Diagram ${idx + 1}`}
                    className="max-w-full max-h-80 object-contain mb-2 cursor-pointer transition hover:scale-105"
                    onClick={() => setModalIdx(globalIdx)}
                  />
                  <span className="text-xs text-slate-500 break-all">{file.split('/').pop()}</span>
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
              {allImages[modalIdx].label} ({modalIdx + 1} / {allImages.length})
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
