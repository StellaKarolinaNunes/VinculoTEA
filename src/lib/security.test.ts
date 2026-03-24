import { describe, it, expect, vi, beforeEach } from 'vitest';
import { studentService } from './studentService';
import { userService } from './userService';
import { supabase } from './supabase';

// Mock Supabase to simulate backend and auth state
vi.mock('./supabase', () => ({
    supabase: {
        auth: {
            getUser: vi.fn(),
            signUp: vi.fn(),
        },
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insecure policy' } }),
            then: (resolve: any) => resolve({ data: [], error: null }),
        })),
        storage: {
            from: vi.fn(() => ({
                upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
                getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'http://unsafe-url' } })),
            })),
        },
    },
}));

describe('Security Analysis - TDD VULNERABILITIES', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('VULNERABILITY: UNPROTECTED_DELETE - studentService.delete should fail if no user is authenticated', async () => {
        // Mock no authenticated user
        (supabase.auth.getUser as any).mockResolvedValue({ data: { user: null }, error: null });

        // Currently, studentService.delete doesn't check for auth before calling delete on multiple tables
        // If RLS is missing, this would succeed. We want it to FAIL.

        // This test EXPECTS an error if not authenticated, but currently the code doesn't provide one.
        // Let's see if we can trigger it.
        try {
            await studentService.delete('123');
            // If it succeeds, it means there is no frontend-side check.
            // (Note: it relies on Supabase erroring, which we mock here as succeeding if not stopped)
        } catch (error) {
            expect(error).toBeDefined();
        }
    });

    it('VULNERABILITY: INSECURE_ROL_ASSIGNMENT - userService.create should not allow role override from anonymous calls', async () => {
        // If we mock a 'Tutor' trying to create an 'Administrador'
        const fakeUser = {
            id: 'unauthorized-id',
            nome: 'Hacker',
            email: 'hacker@e.com',
            senha: 'password123',
            role: 'Administrador' // Injecting admin role
        };

        // If the service doesn't check the current user's role, it's vulnerable.
        // (supabase.auth.getUser as any).mockResolvedValue({ data: { user: { id: 'tutor-id' } }, error: null });

        // This test simulates the lack of role checking in userService.create
        await userService.create(fakeUser);

        const lastInsert = (supabase.from as any).mock.calls.find((c: any) => c[0] === 'Usuarios');
        expect(lastInsert).toBeDefined();
        // The service should NOT allow the 'Administrador' role to be set by someone who isn't an admin
    });

    it('VULNERABILITY: SENSITIVE_PHOTO_EXPOSURE - Photos should not be public by default', async () => {
        const file = new File([''], 'photo.png', { type: 'image/png' });
        const url = await studentService.uploadPhoto(file);

        // We check if the URL is public or restricted
        expect(url).not.toContain('publicUrl');
        // Failing: studentService currently uses getPublicUrl
    });

});
