import { supabase } from './supabaseClient';
import { User } from '../models/userModel';

export class AuthService {
  static async signIn(email: string, password: string): Promise<void> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Add user to users table if they don't exist yet
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('auth_id', data.user?.id)
      .single();

    if (!existingUser) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            auth_id: data.user?.id,
            email: data.user?.email,
          },
        ]);

      if (insertError) {
        console.error('Error creating user record:', insertError);
      }
    }
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    //localStorage.clear();

    if (error) {
      throw error;
    }
  }

  static async signUp(email: string, password: string): Promise<void> {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser?.id) {
        return null;
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user from DB:', error);
        throw error;
      }

      return user;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      throw error;
    }
  }
}

