import React from 'react';
import { Keyboard, MousePointer, Zap, Command, Move, CornerDownLeft } from 'lucide-react';

export default function Shortcuts() {
  const categories = [
    {
      title: 'Global Navigation',
      icon: Globe,
      shortcuts: [
        { key: 'Alt + 1-9', desc: 'Jump to specific module (Dashboard, Students, etc.)' },
        { key: 'Alt + L', desc: 'Instant Logout' },
        { key: 'Alt + H', desc: 'Open Help Center' }
      ]
    },
    {
      title: 'Academic Data Entry (Add Grades)',
      icon: Zap,
      shortcuts: [
        { key: 'Alt + S', desc: 'Focus Student selection' },
        { key: 'Alt + D', desc: 'Focus Discipline selection' },
        { key: 'Alt + N', desc: 'Focus Grade input' },
        { key: 'Enter', desc: 'Submit grade and reset focus to Student list' }
      ]
    },
    {
      title: 'Registry & Search',
      icon: Keyboard,
      shortcuts: [
        { key: '/', desc: 'Focus Search Bar (Students, Documents)' },
        { key: 'Alt + A', desc: 'Add Student (Modal)' },
        { key: 'Alt + U', desc: 'Upload Document (Modal)' },
        { key: 'Alt + E', desc: 'Send Group Email (Modal)' },
        { key: 'Esc', desc: 'Close modals or cancel active editing' }
      ]
    },
    {
      title: 'Management Modules',
      icon: Command,
      shortcuts: [
        { key: 'Alt + S', desc: 'Focus Specialization (Disciplines)' },
        { key: 'Alt + P', desc: 'Focus Study Plan (Disciplines)' },
        { key: 'Alt + F', desc: 'Toggle Filters (Grades List)' },
        { key: 'Alt + R', desc: 'Reset Filters (Grades List)' },
        { key: 'Alt + N', desc: 'Focus New Group Name (Groups)' },
        { key: 'Alt + M', desc: 'Focus Enroll Member (Groups)' }
      ]
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg">
            <Zap size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Productivity Shortcuts</h2>
            <p className="text-slate-500 font-medium">Master the keyboard to navigate AFSMS like a pro.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {React.createElement(cat.icon || Keyboard, { size: 20 })}
                </div>
                <h3 className="font-bold text-slate-800">{cat.title}</h3>
              </div>

              <div className="space-y-4">
                {cat.shortcuts.map((s, i) => (
                  <div key={i} className="flex justify-between items-center group/item">
                    <span className="text-sm font-medium text-slate-600">{s.desc}</span>
                    <kbd className="bg-slate-100 border border-slate-300 px-2 py-1 rounded text-xs font-black text-slate-900 shadow-[0_2px_0_0_rgba(0,0,0,0.1)] group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:border-blue-700 transition-all">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-blue-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-white opacity-5 -skew-x-12 translate-x-1/4" />
          <div className="relative z-10">
            <h4 className="text-xl font-black mb-2 flex items-center gap-2">
               <Zap className="text-amber-400" /> Pro Tip: Mouse-Free Workflow
            </h4>
            <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
              In the <strong>Add Grades</strong> section, you can enter hundreds of grades without ever touching your mouse. Type the student name, press <code>Enter</code> to select, type the grade, and press <code>Enter</code> again. The system will automatically jump back to the student field for the next entry!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to avoid import issues if Globe isn't in scope (though it is in Lucide)
import { Globe } from 'lucide-react';
