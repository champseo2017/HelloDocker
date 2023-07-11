import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

interface User {
  userId: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
  tokenExpire: boolean;
}

export const AuthContext = createContext<User | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const jwt = localStorage.getItem("token");

    if (jwt) {
      const decoded: User = jwtDecode(jwt);

      // ตรวจสอบว่า token หมดอายุหรือไม่
      if (dayjs().unix() > decoded.exp) {
        // ถ้าหมดอายุ ลบ token และเปลี่ยน user เป็น null
        localStorage.removeItem("token");
        setUser({
          userId: "",
          username: "",
          role: "",
          iat: 0,
          exp: 0,
          tokenExpire: true,
        });
      } else {
        setUser({
          ...decoded,
          tokenExpire: false,
        });
      }
    } else if (!jwt) {
      setUser({
        userId: "",
        username: "",
        role: "",
        iat: 0,
        exp: 0,
        tokenExpire: true,
      });
    }
    return () => {};
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
