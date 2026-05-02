import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function PublicPortal() {
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCurricula = async () => {
      setLoading(true);
      try {
        const res = await publicService.getCurricula();
        setCurricula(res.data);
      } catch (err) {
        console.error("Failed to load public curricula", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurricula();
  }, []);

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t('public_title')}</h2>
          <p className="text-sm text-slate-500">{t('public_subtitle')}</p>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
        >
          {t('login_to_private')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {[
                { key: 'th_specialization', label: t('th_specialization') },
                { key: 'th_year', label: t('th_year') },
                { key: 'th_semester', label: t('th_semester') },
                { key: 'th_discipline', label: t('th_discipline') },
                { key: 'th_credits', label: t('th_credits') },
                { key: 'th_type', label: t('th_type') }
              ].map((h) => (
                <th key={h.key} className="px-6 py-3 text-left font-semibold text-slate-600 uppercase tracking-wider">{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-4 text-slate-500">{t('public_loading')}</td></tr>
            ) : curricula.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-4 text-slate-500">{t('public_no_data')}</td></tr>
            ) : curricula.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{row.specialization_name}</td>
                <td className="px-6 py-4">{t('unit_year')} {row.study_year}</td>
                <td className="px-6 py-4">{t('unit_sem')} {row.semester}</td>
                <td className="px-6 py-4">{row.discipline_name}</td>
                <td className="px-6 py-4">{row.ects_credits} {t('unit_ects')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800`}>
                    {row.evaluation_type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
