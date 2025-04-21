import { GlobalStyles } from './styles/GlobalStyles';
import { AppRoutes } from './routes/AppRoutes';
import { AppProviders } from './context/AppProviders';

function App() {
    return (
        <AppProviders>
            <GlobalStyles/>
            <AppRoutes />
        </AppProviders>
    );
}

export default App;