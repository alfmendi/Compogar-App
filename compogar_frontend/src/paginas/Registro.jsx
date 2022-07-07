import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useLocation, Link } from "react-router-dom";

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

import { setDispatchMensajeAMostrar } from "../redux/usuarioSlice";

import generarMensajeError from "../error/generarMensajeError";

import axios from "../axiosAPI/axios";

import spinner from "../assets/spinner.gif";

// ---------------------------------------------------------
// ---------------------------------------------------------
// - Componente para gestionar el registro de los usuarios -
// ---------------------------------------------------------
// ---------------------------------------------------------
const Registro = () => {
  const navegar = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  const { mensajeAMostrar } = useSelector((state) => state.usuario);

  // Estado para que no se pueda pulsar el boton registrar si aún está registrando
  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  // Estados para almecenar los mensajes de error
  const [errorNombre, setErrorNombre] = useState({
    error: false,
    mensaje: "",
  });
  const [errorEmail, setErrorEmail] = useState({
    error: false,
    mensaje: "",
  });
  const [errorTelefono, setErrorTelefono] = useState({
    error: false,
    mensaje: "",
  });
  const [errorPassword, setErrorPassword] = useState({
    error: false,
    mensaje: "",
  });
  const [errorConfirmarPassword, setErrorConfirmarPassword] = useState({
    error: false,
    mensaje: "",
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] =
    useState(false);

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

  // -------------------------------------------------
  // - Método que gestiona el registro de un usuario -
  // -------------------------------------------------
  const gestionarRegistro = async (e) => {
    e.preventDefault();
    if (comprobarErroresNavegador()) return;
    setLoading(true);
    vaciarYSanear();
    try {
      await axios.post("/api/auth/registro", {
        nombre,
        email,
        telefono,
        password,
        confirmarPassword,
      });
      setNombre("");
      setEmail("");
      setTelefono("");
      setPassword("");
      setConfirmarPassword("");
      dispatch(
        setDispatchMensajeAMostrar({
          tipo: "success",
          texto: "Usuario creado correctamente",
        })
      );
      navegar("/login");
    } catch (error) {
      if (
        error.response?.data?.mensaje &&
        error.response.data.mensaje.includes("La sesión ha expirado")
      ) {
        navegar("/login");
      }
      // Trato los mensajes procedentes del validador
      // de express-validator (array) para mostrar el
      // error (con el campo subrayado en rojo y un mensaje de error)
      // de forma diferente al resto de errores (react-toastify).
      if (
        error.response?.data?.mensaje &&
        Array.isArray(error.response.data.mensaje)
      ) {
        for (let mensaje of error.response.data.mensaje) {
          const campoError = mensaje.split(":")[0];
          if (campoError === "Nombre") {
            setErrorNombre({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Email") {
            setErrorEmail({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Telefono") {
            setErrorEmail({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Password") {
            setErrorPassword({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "ConfirmarPassword") {
            setErrorConfirmarPassword({
              error: true,
              mensaje: mensaje.split(":")[1],
            });
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

    if (nombre.length < 3) {
      setErrorNombre({
        error: true,
        mensaje: "Mínimo 3 caracteres",
      });
      existeErrores = true;
    }

    const mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(mailformat)) {
      setErrorEmail({
        error: true,
        mensaje: "Email no válido",
      });
      existeErrores = true;
    }

    if (!telefono.match(/^[0-9]{9}$/)) {
      setErrorTelefono({
        error: true,
        mensaje: "Teléfono no válido",
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

    if (password !== confirmarPassword) {
      setErrorConfirmarPassword({
        error: true,
        mensaje: "Passwords no coinciden",
      });
      existeErrores = true;
    }

    return existeErrores;
  };

  // ----------------------------------------------------
  // - Método para vaciar y sanear los campos a emplear -
  // ----------------------------------------------------
  const vaciarYSanear = () => {
    setErrorNombre({ error: false, mensaje: "" });
    setErrorEmail({ error: false, mensaje: "" });
    setErrorTelefono({ error: false, mensaje: "" });
    setErrorPassword({ error: false, mensaje: "" });
    setErrorConfirmarPassword({ error: false, mensaje: "" });

    setNombre((prev) => prev.trim());
    setEmail((prev) => prev.trim());
    setTelefono((prev) => prev.trim());
    setPassword((prev) => prev.trim());
    setConfirmarPassword((prev) => prev.trim());
  };

  // -------
  // - JSX -
  // -------
  return (
    <Contenedor>
      {mensajeAMostrar && <ToastContainer limit={1} />}
      <Form onSubmit={gestionarRegistro}>
        <Titulo>Regístrate</Titulo>
        <Entradas>
          <FormControl
            style={{ position: "relative" }}
            error={errorNombre.error}
            variant="standard"
            size="small"
            required
          >
            <InputLabel htmlFor="registro__nombre">Nombre</InputLabel>
            <Input
              id="registro__nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              label="Nombre"
              autoComplete="off"
            />
            {errorNombre.error && (
              <MensajeError>{errorNombre.mensaje}</MensajeError>
            )}
          </FormControl>
          <FormControl
            style={{ position: "relative" }}
            error={errorEmail.error}
            variant="standard"
            size="small"
            required
          >
            <InputLabel htmlFor="registro__email">Email</InputLabel>
            <Input
              id="registro__email"
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
            error={errorTelefono.error}
            variant="standard"
            size="small"
            required
          >
            <InputLabel htmlFor="registro__telefono">Telefono</InputLabel>
            <Input
              id="registro__telefono"
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              label="Teléfono"
              autoComplete="off"
            />
            {errorTelefono.error && (
              <MensajeError>{errorTelefono.mensaje}</MensajeError>
            )}
          </FormControl>
          <FormControl
            style={{ position: "relative" }}
            error={errorPassword.error}
            variant="standard"
            size="small"
            required
          >
            <InputLabel htmlFor="registro__password">Password</InputLabel>
            <Input
              id="registro__password"
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
          <FormControl
            style={{ position: "relative" }}
            error={errorConfirmarPassword.error}
            variant="standard"
            size="small"
            required
          >
            <InputLabel htmlFor="registro__confirmarPassword">
              Confirmar Password
            </InputLabel>
            <Input
              id="registro__confirmarPassword"
              type={mostrarConfirmarPassword ? "text" : "password"}
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    disableRipple={true}
                    onClick={() =>
                      setMostrarConfirmarPassword(
                        (valorAnterior) => !valorAnterior
                      )
                    }
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {mostrarConfirmarPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirmar Password"
            />
            {errorConfirmarPassword.error && (
              <MensajeError>{errorConfirmarPassword.mensaje}</MensajeError>
            )}
          </FormControl>
        </Entradas>
        <Footer>
          <Boton disabled={loading} type="submit">
            {loading ? (
              <Spinner src={spinner} alt="registro..." />
            ) : (
              " REGÍSTRATE AHORA"
            )}
          </Boton>
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              state={location.state ? { from: "/anuncioAlta" } : null}
            >
              Inicia Sesión
            </Link>
          </p>
        </Footer>
      </Form>
    </Contenedor>
  );
};

export default Registro;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  height: calc(100vh - 160px);
  min-height: 480px;
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
