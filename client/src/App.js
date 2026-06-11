import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HotelDetailPage from './pages/HotelDetailPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmPage from './pages/BookingConfirmPage';
import SearchPage from './pages/SearchPage';
import ListPage from './pages/ListPage';
import AdminPage from './pages/AdminPage';
import ConfirmHotelPage from './pages/ConfirmHotelPage';

function AdminWrapper() {
  const navigate = useNavigate();
  return <AdminPage onBack={() => navigate('/')}/>;
}

function ListWrapper() {
  const navigate = useNavigate();
  return <ListPage onBack={() => navigate('/')}/>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hotel/:id" element={<HotelDetailPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/booking-confirmed" element={<BookingConfirmPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/list" element={<ListWrapper />} />
        <Route path="/admin" element={<AdminWrapper />} />
        <Route path="/confirm/:ref" element={<ConfirmHotelPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
