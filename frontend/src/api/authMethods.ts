import { supabase } from "./supabaseClient";
import { User } from '../models/userModel';

export const signIn = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    // Add user to users table if they don't exist yet
    const { data: existingUser} = await supabase
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
                    email: data.user?.email
                }
            ]);
        
        if (insertError) {
            console.error('Error creating user record:', insertError);
        }
    }

    if (error) {
        throw error;
    }
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
};

export const signUp = async (email: string, password: string): Promise<void> => {
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
};

export const getCurrentUser= async (): Promise<User | null> => {
  try {
    // Get the authenticated user first
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser?.id) {
      return null;
    }

    // Query the users table using the auth_id
    const { data: User, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authUser.id)
      .single();

    if (error) {
      console.error('Error fetching user from DB:', error);
      throw error;
    }

    return User;
  } catch (error) {
    console.error('Error in getCurrentUserFromDB:', error);
    throw error;
  }
};

