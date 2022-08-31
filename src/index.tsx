import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from "./pages/Home/Home";
import Error from "./pages/Error/Error";
import './styles/index.scss';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./providers/Store";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <StoreProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  </StoreProvider>
);