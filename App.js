import {NavigationContainer} from '@react-navigation/native';
import { ThemeProvider } from './components/ThemeContext';
import AppNavigation from './navigation/AppNavigation';

function App() {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <AppNavigation />
            </NavigationContainer>
        </ThemeProvider>
    );
}

export default App;