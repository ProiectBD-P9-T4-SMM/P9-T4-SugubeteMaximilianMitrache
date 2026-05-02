import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, FileText, FileSignature, Clock, TrendingUp, Shield, 
  GraduationCap, BookOpen, Settings, AlertCircle, ChevronRight, 
  Plus, Download, List, History, UserCheck, X
} from 'lucide-react';
import api, { auditService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [activityRes, statsRes] = await Promise.all([
          user && ['ADMIN', 'PROFESSOR', 'SECRETARIAT'].includes(user.role) 
            ? auditService.getLogs() 
            : Promise.resolve({ data: [] }),
          api.get('/academic/dashboard/stats')
        ]);
        
        const logs = activityRes.data?.data || activityRes.data || [];
        setRecentActivity(logs.slice(0, 6));
        setStats(statsRes.data?.stats || null);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full shadow-xl shadow-blue-100"></div>
      </div>
    );
  }

  const renderAdminDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title={t('admin_total_users')} value={stats?.totalUsers} icon={Users} color="bg-blue-600" trend="+4% this week" />
        <StatCard title={t('admin_students')} value={stats?.totalStudents} icon={GraduationCap} color="bg-indigo-600" trend="+12 New" />
        <StatCard title={t('admin_curricula')} value={stats?.activeCurricula} icon={BookOpen} color="bg-emerald-600" />
        <StatCard title={t('admin_actions')} value={stats?.recentActions} icon={Shield} color="bg-rose-600" trend="Last 24h" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed activities={recentActivity} />
        </div>
        <div className="space-y-6">
          <QuickActions title={t('admin_shortcuts')} actions={[
            { label: t('audit_trail'), icon: Settings, path: '/audit', color: 'text-rose-600 bg-rose-50' },
            { label: t('nav_groups'), icon: Users, path: '/groups', color: 'text-blue-600 bg-blue-50' },
            { label: t('system_setup'), icon: List, path: '/disciplines', color: 'text-emerald-600 bg-emerald-50' },
          ]} />
          <SystemStatusCard />
        </div>
      </div>
    </div>
  );

  const renderProfessorDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title={t('stats_grades_month')} value={stats?.gradesThisMonth} icon={TrendingUp} color="bg-emerald-600" />
        <StatCard title={t('stats_disciplines')} value={stats?.totalDisciplines} icon={BookOpen} color="bg-blue-600" />
        <StatCard title={t('stats_upcoming_exams')} value={stats?.upcomingExams} icon={Clock} color="bg-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <TrendingUp className="text-emerald-500" /> {t('grading_velocity')}
              </h3>
              <div className="flex items-end justify-between h-48 gap-2 px-4">
                {stats?.performanceTrend?.length > 0 ? stats.performanceTrend.map((trendItem, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                     <div className="w-full bg-slate-50 rounded-t-lg relative h-full flex items-end">
                        <div 
                          className="w-full bg-blue-500 rounded-t-lg transition-all duration-1000 group-hover:bg-blue-600" 
                          style={{ height: `${Math.min(100, (trendItem.count / (Math.max(...stats.performanceTrend.map(x => x.count)) || 1)) * 100)}%` }}
                        >
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {trendItem.count} {t('grades_unit')}
                           </div>
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trendItem.month}</span>
                  </div>
                )) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 italic font-bold">{t('no_grading_data')}</div>
                )}
              </div>
            </div>
            <ActivityFeed activities={recentActivity} />
          </div>
        </div>
        <div className="space-y-6">
          <QuickActions title={t('prof_subtitle')} actions={[
            { label: t('nav_grades'), icon: Plus, path: '/grades/list', color: 'text-blue-600 bg-blue-50' },
            { label: t('nav_students'), icon: Users, path: '/students', color: 'text-indigo-600 bg-indigo-50' },
            { label: t('nav_documents'), icon: FileSignature, path: '/documents', color: 'text-purple-600 bg-purple-50' },
          ]} />
          <SystemStatusCard />
        </div>
      </div>
    </div>
  );

  const renderSecretariatDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title={t('sec_active_students')} value={stats?.activeStudents} icon={UserCheck} color="bg-emerald-600" />
        <StatCard title={t('sec_unassigned')} value={stats?.unassignedStudents} icon={AlertCircle} color="bg-amber-600" trend="Needs Action" />
        <StatCard title={t('sec_pending_docs')} value={stats?.recentDocuments} icon={FileText} color="bg-indigo-600" trend="Last 7 days" />
        <StatCard title={t('sec_study_groups')} value={stats?.totalGroups} icon={Users} color="bg-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityFeed activities={recentActivity} />
        </div>
        <div className="space-y-6">
          <QuickActions title={t('sec_desk')} actions={[
            { label: t('sec_registry'), icon: Users, path: '/students', color: 'text-blue-600 bg-blue-50' },
            { label: t('sec_export'), icon: Download, path: '/centralizer', color: 'text-emerald-600 bg-emerald-50' },
            { label: t('sec_module_config'), icon: List, path: '/disciplines', color: 'text-indigo-600 bg-indigo-50' },
            { label: t('sec_workflow'), icon: FileSignature, path: '/documents', color: 'text-purple-600 bg-purple-50' },
          ]} />
          <SystemStatusCard />
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl shadow-xl shadow-blue-200 text-white relative overflow-hidden group">
          <GraduationCap size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500" />
          <p className="text-blue-100 font-black uppercase tracking-widest text-xs mb-2">{t('stu_gpa')}</p>
          <h3 className="text-5xl font-black mb-1 tracking-tighter">{stats?.gpa || '0.00'}</h3>
          <p className="text-blue-200 text-sm font-bold flex items-center gap-1"><TrendingUp size={14}/> {t('stu_top_percent').replace('{percent}', 100 - (stats?.percentile || 0))}</p>
        </div>
        
        <StatCard title={t('stu_ects')} value={stats?.totalCredits} icon={BookOpen} color="bg-emerald-600" trend="Validated" />
        <StatCard title={t('stu_enrollments')} value={stats?.activePlans} icon={Layers} color="bg-slate-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <History className="text-blue-500" /> {t('stu_timeline')}
            </h3>
            <div className="space-y-8">
               {stats?.timeline?.length > 0 ? stats.timeline.map((item, i) => (
                 <TimelineItem key={i} title={item.title} date={item.date} status={item.status === 'success' ? 'success' : 'upcoming'} />
               )) : (
                 <div className="py-12 text-center text-slate-300 italic font-bold">{t('no_events')}</div>
               )}
            </div>
           </div>
        </div>
        <div className="space-y-6">
          <QuickActions title={t('stu_services')} actions={[
            { label: t('stu_view_grades'), icon: List, path: '/my-grades', color: 'text-blue-600 bg-blue-50' },
            { label: t('stu_docs'), icon: FileSignature, path: '/documents', color: 'text-indigo-600 bg-indigo-50' },
            { label: t('stu_support'), icon: AlertCircle, path: '/help', color: 'text-rose-600 bg-rose-50' },
          ]} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-8 lg:p-12">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            {t('greeting')}, {user?.fullName?.split(' ')[0]}!
          </h1>
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{t(`role_${user?.role?.toLowerCase()}`)}</span>
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
              <Clock size={12} /> {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{t('academic_status')}</p>
            <p className="text-emerald-500 font-black text-sm flex items-center justify-end gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> {t('system_online')}
            </p>
          </div>
        </div>
      </header>

      {user?.role === 'ADMIN' && renderAdminDashboard()}
      {user?.role === 'PROFESSOR' && renderProfessorDashboard()}
      {user?.role === 'SECRETARIAT' && renderSecretariatDashboard()}
      {user?.role === 'STUDENT' && renderStudentDashboard()}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
        <Icon size={24} />
      </div>
      <h4 className="text-slate-400 font-black uppercase tracking-widest text-[9px] mb-1">{title}</h4>
      <div className="text-3xl font-black text-slate-900 tracking-tighter">{value || 0}</div>
      {trend && (
        <p className="mt-2 text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
          {trend}
        </p>
      )}
      <Icon className="absolute -right-4 -bottom-4 opacity-5 text-slate-900 scale-150 group-hover:scale-[1.75] transition-transform duration-500" size={60} />
    </div>
  );
}

