import ReactDOM from 'react-dom/client';
import store from './redux/store';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import ProtectedContent from './components/ProtectedContent/ProtectedContent';
import Error from "./pages/Error/Error";
import Auth from "./pages/Auth/Auth";

import './styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedContent>
              <Home />
          </ProtectedContent>
        } />
        <Route path="/auth" element={<Auth />} />
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  </Provider>
);