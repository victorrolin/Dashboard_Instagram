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
        desc: 'Gerencie sua base de base de leads ativos.',
        searchPlaceholder: 'Buscar por nome, id, email...',
        allStatus: 'Todos Status',
        hot: '🔥 Quente',
        warm: '⚡ Morno',
        cold: '❄️ Frio',
        colId: 'Identificação',
        colContact: 'Contato',
        colMsg: 'Última Mensagem',
        colScore: 'Lead Score',
        colStatus: 'Status',
        noLeads: 'Nenhum lead encontrado.',
        now: 'Agora mesmo',
        agoMin: 'm atrás',
        agoHour: 'h atrás',
        noRecord: 'Sem registro',
        notInformed: 'Não informado',
        noMsg: 'Sem mensagem'
    },
    en: {
        title: 'Lead Station',
        desc: 'Manage your active lead database.',
        searchPlaceholder: 'Search by name, id, email...',
        allStatus: 'All Status',
        hot: '🔥 Hot',
        warm: '⚡ Warm',
        cold: '❄️ Cold',
        colId: 'Identification',
        colContact: 'Contact',
        colMsg: 'Last Message',
        colScore: 'Lead Score',
        colStatus: 'Status',
        noLeads: 'No leads found.',
        now: 'Just now',
        agoMin: 'm ago',
        agoHour: 'h ago',
        noRecord: 'No record',
        notInformed: 'Not informed',
        noMsg: 'No message'
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
        return past.toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="elite-card"
            style={{ padding: '0' }}
        >
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{t.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.desc}</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={16} />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '10px',
                                padding: '0.65rem 1rem 0.65rem 2.5rem',
                                color: 'white',
                                fontSize: '0.85rem',
                                width: '280px',
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
                            borderRadius: '10px',
                            padding: '0.65rem 1rem',
                            color: 'white',
                            fontSize: '0.85rem',
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
                            <th style={{ textAlign: 'left', padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.colId}</th>
                            <th style={{ textAlign: 'left', padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.colContact}</th>
                            <th style={{ textAlign: 'left', padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.colMsg}</th>
                            <th style={{ textAlign: 'left', padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.colScore}</th>
                            <th style={{ textAlign: 'left', padding: '1rem 2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.colStatus}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '4rem', textAlign: 'center' }}>
                                    <RefreshCw className="spinning" size={32} color="var(--accent-primary)" />
                                </td>
                            </tr>
                        ) : filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
                                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                                    >
                                        <td style={{ padding: '1.25rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                {lead.avatar_url ? (
                                                    <img src={lead.avatar_url} alt={lead.full_name} style={{ width: 38, height: 38, borderRadius: '12px', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{
                                                        width: 38,
                                                        height: 38,
                                                        borderRadius: '12px',
                                                        background: `${getAvatarColor(lead.sender_id || lead.id || '')}15`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: getAvatarColor(lead.sender_id || lead.id || ''),
                                                        fontSize: '0.8rem',
                                                        fontWeight: 800,
                                                        border: `1px solid ${getAvatarColor(lead.sender_id || lead.id || '')}25`
                                                    }}>
                                                        {(lead.full_name || lead.sender_id || lead.id || 'U').substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{lead.full_name || `ID: ${lead.sender_id || lead.id?.substring(0, 8)}`}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock size={10} />
                                                        {getTimeAgo(lead.last_interaction)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: lead.email ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                                    <Mail size={12} />
                                                    <span>{lead.email || t.notInformed}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: lead.phone ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                                    <Phone size={12} />
                                                    <span>{lead.phone || t.notInformed}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem' }}>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                                                {lead.last_message || t.noMsg}
                                            </p>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div className="score-progress-container" style={{ width: '60px' }}>
                                                    <div
                                                        className="score-progress-bar"
                                                        style={{
                                                            width: `${Math.min((lead.lead_score || 0) * 10, 100)}%`,
                                                            background: lead.lead_status === 'QUENTE' ? 'var(--accent-secondary)' : lead.lead_status === 'MORNO' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                                        }}
                                                    />
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{lead.lead_score}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 2rem' }}>
                                            <span className={`badge-elite badge-${lead.lead_status?.toLowerCase()}`}>
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
