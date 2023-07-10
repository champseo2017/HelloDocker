import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "components/admin/AdminLayout";
import ClientLayout from "components/client/ClientLayout";

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<ClientLayout />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Main;
