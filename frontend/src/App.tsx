import { GlobalStyles } from './styles/GlobalStyles';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthProvider';
import { AppProviders } from './context/AppProviders';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppProviders>
                    <GlobalStyles/>
                    <AppRoutes />
                </AppProviders>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;