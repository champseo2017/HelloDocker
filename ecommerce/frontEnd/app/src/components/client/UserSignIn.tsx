import React, { useState, useEffect, useCallback, MouseEvent } from "react";
import jwtDecode from "jwt-decode";
import LoginModal from "components/modal/LoginModal";
import { Button } from "flowbite-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { timeout } from "utils/timeout";
import { useAuth } from "contexts/AuthContext";

type User = {
  username: string;
};

const UserSignIn: React.FC = () => {
  const { user, login, logout } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const funcCheckAuth = useCallback(async () => {
    if (user && user.role) {
      setIsModalOpen(false);
    }
    await timeout(1000);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    funcCheckAuth();
    return () => {};
  }, [funcCheckAuth]);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center justify-end space-x-4">
      {isLoading ? (
        <Skeleton width={100} height={20} />
      ) : !user.tokenExpire && user.username ? (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 py-2 text-black bg-gray-200 rounded-md shadow-md"
          >
            Hello, {user.username}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white"
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault()
                  logout()
                  window.location.href = "/login"
                }}
              >
                Logout
              </a>
            </div>
          )}
        </div>
      ) : (
        <Button color="success" size="sm" onClick={handleLoginClick}>
          Login
        </Button>
      )}
      {isModalOpen && (
        <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default UserSignIn;
