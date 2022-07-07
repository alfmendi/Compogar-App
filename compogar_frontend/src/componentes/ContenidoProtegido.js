// import { useLocation, Navigate, Outlet } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";

// ------------------------------------------------------------
// ------------------------------------------------------------
// - Componente que permite mostrar los contenidos protegidos -
// - cuando el empleado se ha logeado correctamente           -
// ------------------------------------------------------------
// ------------------------------------------------------------
const ContenidoProtegido = () => {
  const { usuario } = useSelector((state) => state.usuario);

  // const location=useLocation()

  // -------
  // - JSX -
  // -------
  // return !usuario ? <Navigate to="/login" state={{from:location}} replace /> : <Outlet />;
  return !usuario ? <Navigate to="/login" /> : <Outlet />;
};

export default ContenidoProtegido;
