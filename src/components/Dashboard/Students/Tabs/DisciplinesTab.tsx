import { useState, useEffect } from 'react';
import { Plus, BookOpen, User, Check, Trash2, X, Play, Loader2, Calendar, Layout, AlertTriangle, CheckCircle2, Edit3, Link, Unlink, Info } from 'lucide-react';
import { studentService } from '@/lib/studentService';
import { executionService } from '@/lib/executionService';
import { disciplinesService } from '@/lib/disciplinesService';
import { useAuth } from '@/lib/useAuth';

interface Teacher {
    id: string;
    nome: string;
    especialidade: string;
}

interface Discipline {
    id: string;
    nome: string;
    descricao?: string;
    ativa: boolean;
    professores?: string[]; // Global list
    professor_id?: string; // Specific override
    professor_nome?: string; // Specific override name
    professor_especialidade?: string;
}

export const DisciplinesTab = ({ studentId, studentName, studentData }: { studentId: string, studentName: string, studentData: any }) => {
    const { user: authUser } = useAuth();
    const [isExecuting, setIsExecuting] = useState<Discipline | null>(null);
    const [loading, setLoading] = useState(true);
    const [disciplines, setDisciplines] = useState<Discipline[]>([]); // Student's disciplines

    const [execForm, setExecForm] = useState({
        data: new Date().toISOString().split('T')[0],
        atividade: '',
        nivel_suporte: 'sem suporte' as any,
        tipo_barreira: 'cognitiva' as any,
        status: 'andamento' as any,
        observacoes: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const studentDisciplines = await studentService.getStudentDisciplines(studentId);
            setDisciplines(studentDisciplines);

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [studentId]);

    const handleUnlinkDiscipline = async (id: string, nome: string) => {
        if (!window.confirm(`Tem certeza que deseja remover ${nome} da grade deste aluno?`)) return;
        try {
            await studentService.unlinkStudentDiscipline(studentId, id);
            await fetchData();
        } catch (error) {
            console.error('Erro ao desvincular disciplina:', error);
            alert('Erro ao desvincular disciplina.');
        }
    };

    const handleSaveExecution = async () => {
        if (!isExecuting) return;
        try {
            await executionService.create({
                student_id: studentId,
                disciplina_id: isExecuting.id,
                ...execForm
            });
            alert('Execução salva com sucesso!');
            setIsExecuting(null);
            setExecForm({
                data: new Date().toISOString().split('T')[0],
                atividade: '',
                nivel_suporte: 'sem suporte',
                tipo_barreira: 'cognitiva',
                status: 'andamento',
                observacoes: ''
            });
        } catch (error) {
            console.error('Erro ao salvar execução:', error);
            alert('Erro ao salvar execução. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border-[1.5px] border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight italic">Grade <span className="text-primary">Curricular</span></h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gerencie as matérias e docentes vinculados a {studentName}</p>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full p-20 flex flex-col items-center gap-4 bg-white dark:bg-slate-800 rounded-[2.5rem]">
                        <Loader2 className="text-primary animate-spin" size={40} />
                        <p className="text-[10px] font-black uppercase text-slate-400">Sincronizando Matriz Curricular...</p>
                    </div>
                ) : disciplines.length > 0 ? (
                    disciplines.map((disc) => (
                        <div key={disc.id} className="group bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border-[1.5px] border-slate-100 dark:border-slate-700 hover:border-primary/20 transition-all relative flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <BookOpen size={28} />
                                </div>
                                <button
                                    onClick={() => handleUnlinkDiscipline(disc.id, disc.nome)}
                                    className="p-3 text-slate-300 hover:text-red-500 transition-all bg-slate-50 dark:bg-slate-900/50 rounded-xl"
                                    title="Remover da Grade"
                                >
                                    <Unlink size={18} />
                                </button>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{disc.nome}</h4>
                                    {disc.descricao && <p className="text-sm font-medium text-slate-500 line-clamp-2 mt-1">{disc.descricao}</p>}
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Docente Responsável</p>
                                            <p className="text-xs font-bold text-slate-800 dark:text-white">
                                                {disc.professor_nome || 'Docentes Compartilhados'}
                                            </p>
                                        </div>
                                    </div>
                                    {disc.professor_especialidade && (
                                        <p className="text-[10px] font-medium text-slate-400 ml-10">{disc.professor_especialidade}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                                <button
                                    onClick={() => setIsExecuting(disc)}
                                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg"
                                >
                                    <Play size={14} fill="currentColor" /> Executar Tarefa
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full p-20 text-center bg-white dark:bg-slate-800 rounded-[2.5rem] border-[1.5px] border-slate-100 dark:border-slate-700 border-dashed">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Matriz Curricular Vazia</p>
                        <p className="text-xs text-slate-500">Acesse "Matriz Curricular" no menu lateral para gerenciar as disciplinas deste aluno.</p>
                    </div>
                )}
            </div>
            {/* Execution Modal */}
            {isExecuting && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[3rem] shadow-2xl my-8 animate-in zoom-in-95 duration-300">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">Executar <span className="text-primary">Tarefa PEI</span></h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registro de atividade: {isExecuting.nome}</p>
                                </div>
                                <button onClick={() => setIsExecuting(null)} className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex gap-2 items-center">
                                        <Calendar size={12} className="text-primary" /> Data (DD/MM/AAAA)
                                    </label>
                                    <input type="date" value={execForm.data} onChange={(e) => setExecForm({ ...execForm, data: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 px-5 py-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary/20" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex gap-2 items-center">
                                        <CheckCircle2 size={12} className="text-primary" /> Status
                                    </label>
                                    <select value={execForm.status} onChange={(e) => setExecForm({ ...execForm, status: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 px-5 py-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary/20">
                                        <option value="concluido">Concluído ✅</option>
                                        <option value="andamento">Em Andamento 🔄</option>
                                        <option value="replanejar">Replanejar ⚠️</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex gap-2 items-center">
                                        <Layout size={12} className="text-primary" /> Atividade / Objetivo do PEI
                                    </label>
                                    <input type="text" value={execForm.atividade} onChange={(e) => setExecForm({ ...execForm, atividade: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 px-5 py-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary/20" placeholder="Qual objetivo está sendo trabalhado?" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex gap-2 items-center">
                                        <Info size={12} className="text-primary" /> Nível de Suporte
                                    </label>
                                    <select value={execForm.nivel_suporte} onChange={(e) => setExecForm({ ...execForm, nivel_suporte: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 px-5 py-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary/20">
                                        <option value="sem suporte">Sem Suporte</option>
                                        <option value="parcial">Suporte Parcial</option>
                                        <option value="total">Suporte Total</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex gap-2 items-center">
                                        <AlertTriangle size={12} className="text-primary" /> Tipo de Barreira
                                    </label>
                                    <select value={execForm.tipo_barreira} onChange={(e) => setExecForm({ ...execForm, tipo_barreira: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 px-5 py-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary/20">
                                        <option value="cognitiva">Cognitiva</option>
                                        <option value="motora">Motora</option>
                                        <option value="sensorial">Sensorial</option>
                                        <option value="comportamental">Comportamental</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observações da Atividade</label>
                                    <textarea value={execForm.observacoes} onChange={(e) => setExecForm({ ...execForm, observacoes: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 px-5 py-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary/20 h-24" placeholder="Como o aluno se comportou? Houve evolução?" />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setIsExecuting(null)} className="flex-1 py-4 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Cancelar</button>
                                <button onClick={handleSaveExecution} className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02]">Salvar Execução</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
