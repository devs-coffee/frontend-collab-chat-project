import ReactDOM from 'react-dom/client';
import store from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import IoSocketProvider from './Providers/IoSocketProvider';
import Home from "./pages/Home/Home";
import ProtectedContent from './components/ProtectedContent/ProtectedContent';
import Profile from './pages/Profile/Profile';
import Error from "./pages/Error/Error";
import Auth from "./pages/Auth/Auth";
import Dashboard from './pages/Dashboard/Dashboard';

import './styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedContent>
            <IoSocketProvider>
              <Home />
            </IoSocketProvider>
          </ProtectedContent>
        } >
          <Route path="/" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  </Provider>
);