import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { Lead } from '../lib/supabase.ts';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    leads: Lead[];
    lang: 'pt' | 'en';
}

const translations = {
    pt: {
        title: 'Distribuição de Status',
        desc: 'Visão geral da qualificação',
        hot: 'Quente',
        warm: 'Morno',
        cold: 'Frio'
    },
    en: {
        title: 'Status Distribution',
        desc: 'Qualification overview',
        hot: 'Hot',
        warm: 'Warm',
        cold: 'Cold'
    }
};

export function StatusChart({ leads, lang }: Props) {
    const t = translations[lang];
    const hotCount = leads.filter(l => l.lead_status === 'QUENTE').length;
    const warmCount = leads.filter(l => l.lead_status === 'MORNO').length;
    const coldCount = leads.filter(l => l.lead_status === 'FRIO').length;

    const data = {
        labels: [t.hot, t.warm, t.cold],
        datasets: [
            {
                data: [hotCount, warmCount, coldCount],
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    'rgba(255, 255, 255, 0.05)',
                ],
                borderColor: [
                    'rgba(16, 185, 129, 0.2)',
                    'rgba(59, 130, 246, 0.2)',
                    'rgba(255, 255, 255, 0.1)',
                ],
                borderWidth: 1,
                cutout: '75%',
                borderRadius: 8,
                hoverOffset: 12
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#0c0c10',
                titleColor: '#fff',
                bodyColor: '#a1a1aa',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 10,
                displayColors: false
            }
        },
        maintainAspectRatio: false,
        responsive: true,
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="elite-card"
            style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>{t.title}</h3>
                <p className="secondary-label" style={{ fontSize: '0.75rem' }}>{t.desc}</p>
            </div>

            <div style={{ position: 'relative', height: '180px', marginBottom: '1.5rem' }}>
                <Doughnut data={data} options={options} />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -40%)',
                    textAlign: 'center',
                    pointerEvents: 'none'
                }}>
                    <p className="metric-value" style={{ fontSize: '1.75rem', margin: 0 }}>{leads.length}</p>
                    <p className="metric-label" style={{ fontSize: '0.6rem', opacity: 0.6 }}>TOTAL</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: 'auto' }}>
                {[
                    { label: t.hot, count: hotCount, color: '#10b981' },
                    { label: t.warm, count: warmCount, color: '#3b82f6' },
                    { label: t.cold, count: coldCount, color: 'var(--text-secondary)' }
                ].map((item) => (
                    <div key={item.label} style={{ textAlign: 'center' }}>
                        <p className="metric-value" style={{ fontSize: '1.1rem', marginBottom: '0.1rem', color: item.color === 'var(--text-secondary)' ? 'white' : item.color }}>{item.count}</p>
                        <p className="metric-label" style={{ fontSize: '0.55rem' }}>{item.label}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
