// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from "./pages/Home/Home";
import './styles/index.scss';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./providers/Store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StoreProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/error" element={<Error />} /> */}
        {/* <Route path="*" element={<Error />} /> */}
      </Routes>
    </Router>
  </StoreProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
