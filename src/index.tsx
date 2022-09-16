import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./providers/Store";

import Home from "./pages/Home/Home";
import ProtectedContent from './components/ProtectedContent/ProtectedContent';
import Error from "./pages/Error/Error";
import Auth from "./pages/Auth/Auth";
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

import './styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <StoreProvider>
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedContent>
              <Home />
          </ProtectedContent>
          
        } />
        <Route path="/auth" element={<Auth />} >
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  </StoreProvider>
);