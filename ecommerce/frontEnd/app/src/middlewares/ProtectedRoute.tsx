import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth();
 
  // ถ้า user เป็น token หมดอายุ จะ redirect ไปหน้า login
  if (user && user.tokenExpire) {
    return <Navigate to="/login" />;
  } else if (user && user.role !== "admin") {
    // ถ้า user ไม่ได้เป็น admin จะ redirect ไปหน้าหลัก
    return <Navigate to="/" />;
  }
  
  // ถ้า user เป็น admin และ token ยังไม่หมดอายุ จะ render children
  return <>{children}</>;
};

export default ProtectedRoute;
