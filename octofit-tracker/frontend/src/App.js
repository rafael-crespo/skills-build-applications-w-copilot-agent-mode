import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import logo from './octofitapp-small.svg';

function App() {
  return (
    <div className="App">
      <header className="app-hero text-white py-4 mb-4">
        <div className="container">
          <div className="d-flex align-items-center gap-3 mb-3">
            <img src={logo} alt="OctoFit Tracker" className="app-logo" />
            <div>
              <h1 className="display-6 mb-1">OctoFit Tracker Dashboard</h1>
              <p className="lead mb-0 text-white-50">
                Browse backend REST API data with a Bootstrap-powered React interface.
              </p>
            </div>
          </div>
        </div>
      </header>

      <nav className="navbar navbar-expand-lg navbar-dark app-nav mb-4">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center" to="/activities">
            <img src={logo} alt="OctoFit" className="nav-logo me-2" />
            OctoFit Tracker
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/activities">
                  Activities
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/workouts">
                  Workouts
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/teams">
                  Teams
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/users">
                  Users
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/leaderboard">
                  Leaderboard
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mb-5">
        <Routes>
          <Route path="/" element={<Navigate replace to="/activities" />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
