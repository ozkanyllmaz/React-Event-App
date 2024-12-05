import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home'; 
import User from './components/User/User'; 
import NavBar from './components/NavBar/NavBar';
import Login from './components/Login/Login'; // Login bileşenini import edin
import Register from './components/Register/Register'; // Register bileşenini import edin
import Profile from './components/Profile/Profile';
import ForgotPassword from './components/ForgotPassword/ForgotPassword ';
import CreateEvent from './components/CreateEvent/CreateEvent';
import EventDetail from './components/EventDetail/EventDetail';
import MyEvents from './components/MyEvents/MyEvents';

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/event" element={<CreateEvent />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/event/detail/:eventId" element={<EventDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/etkinliklerim" element={<MyEvents />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
