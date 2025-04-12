import { GlobalStyles } from './styles/GlobalStyles';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ActionsProvider } from './context/ActionsContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ActionsProvider>
                    <GlobalStyles/>
                    <AppRoutes />
                </ActionsProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;