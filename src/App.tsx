import './App.css'
import './wallet-override.css';
import WalletConnectionProvider from './component/adapter/page'

import Dashboard from './component/dashboard/page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HuskyLanding from './landingpage/page';
function App() {

  return (
    <>
      <WalletConnectionProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<HuskyLanding />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        </BrowserRouter>
      </WalletConnectionProvider>
    </>
  );
}

export default App
