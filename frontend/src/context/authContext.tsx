import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut, getCurrentUser } from '../api/authMethods';
import { User } from '../models/userModel';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getCurrentUser();
                setUser(user);
            } catch (err) {
                console.error('Error fetching user:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const signIn = async (email: string, password: string) => {
        await supabaseSignIn(email, password);
        const user = await getCurrentUser();
        setUser(user);
    };

    const signUp = async (email: string, password: string) => {
        await supabaseSignUp(email, password);
        const user = await getCurrentUser();
        setUser(user);
    };

    const signOut = async () => {
        await supabaseSignOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            signIn,
            signUp,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};


