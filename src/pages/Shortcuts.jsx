import React from 'react';
import { Keyboard, Zap, Command, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Shortcuts() {
  const { t, language } = useLanguage();

  const categories = [
    {
      title: t('short_global_nav'),
      icon: Globe,
      shortcuts: [
        { key: 'Alt + 1-9', desc: t('short_jump_module') },
        { key: 'Alt + L', desc: t('short_logout') },
        { key: 'Alt + H', desc: t('short_open_help') }
      ]
    },
    {
      title: t('short_data_entry'),
      icon: Zap,
      shortcuts: [
        { key: 'Alt + S', desc: t('short_focus_student') },
        { key: 'Alt + D', desc: t('short_focus_discipline') },
        { key: 'Alt + N', desc: t('short_focus_grade') },
        { key: 'Enter', desc: t('short_submit_grade') }
      ]
    },
    {
      title: t('short_registry'),
      icon: Keyboard,
      shortcuts: [
        { key: '/', desc: t('short_focus_search') },
        { key: 'Alt + A', desc: t('short_add_student') },
        { key: 'Alt + U', desc: t('short_upload_doc') },
        { key: 'Alt + E', desc: t('short_send_email') },
        { key: 'Esc', desc: t('short_esc') }
      ]
    },
    {
      title: t('short_management'),
      icon: Command,
      shortcuts: [
        { key: 'Alt + S', desc: t('short_focus_spec') },
        { key: 'Alt + P', desc: t('short_focus_plan') },
        { key: 'Alt + F', desc: t('short_toggle_filters') },
        { key: 'Alt + R', desc: t('short_reset_filters') },
        { key: 'Alt + N', desc: t('short_focus_group_name') },
        { key: 'Alt + M', desc: t('short_focus_enroll') }
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
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('short_title')}</h2>
            <p className="text-slate-500 font-medium">{t('short_subtitle')}</p>
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
               <Zap className="text-amber-400" /> {t('short_pro_tip')}
            </h4>
            <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
              {t('short_pro_tip_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
