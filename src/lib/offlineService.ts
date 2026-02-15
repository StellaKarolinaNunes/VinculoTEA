export interface OfflineAction {
    id: string;
    type: 'INSERT' | 'UPDATE' | 'DELETE';
    table: string;
    data: any;
    timestamp: number;
}

const STORAGE_KEY = 'vinculotea_offline_actions';

export const saveOfflineAction = (action: Omit<OfflineAction, 'id' | 'timestamp'>) => {
    const actions: OfflineAction[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newAction: OfflineAction = {
        ...action,
        id: crypto.randomUUID(),
        timestamp: Date.now()
    };
    actions.push(newAction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));


    window.dispatchEvent(new CustomEvent('offline-action-saved', { detail: newAction }));
};

export const syncOfflineActions = async (supabase: any) => {
    if (!navigator.onLine) return;

    const actions: OfflineAction[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (actions.length === 0) return;

    console.log(`Sincronizando ${actions.length} ações pendentes...`);
    const remaining: OfflineAction[] = [];

    for (const action of actions) {
        try {
            let query;
            if (action.type === 'INSERT') {
                query = supabase.from(action.table).insert(action.data);
            } else if (action.type === 'UPDATE') {
                query = supabase.from(action.table).update(action.data).eq('id', action.data.id);
            } else if (action.type === 'DELETE') {
                query = supabase.from(action.table).delete().eq('id', action.data.id);
            }

            const { error } = await query;
            if (error) throw error;

        } catch (e) {
            console.error('Falha ao sincronizar ação:', action, e);
            remaining.push(action); 
        }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    if (remaining.length === 0) {
        console.log('Sincronização offline concluída com sucesso!');
    }
};


if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {

        window.dispatchEvent(new CustomEvent('request-sync'));
    });
}
