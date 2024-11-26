import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import SecuredRoute from './components/SecuredRoutes';

function About() {
  return <h1>About Page</h1>;
}

function Contact() {
  return <h1>Contact Page</h1>;
}

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SecuredRoute><Home /></SecuredRoute>} />
          <Route path='/login' element={<LoginPage />} />
          <Route path="/about" element={<SecuredRoute><About /></SecuredRoute>} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
