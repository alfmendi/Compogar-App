import { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import { Outlet } from "react-router-dom";

import useRefreshToken from "../hooks/useRefreshToken";

import Spinner from "./Spinner";

// ---------------------------------------------------------------
// ---------------------------------------------------------------
// - Componente que permite mantener la información del empleado -
// - cuando se realiza un refresh de la página (F5)              -
// ---------------------------------------------------------------
// ---------------------------------------------------------------
const LoginPersistente = () => {
  const { usuario } = useSelector((state) => state.usuario);
  const [estaCargando, setEstaCargando] = useState(true);

  // Obtengo un nuevo accessToken
  const refrescarAccessToken = useRefreshToken();

  // --------------------------------------------
  // - UseEffect para refrescar el access token -
  // --------------------------------------------
  useEffect(() => {
    const verificarToken = async () => {
      try {
        await refrescarAccessToken();
      } catch (error) {
        console.log("Error: LoginPersistente");
      } finally {
        setEstaCargando(false);
      }
    };
    !usuario?.accessToken ? verificarToken() : setEstaCargando(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // -------
  // - JSX -
  // -------
  return <>{estaCargando ? <Spinner /> : <Outlet />}</>;
  // return <>{<Outlet />}</>;
};

export default LoginPersistente;
