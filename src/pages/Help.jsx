import { Link } from 'react-router-dom';
import { Search, Book, GraduationCap, Users, Settings, MessageSquare, Clock, Globe, ExternalLink, HelpCircle, Zap } from 'lucide-react';

export default function Help() {
  const roles = [
    {
      title: 'Registrar & Secretariat',
      icon: Users,
      bgColor: 'bg-blue-600',
      textColor: 'text-blue-600',
      dotColor: 'bg-blue-500',
      docName: 'Operations Manual',
      items: [
        'Using dropdown-based data collection',
        'Managing electronic document circulation',
        'Bulk data imports/exports (Excel/CSV)',
        'Microsoft Outlook integration',
        'Generating e-Transcripts & Centralizers'
      ]
    },
    {
      title: 'Professors & Teaching Staff',
      icon: GraduationCap,
      bgColor: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      dotColor: 'bg-emerald-500',
      docName: 'Quick Start Guide',
      items: [
        'Authenticating via University SSO',
        'Locating assigned study formations',
        'Entering session grades with shortcuts',
        'Finalizing and submitting records'
      ]
    },
    {
      title: 'Students',
      icon: GraduationCap,
      bgColor: 'bg-amber-600',
      textColor: 'text-amber-600',
      dotColor: 'bg-amber-500',
      docName: 'Student Portal Guide',
      items: [
        'Viewing personal schedules',
        'Interpreting grade displays',
        'Tracking administrative documents',
        'Requesting documents online'
      ]
    },
    {
      title: 'Administrators',
      icon: Settings,
      bgColor: 'bg-slate-600',
      textColor: 'text-slate-600',
      dotColor: 'bg-slate-500',
      docName: 'Administrator Guide',
      items: [
        'Site adaptation & curricula config',
        'User privilege & group mapping',
        'DBMS management & audit logs',
        'Offline backups & point-in-time recovery'
      ]
    }
  ];

  return (
    <div className="flex-1 bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">How can we help you?</h1>
          <p className="text-slate-400 text-lg mb-10">Search our support center or browse role-specific documentation below.</p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search for articles, guides, or troubleshooting..." 
              className="w-full bg-slate-800 border-none rounded-2xl py-5 pl-14 pr-6 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xl"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Quick Assistance */}
        <section className="mb-20">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Immediate In-App Assistance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Context-Sensitive Help</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Look for the "Help" icon in the top header. Clicking it provides assistance specific to your current page.
              </p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Interactive Tooltips</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hover over complex fields and selection lists to reveal tooltips explaining the required input.
              </p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                <Settings className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Error Resolution</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                If input is invalid, the system displays brief, non-technical messages with exact resolution steps.
              </p>
            </div>
            <Link to="/shortcuts" className="p-8 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 hover:scale-[1.02] transition-all group">
              <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Keyboard Shortcuts</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Master the AFSMS portal with professional keyboard shortcuts for rapid data entry and navigation.
              </p>
              <span className="text-blue-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                Learn Shortcuts <ExternalLink size={14} />
              </span>
            </Link>
          </div>
        </section>

        {/* Role Specific Documentation */}
        <section className="mb-20">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-slate-200 rounded-lg">
              <Book className="h-6 w-6 text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Role-Specific Documentation</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {roles.map((role, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col shadow-sm group">
                <div className={`p-6 ${role.bgColor} text-white flex justify-between items-center`}>
                  <div className="flex items-center space-x-4">
                    <role.icon className="h-8 w-8" />
                    <div>
                      <h3 className="text-xl font-bold">For {role.title}</h3>
                      <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Document: {role.docName}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
                </div>
                <div className="p-8 flex-1">
                  <ul className="space-y-4">
                    {role.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3 text-slate-600">
                        <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${role.dotColor} flex-shrink-0`} />
                        <span className="text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <button className={`${role.textColor} text-sm font-bold hover:underline`}>
                    View Full Documentation →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Support */}
        <section className="bg-white rounded-3xl p-10 md:p-16 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-600 translate-x-1/2 -skew-x-12 opacity-5 hidden lg:block" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Still need help?</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                If you encounter a critical system error, issues with your SSO login, or require assistance not covered in the manuals, our IT Helpdesk is ready to assist you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Support Portal</p>
                    <a href="https://support.ucv.ro" className="text-slate-900 font-bold hover:text-blue-600 transition-colors">support.ucv.ro</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Email Support</p>
                    <p className="text-slate-900 font-bold">helpdesk@ucv.ro</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Operating Hours</p>
                    <p className="text-slate-900 font-bold">Mon - Fri, 08:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center">
              <h4 className="text-xl font-bold text-slate-900 mb-4">Open a Ticket</h4>
              <p className="text-sm text-slate-500 mb-8">The fastest way to get support is through our ticketing system.</p>
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Contact Support
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