function ActivityFeed({ activities }) {
  const { t } = useLanguage();
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
      <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
        <Clock className="text-blue-500" /> {t('recent_activity')}
      </h3>
      <div className="space-y-6">
        {activities.length > 0 ? activities.map((act) => (
          <div key={act.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              act.action_type === 'INSERT' ? 'bg-emerald-50 text-emerald-600' : 
              act.action_type === 'DELETE' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {act.action_type === 'INSERT' ? <Plus size={20}/> : act.action_type === 'DELETE' ? <X size={20}/> : <History size={20}/>}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-bold text-slate-800 text-sm leading-none">
                  {act.action_type === 'UPDATE' ? t('act_updated') : act.action_type === 'INSERT' ? t('act_created') : t('act_deleted')} {act.entity_type.toLowerCase()} {t('act_record')}
                </p>
                <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{new Date(act.occurred_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
                <p className="text-xs text-slate-500 mt-1">{t('act_initiated')} <span className="font-bold text-slate-900">{act.actor_name || t('sys_admin')}</span></p>
            </div>
          </div>
        )) : (
          <div className="text-center py-12">
            <p className="text-slate-400 font-bold italic text-sm">{t('no_activity')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActions({ title, actions }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50">
      <h3 className="text-lg font-black text-slate-900 mb-6">{title}</h3>
      <div className="space-y-3">
        {actions.map((act, i) => (
          <button 
            key={i}
            onClick={() => navigate(act.path)}
            className="w-full group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300"
          >
            <div className={`${act.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
              <act.icon size={18} />
            </div>
            <span className="font-black text-slate-700 text-xs uppercase tracking-widest">{act.label}</span>
            <ChevronRight className="ml-auto text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ title, date, status }) {
  return (
    <div className="flex gap-4 relative">
      <div className={`h-3 w-3 rounded-full mt-1 flex-shrink-0 z-10 ${status === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-400 animate-pulse shadow-[0_0_10px_#fbbf24]'}`} />
      <div className="absolute left-[5px] top-4 bottom-0 w-[1px] bg-slate-100 last:hidden" />
      <div>
        <h5 className="text-sm font-black text-slate-800 leading-none mb-1">{title}</h5>
        <p className="text-xs text-slate-400 font-bold">{date}</p>
      </div>
    </div>
  );
}

function SystemStatusCard() {
  const { t } = useLanguage();
  return (
    <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-300 relative overflow-hidden group">
      <div className="relative z-10">
        <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">{t('security_overview')}</h5>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Shield className="text-blue-400" size={20} />
          </div>
          <div>
            <p className="text-lg font-black leading-none tracking-tight">{t('system_secure')}</p>
            <p className="text-[10px] text-blue-300/60 font-bold uppercase mt-1">{t('encrypted')}</p>
          </div>
        </div>
        <div className="space-y-3">
           <div className="flex justify-between text-[10px] font-bold">
              <span className="text-white/40">{t('db_sync')}</span>
              <span className="text-emerald-400">{t('optimal')}</span>
           </div>
           <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[94%] shadow-[0_0_8px_#10b981]" />
           </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 p-4">
         <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </div>
  );
}

function Layers({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
