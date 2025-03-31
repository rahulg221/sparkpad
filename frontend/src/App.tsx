import { GlobalStyles } from './styles/GlobalStyles';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ActionsProvider } from './context/ActionsContext';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <ActionsProvider>
                    <GlobalStyles />
                    <AppRoutes />
                </ActionsProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;