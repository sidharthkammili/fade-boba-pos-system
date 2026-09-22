import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import AccessibilityWidget from './components/AccessibilityWidget';

const Portal = lazy(() => import('./pages/Portal'));
const Login = lazy(() => import('./pages/Login'));
const Manager = lazy(() => import('./pages/Manager'));
const Cashier = lazy(() => import('./pages/Cashier'));
const CustomerKiosk = lazy(() => import('./pages/CustomerKiosk'));
const MenuBoard = lazy(() => import('./pages/MenuBoard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const QAConsole = lazy(() => import('./pages/QAConsole'));
const UserStudy = lazy(() => import('./pages/UserStudy'));

export default function App() {
  return (
    <ErrorBoundary>
      <AccessibilityWidget />
      <BrowserRouter>
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', background: '#0D0818' }}><h2>Loading...</h2></div>}>
          <Routes>
            <Route path="/" element={<Portal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/manager" element={<Manager />} />
            <Route path="/cashier" element={<Cashier />} />
            <Route path="/kiosk" element={<CustomerKiosk />} />
            <Route path="/menuboard" element={<MenuBoard />} />
            <Route path="/qa" element={<QAConsole />} />
            <Route path="/user-study" element={<UserStudy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}