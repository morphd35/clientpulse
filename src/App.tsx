import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PlacesServiceInit from './components/PlacesServiceInit';
import SignInPage from './features/auth/pages/SignInPage';
import SignUpPage from './features/auth/pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import AccountForm from './pages/AccountForm';
import CallList from './pages/CallList';
import Appointments from './pages/Appointments';
import RouteView from './pages/RouteView';

function App() {
  return (
    <Router>
      <PlacesServiceInit />
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/new" element={<AccountForm />} />
          <Route path="accounts/:id" element={<AccountForm />} />
          <Route path="call-list" element={<CallList />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="route" element={<RouteView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;