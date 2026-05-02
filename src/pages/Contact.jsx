import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Users, Shield, Headphones, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/notifications/contact', {
        subject: formData.subject,
        message: `Role: ${formData.role}\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      });
      setSubmitted(true);
    } catch (err) {
      setError(t('contact_error_msg') || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center border border-slate-100">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-8">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{t('contact_success_title')}</h2>
          <p className="text-slate-600 mb-10 leading-relaxed">
            {t('contact_success_desc')}
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
          >
            {t('contact_send_another')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{t('contact_title')}</h1>
              <p className="text-slate-600 text-lg leading-relaxed max-w-lg">
                {t('contact_subtitle')}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-blue-100 rounded-2xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{t('contact_faculty_admin')}</h4>
                  <p className="text-slate-600 text-sm mb-2">{t('contact_faculty_desc')}</p>
                  <div className="space-y-1">
                    <p className="text-slate-900 font-medium flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span>support.ace@ucv.ro</span>
                    </p>
                    <p className="text-slate-900 font-medium flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>+40 251 438198</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="p-4 bg-amber-100 rounded-2xl">
                  <Headphones className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{t('contact_it_helpdesk')}</h4>
                  <p className="text-slate-600 text-sm mb-2">{t('contact_it_desc')}</p>
                  <div className="space-y-1">
                    <p className="text-slate-900 font-medium flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span>helpdesk@ucv.ro</span>
                    </p>
                    <p className="text-slate-900 font-medium flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{language === 'ro' ? 'Lun - Vin, 08:00 - 16:00' : 'Mon - Fri, 08:00 - 16:00'}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="p-4 bg-emerald-100 rounded-2xl">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{t('contact_data_protection')}</h4>
                  <p className="text-slate-600 text-sm mb-2">{t('contact_data_desc')}</p>
                  <div className="space-y-1">
                    <p className="text-slate-900 font-medium flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span>dpo@ucv.ro</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-slate-900 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 uppercase">{t('contact_location')}</p>
                  <p className="text-slate-600 text-sm">A.I. Cuza St. 13, Craiova, Dolj, Romania</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">{t('contact_send_message')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t('contact_full_name')}</label>
                  <input 
                    required
                    type="text" 
                    placeholder={t('contact_name_placeholder')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t('contact_email')}</label>
                  <input 
                    required
                    type="email" 
                    placeholder={t('contact_email_placeholder')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('contact_i_am_a')}</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Student">{t('role_student')}</option>
                  <option value="Professor">{t('role_professor')}</option>
                  <option value="Guest">{language === 'ro' ? 'Vizitator' : 'Guest'}</option>
                  <option value="Other">{language === 'ro' ? 'Altul' : 'Other'}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('contact_subject')}</label>
                <input 
                  required
                  type="text" 
                  placeholder={t('contact_subject_placeholder')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('contact_message')}</label>
                <textarea 
                  required
                  rows="4"
                  placeholder={t('contact_message_placeholder')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center space-x-2 group disabled:opacity-50"
              >
                <span>{loading ? t('contact_dispatched') : t('contact_send_btn')}</span>
                <Send className={`h-5 w-5 transition-transform ${loading ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
