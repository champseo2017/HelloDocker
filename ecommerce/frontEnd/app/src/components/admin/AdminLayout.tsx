import { Routes, Route } from "react-router-dom";
import AdminHomePage from 'pages/admin/AdminHomePage'
import AdminProductPage from 'pages/admin/AdminProductPage'

const AdminLayout = () => {
  return (
    <div>
      <h1>Admin Layout</h1>
      <Routes>
        <Route path="/" element={<AdminHomePage />} />
        <Route path="/product" element={<AdminProductPage />} />
      </Routes>
    </div>
  );
};

export default AdminLayout;
