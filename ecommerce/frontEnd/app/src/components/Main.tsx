import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "components/admin/AdminLayout";
import ClientLayout from "components/client/ClientLayout";
import AuthProvider from "contexts/AuthContext";
import ProtectedRoute from "middlewares/ProtectedRoute";
import NotFound from "components/notFound";
import HomePage from "pages/HomePage";
import CartPage from "pages/CartPage";
import ProductPage from "pages/ProductPage";
import LoginPage from 'pages/LoginPage'

const Main = () => {
 
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ClientLayout>
                <HomePage />
              </ClientLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <ClientLayout>
                <CartPage />
              </ClientLayout>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ClientLayout>
                <ProductPage />
              </ClientLayout>
            }
          />
          <Route
            path="/login"
            element={
              <ClientLayout>
                <LoginPage />
              </ClientLayout>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ClientLayout>
                <NotFound />
              </ClientLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Main;
