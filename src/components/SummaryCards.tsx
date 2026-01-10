import type { Lead } from '../lib/supabase.ts';
import { Users, Flame, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    leads: Lead[];
    lang: 'pt' | 'en';
}

const translations = {
    pt: {
        total: 'Total Leads',
        hot: 'Leads Quentes',
        avg: 'Score Médio',
        conv: 'Conversão'
    },
    en: {
        total: 'Total Leads',
        hot: 'Hot Leads',
        avg: 'Avg. Score',
        conv: 'Conversion'
    }
};

export function SummaryCards({ leads, lang }: Props) {
    const t = translations[lang];
    const hotLeads = leads.filter(l => l.lead_status === 'QUENTE').length;
    const avgScore = leads.length > 0
        ? Math.round(leads.reduce((acc, curr) => acc + (curr.lead_score || 0), 0) / leads.length)
        : 0;

    const stats = [
        {
            label: t.total,
            value: leads.length.toString(),
            icon: Users,
            color: '#3b82f6',
            trend: '+12.5%',
            sparkData: [30, 45, 35, 60, 55, 70, 65]
        },
        {
            label: t.hot,
            value: hotLeads.toString(),
            icon: Flame,
            color: '#10b981',
            trend: '+8.2%',
            sparkData: [10, 20, 15, 25, 30, 28, 35]
        },
        {
            label: t.avg,
            value: avgScore.toString(),
            icon: Target,
            color: '#8b5cf6',
            trend: '+4.1%',
            sparkData: [40, 42, 45, 43, 48, 50, 52]
        },
        {
            label: t.conv,
            value: '24%',
            icon: TrendingUp,
            color: '#f59e0b',
            trend: '+2.4%',
            sparkData: [15, 18, 17, 20, 22, 21, 24]
        },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="elite-card"
                    style={{ padding: '1.5rem' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div style={{
                            background: `${stat.color}15`,
                            padding: '0.6rem',
                            borderRadius: '10px',
                            border: `1px solid ${stat.color}20`
                        }}>
                            <stat.icon size={20} color={stat.color} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="metric-label" style={{ marginBottom: '0.15rem' }}>{stat.label}</p>
                            <h2 className="metric-value" style={{ fontSize: '1.5rem', margin: 0 }}>{stat.value}</h2>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <div>
                            <span style={{
                                color: stat.color,
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                background: `${stat.color}10`,
                                padding: '0.15rem 0.4rem',
                                borderRadius: '6px'
                            }}>
                                {stat.trend}
                            </span>
                        </div>

                        <div style={{ width: '70px', height: '25px' }}>
                            <svg width="100%" height="100%" viewBox="0 0 100 40">
                                <defs>
                                    <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor={stat.color} stopOpacity="0.3" />
                                        <stop offset="100%" stopColor={stat.color} stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d={`M ${stat.sparkData.map((d, i) => `${(i * 100) / (stat.sparkData.length - 1)} ${40 - (d / 2)}`).join(' L ')}`}
                                    fill="none"
                                    stroke={stat.color}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    d={`M ${stat.sparkData.map((d, i) => `${(i * 100) / (stat.sparkData.length - 1)} ${40 - (d / 2)}`).join(' L ')} L 100 40 L 0 40 Z`}
                                    fill={`url(#grad-${index})`}
                                />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
