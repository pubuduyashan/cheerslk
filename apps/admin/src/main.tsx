import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { AuthProvider, RequireAuth } from './lib/auth';
import { AdminLayout } from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Riders from './pages/Riders';
import Users from './pages/Users';
import PromoCodes from './pages/PromoCodes';
import DeliveryZones from './pages/DeliveryZones';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="riders" element={<Riders />} />
            <Route path="users" element={<Users />} />
            <Route path="promo-codes" element={<PromoCodes />} />
            <Route path="delivery-zones" element={<DeliveryZones />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
