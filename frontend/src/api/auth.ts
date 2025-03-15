import { supabase } from "./supabaseClient";
import { AuthError, User, Session } from '@supabase/supabase-js';

interface AuthResponse {
  user: User | null;
  session: Session | null;
}

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
};

export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    if (!email || !email.includes('@')) {
        throw new Error('Invalid email format');
    }
    if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
};

export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};



