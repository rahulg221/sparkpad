import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <GlobalStyles />
                <AppRoutes />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;