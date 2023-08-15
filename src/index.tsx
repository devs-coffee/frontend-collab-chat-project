import ReactDOM from 'react-dom/client';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import IoSocketProvider from './Providers/IoSocketProvider';
import { Home } from "./pages/Home/Home";
import { ProtectedContent } from './components';
import { Profile, Error, Auth, Dashboard, UserDisplay, ServerDisplay } from './pages/';
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
          <Route path="server/:serverId" element={<ServerDisplay />} />
          <Route path="/user/:userId" element={<UserDisplay />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  </Provider>
);