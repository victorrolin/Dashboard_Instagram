import React, { useState } from 'react';
import { supabase } from '../lib/supabase.ts';
import { BarChart3, Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="mesh-bg" />
            <div className="noise-overlay" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="elite-card"
                style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        background: 'var(--accent-primary)',
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem',
                        boxShadow: '0 0 25px rgba(59, 130, 246, 0.5)'
                    }}>
                        <BarChart3 size={24} color="white" />
                    </div>
                    <h1 className="text-gradient" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        EliteDash
                    </h1>
                    <p className="secondary-label">Painel de Qualificação Profissional</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label className="metric-label" style={{ marginBottom: '0.5rem', display: 'block' }}>E-mail</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    padding: '0.85rem 1rem 0.85rem 3rem',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                className="auth-input"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="metric-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Senha</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    padding: '0.85rem 1rem 0.85rem 3rem',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                className="auth-input"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '10px',
                                padding: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                color: '#f87171',
                                fontSize: '0.85rem'
                            }}
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="primary-button"
                        style={{
                            marginTop: '0.5rem',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem'
                        }}
                    >
                        {loading ? 'Acessando...' : 'Entrar no Dashboard'}
                        {!loading && <ChevronRight size={18} />}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    Protegido por criptografia Enterprise de ponta a ponta.
                </p>
            </motion.div>
        </div>
    );
}
