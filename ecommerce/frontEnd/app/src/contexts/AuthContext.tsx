import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((token: string) => {
    localStorage.setItem("token", token);
    const decoded: User = jwtDecode(token);
    setUser({ ...decoded, tokenExpire: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser({
      userId: "",
      username: "",
      role: "",
      iat: 0,
      exp: 0,
      tokenExpire: true,
    });
  }, []);

  useEffect(() => {
    const jwt = localStorage.getItem("token");

    if (jwt) {
      const decoded: User = jwtDecode(jwt);

      // ตรวจสอบว่า token หมดอายุหรือไม่
      if (dayjs().unix() > decoded.exp) {
        // ถ้าหมดอายุ ลบ token และเปลี่ยน user เป็น null
        logout();
      } else {
        setUser({
          ...decoded,
          tokenExpire: false,
        });
      }
    } else if (!jwt) {
      logout();
    }
    return () => {};
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
