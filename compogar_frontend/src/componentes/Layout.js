import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

// --------------------------------------------------------------
// --------------------------------------------------------------
// - Componente que contiene la estructura de todas las páginas -
// --------------------------------------------------------------
// --------------------------------------------------------------
const Layout = () => {
  // -------
  // - JSX -
  // -------
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
