import { useState, useEffect } from 'react';
import {
    DollarSign, TrendingUp, Users, CreditCard,
    ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
    AlertCircle, Receipt, PieChart, UserPlus, ChevronRight,
    CalendarDays, Building2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ContaReceber {
    id: number;
    descricao: string;
    valor: number;
    data_vencimento: string;
    status: string;
    plataforma_id: number;
}

interface ContaPagar {
    id: number;
    descricao: string;
    valor: number;
    data_vencimento: string;
    status: string;
    fornecedor: string;
}

interface ClientePorPlano {
    plano_nome: string;
    quantidade: number;
    cor: string;
}

interface ClienteRecente {
    nome: string;
    email: string;
    plano: string;
    data: string;
    tipo: string;
}

export const FinanceTab = () => {
    const [loading, setLoading] = useState(true);
    const [receitaMensal, setReceitaMensal] = useState(0);
    const [receitaMesAnterior, setReceitaMesAnterior] = useState(0);
    const [contasReceber, setContasReceber] = useState<ContaReceber[]>([]);
    const [contasPagar, setContasPagar] = useState<ContaPagar[]>([]);
    const [clientesPorPlano, setClientesPorPlano] = useState<ClientePorPlano[]>([]);
    const [clientesRecentes, setClientesRecentes] = useState<ClienteRecente[]>([]);
    const [totalReceber, setTotalReceber] = useState(0);
    const [totalPagar, setTotalPagar] = useState(0);
    const [totalRecebido, setTotalRecebido] = useState(0);
    const [totalPago, setTotalPago] = useState(0);

    const cores = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-orange-500', 'bg-rose-500', 'bg-cyan-500', 'bg-amber-500', 'bg-indigo-500'];

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        setLoading(true);
        try {
            const now = new Date();
            const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const fimMes = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
            const inicioMesAnterior = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
            const fimMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

            // 1. Receita Mensal (MRR real baseado em planos ativos)
            const { data: usuariosPlanos } = await supabase
                .from('Usuarios')
                .select('Plano_ID, Data_criacao');

            const { data: planos } = await supabase
                .from('planos')
                .select('plano_id, nome, valor_mensal');

            // Calcular MRR
            const mrrAtual = usuariosPlanos?.reduce((acc, u) => {
                const plano = planos?.find(p => p.plano_id === u.Plano_ID);
                return acc + (plano?.valor_mensal || 0);
            }, 0) || 0;
            setReceitaMensal(mrrAtual);

            // MRR do mês anterior (usuários criados antes do fim do mês anterior)
            const usuariosAnteriores = usuariosPlanos?.filter(u =>
                u.Data_criacao && new Date(u.Data_criacao) < new Date(fimMesAnterior)
            );
            const mrrAnterior = usuariosAnteriores?.reduce((acc, u) => {
                const plano = planos?.find(p => p.plano_id === u.Plano_ID);
                return acc + (plano?.valor_mensal || 0);
            }, 0) || 0;
            setReceitaMesAnterior(mrrAnterior);

            // 2. Clientes por Plano
            if (planos && usuariosPlanos) {
                const agrupado = planos.map((plano, i) => ({
                    plano_nome: plano.nome,
                    quantidade: usuariosPlanos.filter(u => u.Plano_ID === plano.plano_id).length,
                    cor: cores[i % cores.length]
                })).filter(p => p.quantidade > 0).sort((a, b) => b.quantidade - a.quantidade);
                setClientesPorPlano(agrupado);
            }

            // 3. Clientes Recentes (últimos 10 usuários criados)
            const { data: recentes } = await supabase
                .from('Usuarios')
                .select('Nome, Email, Tipo, Plano_ID, Data_criacao')
                .order('Data_criacao', { ascending: false })
                .limit(10);

            if (recentes && planos) {
                setClientesRecentes(recentes.map(r => ({
                    nome: r.Nome || 'Sem nome',
                    email: r.Email || '',
                    plano: planos.find(p => p.plano_id === r.Plano_ID)?.nome || 'Sem plano',
                    data: r.Data_criacao ? new Date(r.Data_criacao).toLocaleDateString('pt-BR') : '--',
                    tipo: r.Tipo || 'Profissional'
                })));
            }

            // 4. Contas a Receber
            const { data: receberData } = await supabase
                .from('contas_a_receber')
                .select('*')
                .order('data_vencimento', { ascending: true })
                .limit(20);

            if (receberData) {
                setContasReceber(receberData);
                setTotalReceber(receberData.filter(c => c.status === 'Pendente').reduce((a, c) => a + (c.valor || 0), 0));
                setTotalRecebido(receberData.filter(c => c.status === 'Pago').reduce((a, c) => a + (c.valor || 0), 0));
            }

            // 5. Contas a Pagar
            const { data: pagarData } = await supabase
                .from('contas_a_pagar')
                .select('*')
                .order('data_vencimento', { ascending: true })
                .limit(20);

            if (pagarData) {
                setContasPagar(pagarData);
                setTotalPagar(pagarData.filter(c => c.status === 'Pendente').reduce((a, c) => a + (c.valor || 0), 0));
                setTotalPago(pagarData.filter(c => c.status === 'Pago').reduce((a, c) => a + (c.valor || 0), 0));
            }

        } catch (error) {
            console.error('Erro ao carregar dados financeiros:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    const calcTrend = () => {
        if (!receitaMesAnterior || receitaMesAnterior === 0) return { value: '+100%', up: true };
        const diff = ((receitaMensal - receitaMesAnterior) / receitaMesAnterior) * 100;
        return { value: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`, up: diff >= 0 };
    };

    const trend = calcTrend();
    const totalClientes = clientesPorPlano.reduce((a, c) => a + c.quantidade, 0);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pago': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10';
            case 'pendente': return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10';
            case 'vencido': case 'atrasado': return 'bg-red-50 text-red-600 dark:bg-red-500/10';
            default: return 'bg-slate-50 text-slate-500 dark:bg-slate-500/10';
        }
    };

    const isVencida = (data: string) => new Date(data) < new Date() && data;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Carregando dados financeiros...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
                    <DollarSign className="absolute -right-3 -top-3 size-20 text-white/10" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Receita Mensal (MRR)</p>
                    <p className="text-3xl font-black tracking-tighter">{formatCurrency(receitaMensal)}</p>
                    <div className={`inline-flex items-center gap-1 mt-3 px-2 py-0.5 rounded-full text-[10px] font-black ${trend.up ? 'bg-white/20' : 'bg-red-500/30'}`}>
                        {trend.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {trend.value} vs mês anterior
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 flex items-center justify-center">
                            <Receipt size={20} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">A Receber</p>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{formatCurrency(totalReceber)}</p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-1">Recebido: {formatCurrency(totalRecebido)}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 flex items-center justify-center">
                            <CreditCard size={20} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">A Pagar</p>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{formatCurrency(totalPagar)}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Pago: {formatCurrency(totalPago)}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 flex items-center justify-center">
                            <Users size={20} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Clientes</p>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{totalClientes}</p>
                    <p className="text-[10px] text-violet-500 font-bold mt-1">{clientesPorPlano.length} planos ativos</p>
                </div>
            </div>

            {/* Clientes por Plano + Clientes Recentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Clientes por Plano */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <PieChart size={20} className="text-primary" />
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Clientes por Plano</h3>
                    </div>

                    {clientesPorPlano.length > 0 ? (
                        <div className="space-y-4">
                            {clientesPorPlano.map((item, i) => {
                                const pct = totalClientes > 0 ? Math.round((item.quantidade / totalClientes) * 100) : 0;
                                return (
                                    <div key={i} className="group">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-3 rounded-full ${item.cor}`} />
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.plano_nome}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-slate-400">{item.quantidade}</span>
                                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{pct}%</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.cor} rounded-full transition-all duration-700`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-8">Nenhum cliente cadastrado</p>
                    )}
                </div>

                {/* Clientes Recentes */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <UserPlus size={20} className="text-primary" />
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Clientes Recentes</h3>
                    </div>

                    {clientesRecentes.length > 0 ? (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {clientesRecentes.map((cliente, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center text-sm">
                                            {cliente.nome.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{cliente.nome}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{cliente.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary">{cliente.plano}</span>
                                        <p className="text-[10px] text-slate-400 font-medium mt-1">{cliente.data}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-8">Nenhum cliente recente</p>
                    )}
                </div>
            </div>

            {/* Contas a Receber + Contas a Pagar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contas a Receber */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 flex items-center justify-center">
                                <ArrowUpRight size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">Contas a Receber</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contasReceber.length} registros</p>
                            </div>
                        </div>
                        <span className="text-lg font-black text-emerald-600">{formatCurrency(totalReceber)}</span>
                    </div>

                    {contasReceber.length > 0 ? (
                        <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                            {contasReceber.map((conta, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                            <DollarSign size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{conta.descricao || 'Sem descrição'}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <CalendarDays size={10} className="text-slate-400" />
                                                <span className={`text-[10px] font-bold ${isVencida(conta.data_vencimento) && conta.status === 'Pendente' ? 'text-red-500' : 'text-slate-400'}`}>
                                                    {conta.data_vencimento ? new Date(conta.data_vencimento).toLocaleDateString('pt-BR') : '--'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(conta.valor || 0)}</p>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${getStatusColor(conta.status)}`}>
                                            {conta.status || 'Pendente'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CheckCircle2 size={32} className="text-emerald-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-400 font-bold">Nenhuma conta a receber</p>
                        </div>
                    )}
                </div>

                {/* Contas a Pagar */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 flex items-center justify-center">
                                <ArrowDownRight size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">Contas a Pagar</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contasPagar.length} registros</p>
                            </div>
                        </div>
                        <span className="text-lg font-black text-red-500">{formatCurrency(totalPagar)}</span>
                    </div>

                    {contasPagar.length > 0 ? (
                        <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                            {contasPagar.map((conta, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center">
                                            <CreditCard size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{conta.descricao || 'Sem descrição'}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Building2 size={10} className="text-slate-400" />
                                                <span className="text-[10px] text-slate-400 font-medium">{conta.fornecedor || 'N/A'}</span>
                                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                                <CalendarDays size={10} className="text-slate-400" />
                                                <span className={`text-[10px] font-bold ${isVencida(conta.data_vencimento) && conta.status === 'Pendente' ? 'text-red-500' : 'text-slate-400'}`}>
                                                    {conta.data_vencimento ? new Date(conta.data_vencimento).toLocaleDateString('pt-BR') : '--'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <p className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(conta.valor || 0)}</p>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${getStatusColor(conta.status)}`}>
                                            {conta.status || 'Pendente'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CheckCircle2 size={32} className="text-emerald-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-400 font-bold">Nenhuma conta a pagar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
