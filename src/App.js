import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home'; 
import User from './components/User/User'; 
import NavBar from './components/NavBar/NavBar';
import Login from './components/Login/Login'; // Login bileşenini import edin
import Register from './components/Register/Register'; // Register bileşenini import edin

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/:userId" element={<User />} />
          <Route path="/giris" element={<Login />} /> 
          <Route path="/kayitol" element={<Register />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
