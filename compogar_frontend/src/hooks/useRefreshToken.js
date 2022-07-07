import { useDispatch } from "react-redux";

import { setDispatchUsuario } from "../redux/usuarioSlice";

import axios from "../axiosAPI/axios";

// ---------------------------------------------
// - Hook que permite utilizar el refreshToken -
// - para obtener un nuevo accessToken         -
// ---------------------------------------------
const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refrescarAccessToken = async () => {
    const respuesta = await axios.get("/api/tokens/refrescarAccessToken");
    dispatch(setDispatchUsuario(respuesta.data));
    return respuesta.data.accessToken;
  };

  return refrescarAccessToken;
};

export default useRefreshToken;
