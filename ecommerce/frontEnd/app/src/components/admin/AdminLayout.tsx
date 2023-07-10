import { Routes, Route } from "react-router-dom";
import AdminHomePage from "pages/admin/AdminHomePage";
import AdminProductPage from "pages/admin/AdminProductPage";
import Navbar from "./Navbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <Routes>
          <Route path="/" element={<AdminHomePage />} />
          <Route path="/product" element={<AdminProductPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
