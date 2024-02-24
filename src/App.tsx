import 'typeface-poppins';
import '@/styles/global.css';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';

function App() {
    return (
        <>
            <BrowserRouter basename='/'>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/loja' element={<StorePage />} />
                    <Route path='/bem-vindo' element={<WelcomePage />} />
                </Routes>
            </BrowserRouter>

            <Toaster />
        </>
    );
}

export default App;
