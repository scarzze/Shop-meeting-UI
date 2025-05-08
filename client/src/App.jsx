import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import FloatingContactButton from './components/contact';
import FaqPage from './pages/FaqPage';


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FaqPage />} />
        {/* <Route path="/search" element={<SearchResults />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <FloatingContactButton />
      {/* Add any other components you want to include globally */}
    </div>
  );
};

export default App;
