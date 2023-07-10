import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const matchHome = location.pathname === "/admin";
  /* 
  ตรวจสอบว่า location.pathname เริ่มต้นด้วย "/admin/product" หรือเริ่มต้นด้วย "/admin/edit-product"
  */
  const matchProduct = location.pathname.match(
    /^\/admin\/(product|edit-product)/
  );

  return (
    <nav className="px-8 py-2 bg-white shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-grey-800 md:text-3xl">
            <Link to="/admin">Admin Panel</Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/admin"
              className={`text-gray-600 hover:text-gray-800 ${
                matchHome ? "font-bold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/admin/product"
              className={`text-gray-600 hover:text-gray-800 ${
                matchProduct ? "font-bold" : ""
              }`}
            >
              Products
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
