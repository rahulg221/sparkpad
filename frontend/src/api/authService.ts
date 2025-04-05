import { supabase } from './supabaseClient';
import { User } from '../models/userModel';

export class AuthService {
  static async signIn(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    //localStorage.clear();

    if (error) {
      throw error;
    }
  }

  static async signUp(email: string, password: string): Promise<string> {
    if (!email || !email.includes('@')) {
      return "Invalid email format.";
    }
  
    if (!password || password.length < 6) {
      return "Password must be at least 6 characters.";
    }
  
    const { data, error } = await supabase.auth.signUp({ email, password });
  
    if (error) {
      const msg = error.message.toLowerCase();

      if (msg.includes("invalid email")) return "Please enter a valid email address.";
      if (msg.includes("user already registered")) return "This email is already registered.";

      return "Something went wrong. Please try again.";
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

    return "Signup successful. Please log in.";
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

