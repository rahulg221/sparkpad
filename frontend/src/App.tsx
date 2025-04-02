import { GlobalStyles } from './styles/GlobalStyles';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ActionsProvider } from './context/ActionsContext';
import { ThemeProvider } from './context/ThemeContext';
import { lightTheme, darkTheme } from './styles/theme';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ActionsProvider>
                    <GlobalStyles theme={lightTheme} />
                    <AppRoutes />
                </ActionsProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;