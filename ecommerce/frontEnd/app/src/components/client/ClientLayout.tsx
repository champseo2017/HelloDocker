import { Routes, Route } from "react-router-dom";
import HomePage from 'pages/HomePage'
import CartPage from 'pages/CartPage'

const ClientLayout = () => {
  return (
    <div>
      <h1>Client Layout</h1>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </div>
  );
};

export default ClientLayout;
