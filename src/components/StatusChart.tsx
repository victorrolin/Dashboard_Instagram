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
        title: 'Distribuição de Leads',
        desc: 'Breakdown por temperatura de interesse.',
        hot: 'Quente',
        warm: 'Morno',
        cold: 'Frio',
        total: 'Total'
    },
    en: {
        title: 'Lead Distribution',
        desc: 'Breakdown by interest temperature.',
        hot: 'Hot',
        warm: 'Warm',
        cold: 'Cold',
        total: 'Total'
    }
};

export function StatusChart({ leads, lang }: Props) {
    const t = translations[lang];
    const statusCounts = {
        QUENTE: leads.filter((l) => l.lead_status === 'QUENTE').length,
        MORNO: leads.filter((l) => l.lead_status === 'MORNO').length,
        FRIO: leads.filter((l) => l.lead_status === 'FRIO').length,
    };

    const data = {
        labels: [t.hot, t.warm, t.cold],
        datasets: [
            {
                data: [statusCounts.QUENTE, statusCounts.MORNO, statusCounts.FRIO],
                backgroundColor: [
                    '#10b981', // green-500
                    '#3b82f6', // blue-500
                    '#3f3f46', // zinc-700
                ],
                borderColor: 'rgba(255, 255, 255, 0.05)',
                borderWidth: 2,
                hoverOffset: 15,
                borderRadius: 10,
                spacing: 5,
            },
        ],
    };

    const options = {
        cutout: '75%',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#18181b',
                titleFont: { family: 'Outfit', size: 14, weight: 'bold' as const },
                bodyFont: { family: 'Outfit', size: 13 },
                padding: 12,
                cornerRadius: 10,
                displayColors: true,
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            },
        },
        maintainAspectRatio: false,
    };

    const legendItems = [
        { label: t.hot, count: statusCounts.QUENTE, color: '#10b981' },
        { label: t.warm, count: statusCounts.MORNO, color: '#3b82f6' },
        { label: t.cold, count: statusCounts.FRIO, color: '#3f3f46' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="elite-card"
            style={{ height: '400px', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{t.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.desc}</p>
            </div>

            <div style={{ flex: 1, position: 'relative', minHeight: '200px' }}>
                <Doughnut data={data} options={options} />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{t.total}</p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>{leads.length}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                {legendItems.map((item) => (
                    <div key={item.label} style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>{item.count}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
