import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase.ts';
import type { Lead } from './lib/supabase.ts';
import { SummaryCards } from './components/SummaryCards.tsx';
import { StatusChart } from './components/StatusChart.tsx';
import { LeadTable } from './components/LeadTable.tsx';
import {
  BarChart3,
  RefreshCw,
  LayoutDashboard,
  Users,
  PieChart,
  LogOut,
  Zap,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const translations = {
  pt: {
    dashboard: 'Dashboard',
    station: 'Estação de Leads',
    analytics: 'Análise',
    syncStatus: 'SINCRONIZAÇÃO AO VIVO',
    polling: 'AUTO-POLLING ATIVO',
    syncNow: 'Sincronizar Agora',
    overview: 'Visão Geral',
    realtimeData: 'Dados coletados em tempo real.',
    lastSync: 'Última sinc.',
    insightsTitle: 'Insights de Elite',
    insightsDesc: 'A inteligência detectou potencial de fechamento em 3 novos leads.',
    seeSuggestions: 'Ver Sugestões',
    reports: 'Relatórios de Qualificação',
    reportsDesc: 'Em breve: Projeção de ROI e heatmap de conversão por canal.',
    upgradeBtn: 'Upgrade para Enterprise',
    logout: 'Sair',
    comingSoon: 'Recurso em desenvolvimento',
    language: 'Linguagem'
  },
  en: {
    dashboard: 'Dashboard',
    station: 'Lead Station',
    analytics: 'Analytics',
    syncStatus: 'LIVE SYNC',
    polling: 'AUTO-POLLING ACTIVE',
    syncNow: 'Sync Now',
    overview: 'Overview',
    realtimeData: 'Real-time data synchronization.',
    lastSync: 'Last sync',
    insightsTitle: 'Elite Insights',
    insightsDesc: 'Intelligence detected closing potential in 3 new leads.',
    seeSuggestions: 'See Suggestions',
    reports: 'Qualification Reports',
    reportsDesc: 'Coming soon: ROI projection and channel conversion heatmap.',
    upgradeBtn: 'Upgrade to Enterprise',
    logout: 'Logout',
    comingSoon: 'Feature under development',
    language: 'Language'
  }
};

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState<'CONNECTING' | 'CONNECTED' | 'ERROR'>('CONNECTING');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState<'pt' | 'en'>('pt');

  const t = translations[lang];

  useEffect(() => {
    fetchLeads();

    const pollInterval = setInterval(() => {
      fetchLeads(true);
    }, 30000);

    const channel = supabase
      .channel('trial_users_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trial_users' }, (payload) => {
        console.log('Change detected:', payload);
        fetchLeads(true);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtimeStatus('CONNECTED');
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setRealtimeStatus('ERROR');
      });

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, []);

  async function fetchLeads(isBackground = false) {
    if (!isBackground) setLoading(true);
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('trial_users')
        .select('*')
        .order('last_interaction', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'leads', icon: Users, label: t.station },
    { id: 'analytics', icon: PieChart, label: t.analytics },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SummaryCards leads={leads} lang={lang} />
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', marginTop: '3rem' }}>
              <LeadTable leads={leads} loading={loading} lang={lang} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <StatusChart leads={leads} lang={lang} />
                <div className="elite-card" style={{ padding: '2.5rem' }}>
                  <div style={{ width: 50, height: 50, background: 'rgba(59, 130, 246, 0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <Zap size={24} color="var(--accent-primary)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{t.insightsTitle}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {t.insightsDesc}
                  </p>
                  <button className="primary-button" style={{ width: '100%', marginTop: '1.5rem' }}>{t.seeSuggestions}</button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'leads':
        return (
          <motion.div
            key="leads"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <LeadTable leads={leads} loading={loading} lang={lang} />
          </motion.div>
        );
      case 'analytics':
        return (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}
          >
            <StatusChart leads={leads} lang={lang} />
            <div className="elite-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }}>
                <PieChart size={64} color="var(--accent-primary)" />
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{t.reports}</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>
                {t.reportsDesc}
              </p>
              <button className="primary-button" style={{ marginTop: '2rem', padding: '0.75rem 2.5rem' }}>{t.upgradeBtn}</button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <div className="mesh-bg" />
      <div className="noise-overlay" />

      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
          <div style={{
            background: 'var(--accent-primary)',
            width: 38,
            height: 38,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}>
            <BarChart3 size={20} color="white" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Elite<span style={{ color: 'var(--accent-primary)' }}>Dash</span></h2>
        </div>

        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                background: activeTab === item.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                border: 'none',
                borderRadius: '12px',
                color: activeTab === item.id ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                transition: 'all 0.2s',
                fontWeight: activeTab === item.id ? 600 : 400,
              }}
            >
              <item.icon size={20} color={activeTab === item.id ? 'var(--accent-primary)' : 'currentColor'} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <button style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.85rem 1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}>
            <LogOut size={20} />
            {t.logout}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }} className="text-gradient">
              {menuItems.find(i => i.id === activeTab)?.label} <span style={{ opacity: 0.5 }}>/ {t.overview}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t.realtimeData}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              className="glass-button"
              style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}
            >
              <Globe size={16} color="var(--accent-primary)" />
              {lang.toUpperCase()}
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'var(--glass-bg)',
              padding: '0.5rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{
                width: 7,
                height: 7,
                background: realtimeStatus === 'CONNECTED' ? 'var(--accent-secondary)' : '#f59e0b',
                borderRadius: '50%',
                boxShadow: `0 0 10px ${realtimeStatus === 'CONNECTED' ? 'var(--accent-secondary)' : '#f59e0b'}`
              }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                {realtimeStatus === 'CONNECTED' ? t.syncStatus : t.polling}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchLeads()}
              disabled={refreshing}
              className="glass-button"
              style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
            >
              <RefreshCw size={16} color="var(--accent-primary)" style={{ animation: refreshing ? 'spin 2s linear infinite' : 'none' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600 }}>{t.syncNow}</p>
                <p style={{ margin: 0, fontSize: '0.6rem', opacity: 0.5 }}>{t.lastSync}: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </motion.button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
