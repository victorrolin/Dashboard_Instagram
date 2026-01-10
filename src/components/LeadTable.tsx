import { useState } from 'react';
import type { Lead } from '../lib/supabase.ts';
import {
    Search,
    Clock,
    RefreshCw,
    Mail,
    Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    leads: Lead[];
    loading: boolean;
    lang: 'pt' | 'en';
}

const translations = {
    pt: {
        title: 'Estação de Leads',
        desc: 'Gestão de leads ativos.',
        searchPlaceholder: 'Buscar...',
        allStatus: 'Filtros',
        hot: '🔥 Quente',
        warm: '⚡ Morno',
        cold: '❄️ Frio',
        colId: 'ID',
        colContact: 'Contato',
        colMsg: 'Mensagem',
        colScore: 'Score',
        colStatus: 'Status',
        noLeads: 'Nenhum lead.',
        now: 'Agora',
        agoMin: 'm',
        agoHour: 'h',
        noRecord: '-',
        notInformed: 'N/A',
        noMsg: '...'
    },
    en: {
        title: 'Lead Station',
        desc: 'Active lead management.',
        searchPlaceholder: 'Search...',
        allStatus: 'Filters',
        hot: '🔥 Hot',
        warm: '⚡ Warm',
        cold: '❄️ Cold',
        colId: 'ID',
        colContact: 'Contact',
        colMsg: 'Message',
        colScore: 'Score',
        colStatus: 'Status',
        noLeads: 'No leads.',
        now: 'Now',
        agoMin: 'm',
        agoHour: 'h',
        noRecord: '-',
        notInformed: 'N/A',
        noMsg: '...'
    }
};

export function LeadTable({ leads, loading, lang }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const t = translations[lang];

    const filteredLeads = leads.filter(lead => {
        const senderId = lead.sender_id || lead.id || '';
        const fullName = lead.full_name || '';
        const lastMessage = lead.last_message || '';
        const email = lead.email || '';

        const matchesSearch =
            senderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || lead.lead_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getAvatarColor = (id: string) => {
        const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const getTimeAgo = (dateString: string) => {
        if (!dateString) return t.noRecord;
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now.getTime() - past.getTime();
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

        if (diffInMins < 1) return t.now;
        if (diffInMins < 60) return `${diffInMins}${t.agoMin}`;
        if (diffInHours < 24) return `${diffInHours}${t.agoHour}`;
        return past.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="elite-card"
            style={{ padding: '0' }}
        >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>{t.title}</h3>
                    <p className="secondary-label" style={{ fontSize: '0.75rem' }}>{t.desc}</p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flex: '1', minWidth: '250px', justifyContent: 'flex-end' }}>
                    <div style={{ position: 'relative', flex: '1', maxWidth: '200px' }}>
                        <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={14} />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                padding: '0.5rem 0.75rem 0.5rem 2.2rem',
                                color: 'white',
                                fontSize: '0.8rem',
                                width: '100%',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            color: 'white',
                            fontSize: '0.8rem',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="ALL">{t.allStatus}</option>
                        <option value="QUENTE">{t.hot}</option>
                        <option value="MORNO">{t.warm}</option>
                        <option value="FRIO">{t.cold}</option>
                    </select>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.01)' }}>
                            <th className="metric-label" style={{ textAlign: 'left', padding: '0.75rem 1.5rem' }}>{t.colId}</th>
                            <th className="metric-label" style={{ textAlign: 'left', padding: '0.75rem 1.5rem' }}>{t.colContact}</th>
                            <th className="metric-label mobile-hide" style={{ textAlign: 'left', padding: '0.75rem 1.5rem' }}>{t.colMsg}</th>
                            <th className="metric-label" style={{ textAlign: 'left', padding: '0.75rem 1.5rem' }}>{t.colScore}</th>
                            <th className="metric-label" style={{ textAlign: 'left', padding: '0.75rem 1.5rem' }}>{t.colStatus}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center' }}>
                                    <RefreshCw className="spinning" size={24} color="var(--accent-primary)" />
                                </td>
                            </tr>
                        ) : filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    {t.noLeads}
                                </td>
                            </tr>
                        ) : (
                            <AnimatePresence mode="wait">
                                {filteredLeads.map((lead) => (
                                    <motion.tr
                                        key={lead.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={{ borderBottom: '1px solid var(--border-color)' }}
                                    >
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {lead.avatar_url ? (
                                                    <img src={lead.avatar_url} alt={lead.full_name} style={{ width: 34, height: 34, borderRadius: '10px', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{
                                                        width: 34,
                                                        height: 34,
                                                        borderRadius: '10px',
                                                        background: `${getAvatarColor(lead.sender_id || lead.id || '')}15`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: getAvatarColor(lead.sender_id || lead.id || ''),
                                                        fontSize: '0.75rem',
                                                        fontWeight: 800,
                                                        border: `1px solid ${getAvatarColor(lead.sender_id || lead.id || '')}25`
                                                    }}>
                                                        {(lead.full_name || lead.sender_id || lead.id || 'U').substring(0, 1).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{lead.full_name || `ID: ${lead.sender_id || lead.id?.substring(0, 6)}`}</p>
                                                    <p className="secondary-label" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                        <Clock size={10} />
                                                        {getTimeAgo(lead.last_interaction)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: lead.email ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                    <Mail size={10} />
                                                    <span>{lead.email || t.notInformed}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: lead.phone ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                    <Phone size={10} />
                                                    <span>{lead.phone || t.notInformed}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="mobile-hide" style={{ padding: '1rem 1.5rem' }}>
                                            <p className="secondary-label" style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0, fontSize: '0.8rem' }}>
                                                {lead.last_message || t.noMsg}
                                            </p>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div className="score-progress-container" style={{ width: '50px', height: '5px' }}>
                                                    <div
                                                        className="score-progress-bar"
                                                        style={{
                                                            width: `${Math.min((lead.lead_score || 0) * 10, 100)}%`,
                                                            background: lead.lead_status === 'QUENTE' ? 'var(--accent-secondary)' : lead.lead_status === 'MORNO' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                                        }}
                                                    />
                                                </div>
                                                <span className="metric-value" style={{ fontSize: '0.85rem' }}>{lead.lead_score}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span className={`badge-elite badge-${lead.lead_status?.toLowerCase()}`} style={{ padding: '0.25rem 0.6rem', fontSize: '0.65rem' }}>
                                                {lead.lead_status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
