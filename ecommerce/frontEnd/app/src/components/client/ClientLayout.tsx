import { useEffect } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

const ClientLayout = ({ children }) => {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default ClientLayout;
