import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, Link, useLocation } from "react-router-dom";
// import { useNavigate, Link } from "react-router-dom";

import styled from "styled-components";

import { ToastContainer } from "react-toastify";

import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Input,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import exitoToast from "../error/exitoToast";
import errorToast from "../error/errorToast";

import {
  setDispatchUsuario,
  setDispatchMensajeAMostrar,
} from "../redux/usuarioSlice";

import generarMensajeError from "../error/generarMensajeError";

import axios from "../axiosAPI/axios";
import useAxiosPrivado from "../hooks/useAxiosPrivado";

import spinner from "../assets/spinner.gif";

// ------------------------------------------------------
// ------------------------------------------------------
// - Componente para gestionar el login de los usuarios -
// ------------------------------------------------------
// ------------------------------------------------------
const Login = () => {
  const navegar = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const dispatch = useDispatch();

  const axiosPrivado = useAxiosPrivado();

  const { usuario, mensajeAMostrar } = useSelector((state) => state.usuario);

  // Estado para que no se pueda pulsar el boton registrar si aún está registrando
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados para almecenar los mensajes de error
  const [errorEmail, setErrorEmail] = useState({
    error: false,
    mensaje: "",
  });
  const [errorPassword, setErrorPassword] = useState({
    error: false,
    mensaje: "",
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);

  // --------------------------------------------------------
  // - UseEffect para mostrar el mensaje tras una operación -
  // --------------------------------------------------------
  useEffect(() => {
    if (mensajeAMostrar) {
      mensajeAMostrar.tipo === "success"
        ? exitoToast(mensajeAMostrar.texto, "top-center", () =>
            dispatch(setDispatchMensajeAMostrar(null))
          )
        : errorToast(mensajeAMostrar.texto, "top-center", () =>
            dispatch(setDispatchMensajeAMostrar(null))
          );
    }
  }, [mensajeAMostrar]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------
  // - UseEffect que elimina toda la información del usuario       -
  // - y borra el refreshToken. Ademas resetea todo el store.      -
  // - Se coloca aquí porque en caso de que expire el refreshToken -
  // - mientras estoy conectado, salgo al login y debo borrar todo -
  // ---------------------------------------------------------------
  useEffect(() => {
    const gestionarLogout = async () => {
      dispatch(setDispatchUsuario(null));
      dispatch(setDispatchMensajeAMostrar(null));
      try {
        await axiosPrivado.get("/api/tokens/borrarRefreshToken", {
          withCredentials: true,
        });
      } catch (error) {
        dispatch(
          setDispatchMensajeAMostrar({
            tipo: "error",
            texto: generarMensajeError(error),
          })
        );
      }
    };
    // Si existe el usuario (estoy aún logeado) limpio el store
    if (usuario) {
      gestionarLogout();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ------------------------------------------------
  // - Método que gestiona el login de los usuarios -
  // ------------------------------------------------
  const gestionarLogin = async (e) => {
    e.preventDefault();
    if (comprobarErroresNavegador()) return;
    setLoading(true);
    vaciarYSanear();
    const credenciales = { email, password };
    try {
      const usuario = await axios.post("/api/auth/login", credenciales);
      setEmail("");
      setPassword("");
      dispatch(setDispatchUsuario(usuario.data));
      navegar(from, { replace: true });
    } catch (error) {
      if (
        error.response?.data?.mensaje &&
        error.response.data.mensaje.includes("La sesión ha expirado")
      ) {
        navegar("/login");
      }
      // Trato los mensajes procedentes del validador
      // de express-validator (array) para mostrar el
      // error (mensaje de error en color rojo debajo del campo)
      // de forma diferente al resto de errores (react-toastify).
      if (
        error.response?.data?.mensaje &&
        Array.isArray(error.response.data.mensaje)
      ) {
        for (let mensaje of error.response.data.mensaje) {
          const campoError = mensaje.split(":")[0];
          if (campoError === "Email") {
            setErrorEmail({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Password") {
            setErrorPassword({ error: true, mensaje: mensaje.split(":")[1] });
          }
        }
      } else {
        dispatch(
          setDispatchMensajeAMostrar({
            tipo: "error",
            texto: generarMensajeError(error),
          })
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // - Método para comprobar los errores en el navegador -
  // -----------------------------------------------------
  const comprobarErroresNavegador = () => {
    vaciarYSanear();
    let existeErrores = false;

    const mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(mailformat)) {
      setErrorEmail({
        error: true,
        mensaje: "Email no válido",
      });
      existeErrores = true;
    }

    if (password.length < 6) {
      setErrorPassword({
        error: true,
        mensaje: "Mínimo 6 caracteres",
      });
      existeErrores = true;
    }

    return existeErrores;
  };

  // ----------------------------------------------------
  // - Método para vaciar y sanear los campos a emplear -
  // ----------------------------------------------------
  const vaciarYSanear = () => {
    setErrorEmail({ error: false, mensaje: "" });
    setErrorPassword({ error: false, mensaje: "" });

    setEmail((prev) => prev.trim());
    setPassword((prev) => prev.trim());
  };

  // -------
  // - JSX -
  // -------
  return (
    <Contenedor>
      {mensajeAMostrar && <ToastContainer limit={1} />}
      <Form onSubmit={gestionarLogin}>
        <Titulo>Inicia Sesión</Titulo>
        <Entradas>
          <FormControl
            style={{ position: "relative" }}
            error={errorEmail.error}
            variant="standard"
            size="small"
            required
          >
            <InputLabel htmlFor="login__email">Email</InputLabel>
            <Input
              id="login__email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              autoComplete="off"
            />
            {errorEmail.error && (
              <MensajeError>{errorEmail.mensaje}</MensajeError>
            )}
          </FormControl>
          <FormControl
            style={{ position: "relative" }}
            error={errorPassword.error}
            variant="standard"
            size="small"
            required
          >
            <InputLabel htmlFor="login__password">Password</InputLabel>
            <Input
              id="login__password"
              type={mostrarPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    disableRipple={true}
                    onClick={() =>
                      setMostrarPassword((valorAnterior) => !valorAnterior)
                    }
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {mostrarPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {errorPassword.error && (
              <MensajeError>{errorPassword.mensaje}</MensajeError>
            )}
          </FormControl>
        </Entradas>
        <Footer>
          <Boton disabled={loading} type="submit">
            {loading ? (
              <Spinner src={spinner} alt="login..." />
            ) : (
              "INICIA SESIÓN AHORA"
            )}
          </Boton>
          <p>
            ¿No tienes una cuenta?{" "}
            <Link
              to="/registro"
              state={location.state ? { from: "/anuncioAlta" } : null}
            >
              Regístrate
            </Link>
          </p>
        </Footer>
      </Form>
    </Contenedor>
  );
};

export default Login;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  height: calc(100vh - 160px);
  min-height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--gris-fondo);
`;

const Form = styled.form`
  position: relative;
  width: 350px;
  padding: 40px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 3rem;
  background: var(--blanco);
  box-shadow: 0 14px 26px -12px rgb(51 51 51 / 42%),
    0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(51 51 51 / 20%);

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    width: 300px;
  }
`;

const Titulo = styled.div`
  z-index: 10;
  position: absolute;
  margin: 0 auto;
  top: -20px;
  left: 0;
  bottom: 0;
  right: 0;
  width: 90%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--negro);
  color: var(--blanco);
`;

const Entradas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MensajeError = styled.div`
  color: #f44336;
  font-size: 12px;
  position: absolute;
  bottom: -1.2rem;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;

  p {
    color: rgb(123, 128, 154);
    font-weight: 300;
    font-size: 12px;
  }

  a {
    text-decoration: none;
    color: var(--negro);
    font-weight: 600;
    transition: 0.2s ease-in-out;

    &:hover {
      color: var(--azul);
    }
  }
`;

const Boton = styled.button`
  height: 30px;
  outline: none;
  font-family: poppins;
  background: var(--blanco);
  color: var(--negro);
  border: 1px solid var(--negro);
  font-weight: 600;
  font-size: 0.8rem;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &[disabled] {
    cursor: default;
  }

  &:hover {
    background: var(--negro);
    color: var(--blanco);
    box-shadow: 0 14px 26px -12px rgb(51 51 51 / 42%),
      0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(51 51 51 / 20%);
  }
`;

const Spinner = styled.img`
  height: 20px;
`;
