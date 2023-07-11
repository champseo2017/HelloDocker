import { Routes, Route } from "react-router-dom";
import AdminHomePage from "pages/admin/AdminHomePage";
import AdminProductPage from "pages/admin/AdminProductPage";
import AdminEditProductPage from "pages/admin/AdminEditProductPage";
import Navbar from "./Navbar";
import Footer from "components/client/Footer";

const AdminLayout = () => {
  return (
    <div className="bg-gray-100 flex flex-col justify-between min-h-screen">
      <Navbar />
      <div className="p-8">
        <Routes>
          <Route path="/" element={<AdminHomePage />} />
          <Route path="/product" element={<AdminProductPage />} />
          <Route path="/edit-product/:id" element={<AdminEditProductPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
