import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export interface UserProfile {
    id: string;
    nome: string;
    email: string;
    tipo: 'Administrador' | 'Profissional' | 'Tutor' | 'Família' | 'GESTOR' | 'PROFISSIONAL' | 'FAMILIA';
    escola_id?: number;
    escola_nome?: string;
    familia_id?: number;
    plataforma_id?: number;
    foto?: string;
}

export interface Permissions {
    canViewStudents: boolean;
    canEditStudents: boolean;
    canDeleteStudents: boolean;
    canViewManagement: boolean;
    canEditSchools: boolean;
    canEditTeachers: boolean;
    canEditClasses: boolean;
    canViewReports: boolean;
    canExportReports: boolean;
    canViewSettings: boolean;
    canManageUsers: boolean;
    canViewDisciplines: boolean;
    canEditDisciplines: boolean;
    canViewAllSchools: boolean;
}

const ROLE_PERMISSIONS: Record<string, Permissions> = {
    'Administrador': {
        canViewStudents: true,
        canEditStudents: true,
        canDeleteStudents: true,
        canViewManagement: true,
        canEditSchools: true,
        canEditTeachers: true,
        canEditClasses: true,
        canViewReports: true,
        canExportReports: true,
        canViewSettings: true,
        canManageUsers: true,
        canViewDisciplines: true,
        canEditDisciplines: true,
        canViewAllSchools: true
    },
    'GESTOR': {
        canViewStudents: true,
        canEditStudents: true,
        canDeleteStudents: true,
        canViewManagement: false,
        canEditSchools: true,
        canEditTeachers: true,
        canEditClasses: true,
        canViewReports: true,
        canExportReports: true,
        canViewSettings: true,
        canManageUsers: true,
        canViewAllSchools: false,
        canViewDisciplines: true,
        canEditDisciplines: true
    },
    'Profissional': {
        canViewStudents: true,
        canEditStudents: true,
        canDeleteStudents: false,
        canViewManagement: true,
        canEditSchools: false,
        canEditTeachers: false,
        canEditClasses: true,
        canViewReports: true,
        canExportReports: true,
        canViewSettings: false,
        canManageUsers: false,
        canViewDisciplines: true,
        canEditDisciplines: true,
        canViewAllSchools: false
    },
    'PROFISSIONAL': {
        canViewStudents: true,
        canEditStudents: true,
        canDeleteStudents: false,
        canViewManagement: true,
        canEditSchools: false,
        canEditTeachers: false,
        canEditClasses: true,
        canViewReports: true,
        canExportReports: true,
        canViewSettings: false,
        canManageUsers: false,
        canViewDisciplines: true,
        canEditDisciplines: true,
        canViewAllSchools: false
    },
    'Tutor': {
        canViewStudents: true,
        canEditStudents: false,
        canDeleteStudents: false,
        canViewManagement: false,
        canEditSchools: false,
        canEditTeachers: false,
        canEditClasses: false,
        canViewReports: true,
        canExportReports: false,
        canViewSettings: false,
        canManageUsers: false,
        canViewDisciplines: false,
        canEditDisciplines: false,
        canViewAllSchools: false
    },
    'FAMILIA': {
        canViewStudents: true,
        canEditStudents: false,
        canDeleteStudents: false,
        canViewManagement: false,
        canEditSchools: false,
        canEditTeachers: false,
        canEditClasses: false,
        canViewReports: true,
        canExportReports: false,
        canViewSettings: false,
        canManageUsers: false,
        canViewDisciplines: false,
        canEditDisciplines: false,
        canViewAllSchools: false
    },
    'Família': {
        canViewStudents: true,
        canEditStudents: false,
        canDeleteStudents: false,
        canViewManagement: false,
        canEditSchools: false,
        canEditTeachers: false,
        canEditClasses: false,
        canViewReports: true,
        canExportReports: false,
        canViewSettings: false,
        canManageUsers: false,
        canViewDisciplines: false,
        canEditDisciplines: false,
        canViewAllSchools: false
    }
};

export const useAuth = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [permissions, setPermissions] = useState<Permissions | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (!authUser) {
                    setUser(null);
                    setPermissions(null);
                    setLoading(false);
                    return;
                }


                const { data: profileData } = await supabase
                    .from('Usuarios')
                    .select('*, Professores(Escola_ID, Escolas(Nome))')
                    .eq('auth_uid', authUser.id)
                    .single();

                if (profileData) {
                    let familiaId: number | undefined;

                    if (profileData.Tipo === 'Família' || profileData.Tipo === 'Tutor') {
                        const { data: familyData } = await supabase
                            .from('Familias')
                            .select('Familia_ID')
                            .eq('Email', profileData.Email)
                            .maybeSingle();
                        familiaId = familyData?.Familia_ID;
                    }
                    const userProfile: UserProfile = {
                        id: profileData.Usuario_ID,
                        nome: profileData.Nome,
                        email: profileData.Email,
                        tipo: profileData.Tipo,
                        escola_id: profileData.Professores?.[0]?.Escola_ID,
                        escola_nome: profileData.Professores?.[0]?.Escolas?.Nome,
                        familia_id: familiaId,
                        plataforma_id: profileData.Plataforma_ID,
                        foto: profileData.Foto
                    };

                    setUser(userProfile);
                    setPermissions(ROLE_PERMISSIONS[profileData.Tipo] || ROLE_PERMISSIONS['Família']);
                }
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();


        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchUserProfile();
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, permissions, loading };
};

export const getPermissions = (tipo: string): Permissions => {
    return ROLE_PERMISSIONS[tipo] || ROLE_PERMISSIONS['Família'];
};
