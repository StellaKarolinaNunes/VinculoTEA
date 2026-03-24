import { useState, useEffect } from 'react';
import {
    Plus, Edit2, Trash2, CheckCircle2, XCircle,
    DollarSign, Users, Award, Trash, Loader2,
    AlertCircle, ChevronRight, Search, Activity
} from 'lucide-react';
import { planService, Plan } from '@/lib/planService';

const PlanForm = ({
    initialData,
    onSave,
    onCancel,
    isLoading
}: {
    initialData?: Plan,
    onSave: (data: Plan) => void,
    onCancel: () => void,
    isLoading: boolean
}) => {
    const [formData, setFormData] = useState<Plan>(initialData || {
        nome: '',
        quantidade_alunos: 0,
        valor_mensal: 0,
        valor_onboarding: 0,
        valor_unitario: 0,
        valor_aluno_excedente: 0,
        status: 'Ativo'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let processedValue: any = value;
        if (type === 'number') {
            processedValue = value === '' ? 0 : parseFloat(value);
            if (processedValue < 0) processedValue = 0;
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nome || formData.quantidade_alunos <= 0 || formData.valor_mensal < 0) {
            alert('Por favor, preencha os campos obrigatórios corretamente.');
            return;
        }
        onSave(formData);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white italic">
                        {initialData ? 'Editar' : 'Novo'} <span className="text-primary">Plano</span>
                    </h3>
                    <p className="text-xs font-medium text-slate-400">Configure os limites e valores do serviço</p>
                </div>
                <button onClick={onCancel} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-red-50 hover:text-red-500 transition-all">
                    <XCircle size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Plano *</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary transition-all outline-none"
                        placeholder="Ex: Plano Intermediário 20"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qtd. Alunos *</label>
                    <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="number"
                            name="quantidade_alunos"
                            value={formData.quantidade_alunos}
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor Mensal (R$) *</label>
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="number"
                            step="0.01"
                            name="valor_mensal"
                            value={formData.valor_mensal}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Onboarding (R$)</label>
                    <div className="relative">
                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="number"
                            step="0.01"
                            name="valor_onboarding"
                            value={formData.valor_onboarding}
                            onChange={handleChange}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold focus:border-primary transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor Unitário (R$)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="valor_unitario"
                        value={formData.valor_unitario}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary transition-all outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aluno Excedente (R$)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="valor_aluno_excedente"
                        value={formData.valor_aluno_excedente}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary transition-all outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-[1.5px] border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary transition-all outline-none appearance-none"
                    >
                        <option value="Ativo">🟢 Ativo</option>
                        <option value="Inativo">🔴 Inativo</option>
                    </select>
                </div>

                <div className="md:col-span-2 flex gap-4 pt-6 border-t border-slate-50 dark:border-slate-800 mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-[2] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : (initialData ? 'Atualizar Plano' : 'Criar Plano Vitalício')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export const PlansTab = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | undefined>();
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const fetchPlans = async () => {
        try {
            setIsLoading(true);
            const data = await planService.getAll();
            setPlans(data || []);
        } catch (error) {
            console.error('Erro ao buscar planos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleSave = async (data: Plan) => {
        try {
            setIsLoading(true);
            if (editingPlan?.plano_id) {
                await planService.update(editingPlan.plano_id, data);
            } else {
                await planService.create(data);
            }
            setIsFormOpen(false);
            setEditingPlan(undefined);
            fetchPlans();
        } catch (error) {
            console.error('Erro ao salvar plano:', error);
            alert('Falha ao salvar o plano. Verifique os dados.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await planService.delete(id);
            fetchPlans();
        } catch (error) {
            console.error('Erro ao excluir plano:', error);
            alert('Não é possível excluir planos vinculados a plataformas ativas.');
        } finally {
            setIsDeleting(null);
        }
    };

    const toggleStatus = async (plan: Plan) => {
        if (!plan.plano_id) return;
        try {
            await planService.toggleStatus(plan.plano_id, plan.status);
            fetchPlans();
        } catch (error) {
            console.error('Erro ao alternar status:', error);
        }
    };

    if (isFormOpen) {
        return (
            <PlanForm
                initialData={editingPlan}
                onSave={handleSave}
                onCancel={() => { setIsFormOpen(false); setEditingPlan(undefined); }}
                isLoading={isLoading}
            />
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight italic">
                        Gestão de <span className="text-primary">Planos & Assinaturas</span>
                    </h2>
                    <p className="text-xs font-medium text-slate-500">Defina os modelos de negócio e limites da plataforma</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-xs uppercase tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl shadow-black/10"
                >
                    <Plus size={18} strokeWidth={3} />
                    Criar Novo Plano
                </button>
            </div>

            {isLoading && plans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Modelos...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.plano_id}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all group relative overflow-hidden"
                        >
                            {/* Status Ribbon */}
                            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-black text-[9px] uppercase tracking-[0.2em] text-white ${plan.status === 'Ativo' ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}>
                                {plan.status}
                            </div>

                            <div className="space-y-6">
                                <div className="size-16 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Activity size={32} />
                                </div>

                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">{plan.nome}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Users size={14} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-400">Até {plan.quantidade_alunos} Alunos</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-slate-900 dark:text-white italic">R${plan.valor_mensal.toLocaleString('pt-BR')}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">/ mês</span>
                                    </div>
                                    {plan.valor_onboarding && plan.valor_onboarding > 0 && (
                                        <p className="text-[9px] font-bold text-emerald-600 mt-2 uppercase tracking-tighter italic">
                                            + R${plan.valor_onboarding.toLocaleString('pt-BR')} Taxa de Setup
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setEditingPlan(plan); setIsFormOpen(true); }}
                                        className="flex-1 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border border-slate-100 dark:border-slate-700"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => { if (confirm('Excluir este plano?')) handleDelete(plan.plano_id!); }}
                                        className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {plans.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50/50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={40} className="text-slate-400" />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Nenhum plano disponível no catálogo</p>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="mt-6 text-primary font-black text-xs uppercase underline underline-offset-4"
                            >
                                Cadastre o primeiro agora
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
