import { useEffect, useRef } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { supabase } from '../../lib/supabase';

export const CloudSync = () => {
    const { config, setConfig } = useAccessibility();
    const isInitialMount = useRef(true);

    
    useEffect(() => {
        if (!config.syncToCloud) return;
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const saveToCloud = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return; 

                
                
                

                
                const { error } = await supabase
                    .from('profiles')
                    .update({ accessibility_config: config })
                    .eq('id', user.id);

                if (error) console.error('Cloud Sync Error:', error.message);
            } catch (err) {
                console.error('Cloud Sync Exception:', err);
            }
        };

        
        const timeout = setTimeout(saveToCloud, 2000);
        return () => clearTimeout(timeout);
    }, [config]);

    
    useEffect(() => {
        if (!config.syncToCloud) return;

        const loadFromCloud = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('profiles')
                    .select('accessibility_config')
                    .eq('id', user.id)
                    .single();

                if (data?.accessibility_config) {
                    
                    console.log('Syncing accessibility from cloud...');
                    setConfig(prev => ({ ...prev, ...data.accessibility_config }));
                }
            } catch (err) {
                console.error('Cloud Load Exception:', err);
            }
        };

        loadFromCloud();
    }, []); 

    return null;
};
