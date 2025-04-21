import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { UserService } from '../api/userService';
import { User } from '../models/userModel';
import CalendarService from '../api/calendarService';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isGoogleConnected: boolean;
    lockedCategories: string[];
    setLockedCategories: (lockedCategories: string[]) => void;
    setIsGoogleConnected: (isGoogleConnected: boolean) => void;
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGoogleConnected, setIsGoogleConnected] = useState(false);
    const [lockedCategories, setLockedCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await UserService.getCurrentUser();
                setLockedCategories(user?.locked_categories || []);
                setUser(user);

                if (user) {
                    const isGoogleConnected = await CalendarService.checkCalendarAccess(user.id!);
                    setIsGoogleConnected(isGoogleConnected);
                }
            } catch (err) {
                console.error('Error fetching user:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();     
    }, []);

    const signIn = async (email: string, password: string) => {
        await UserService.signIn(email, password);
        const user = await UserService.getCurrentUser();
        setUser(user);
    };

    const signUp = async (email: string, password: string) => {
        const message = await UserService.signUp(email, password);
        const user = await UserService.getCurrentUser();
        setUser(user);
        return message; 
    };
      
    const signOut = async () => {
        await UserService.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isGoogleConnected,
            lockedCategories,
            setIsGoogleConnected,
            setLockedCategories,
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


