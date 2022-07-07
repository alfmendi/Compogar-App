import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import { ToastContainer } from "react-toastify";

import Tarjeta from "../componentes/Tarjeta";

import useAxiosPrivado from "../hooks/useAxiosPrivado";

import { setDispatchMensajeAMostrar } from "../redux/usuarioSlice";

import generarMensajeError from "../error/generarMensajeError";

import exitoToast from "../error/exitoToast";
import errorToast from "../error/errorToast";

import HomeIcon from "@mui/icons-material/Home";

import { Dialog, DialogActions, DialogTitle } from "@mui/material";

import spinner from "../assets/spinner.gif";

// ------------------------------------------------------------
// ------------------------------------------------------------
// - Componente para mostrar todos los anuncios de un usuario -
// ------------------------------------------------------------
// ------------------------------------------------------------
const MisAnuncios = () => {
  const { usuario, mensajeAMostrar } = useSelector((state) => state.usuario);

  const dispatch = useDispatch();

  const navegar = useNavigate();

  const axiosPrivado = useAxiosPrivado();

  const [misAnuncios, setMisAnuncios] = useState(null);

  const [abrirModal, setAbrirModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [anuncioBorrar, setAnuncioBorrar] = useState(null);

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

  // -------------------------------------------------------------
  // - UseEffect para conseguir todos los anuncios de un usuario -
  // -------------------------------------------------------------
  useEffect(() => {
    const conseguirMisAnuncios = async () => {
      try {
        setLoading(true);
        const resultado = await axiosPrivado.get(
          `/api/anuncios/${usuario.usuarioId}`,
          { withCredentials: true }
        );
        setMisAnuncios(resultado.data);
      } catch (error) {
        if (
          error.response?.data?.mensaje &&
          error.response.data.mensaje.includes("La sesión ha expirado")
        ) {
          navegar("/login");
        }
        dispatch(
          setDispatchMensajeAMostrar({
            tipo: "error",
            texto: generarMensajeError(error),
          })
        );
      } finally {
        setLoading(false);
      }
    };

    conseguirMisAnuncios();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ----------------------------------------------
  // - Método para volver a la pantalla de inicio -
  // ----------------------------------------------
  const manejarClick = () => {
    navegar("/");
  };

  // ---------------------------------------------------------------
  // - Método para ir a la página en la que se modifica el anuncio -
  // ---------------------------------------------------------------
  const manejarModificarAnuncio = (anuncioId) => {
    navegar(`/anuncioModificar/${anuncioId}`);
  };

  // -------------------------------------------------------------------
  // - Método para mostrar el componente dialog que elimina el anuncio -
  // -------------------------------------------------------------------
  const manejarEliminarAnuncio = (anuncioId) => {
    setAbrirModal(true);
    setAnuncioBorrar(anuncioId);
  };

  // -----------------------------------
  // - Método para eliminar el anuncio -
  // -----------------------------------
  const manejarAceptarEliminarAnuncio = async () => {
    setAbrirModal(false);
    setLoading(true);
    try {
      await axiosPrivado.delete(`/api/anuncios/${anuncioBorrar}`, {
        withCredentials: true,
      });
      dispatch(
        setDispatchMensajeAMostrar({
          tipo: "success",
          texto: "Anuncio eliminado correctamente",
        })
      );
      setMisAnuncios(
        misAnuncios.filter((anuncio) => anuncio.id !== anuncioBorrar)
      );
    } catch (error) {
      if (
        error.response?.data?.mensaje &&
        error.response.data.mensaje.includes("La sesión ha expirado")
      ) {
        navegar("/login");
      }
      dispatch(
        setDispatchMensajeAMostrar({
          tipo: "error",
          texto: generarMensajeError(error),
        })
      );
    } finally {
      setLoading(false);
    }
  };

  // -------
  // - JSX -
  // -------
  return (
    <Contenedor>
      {mensajeAMostrar && <ToastContainer limit={1} />}
      <MenuSuperior>
        <BotonInicio onClick={manejarClick}>
          <HomeIcon />
        </BotonInicio>
        <Titulo>Mis anuncios</Titulo>
      </MenuSuperior>
      {loading && <Spinner src={spinner} alt="cargando anuncio..." />}
      {!loading && misAnuncios?.length === 0 && (
        <Mensaje>No has publicado ningún anuncio</Mensaje>
      )}
      {!loading &&
        misAnuncios?.length > 0 &&
        misAnuncios.map((elemento) => (
          <div key={elemento.id}>
            <Tarjeta key={elemento.id} elemento={elemento} />
            <BotonesAccion>
              <Boton onClick={() => manejarModificarAnuncio(elemento.id)}>
                Modificar
              </Boton>
              <Boton onClick={() => manejarEliminarAnuncio(elemento.id)}>
                Eliminar
              </Boton>
            </BotonesAccion>
          </div>
        ))}
      {/* Ventana modal */}
      <Dialog open={abrirModal} onClose={() => setAbrirModal(false)}>
        <DialogTitle id="eliminar__modal">
          {"¿Desea eliminar este anuncio?"}
        </DialogTitle>
        <DialogActions>
          <Boton onClick={() => setAbrirModal(false)}>Cancelar</Boton>
          <Boton
            disabled={loading}
            onClick={manejarAceptarEliminarAnuncio}
            autoFocus
          >
            Aceptar
          </Boton>
        </DialogActions>
      </Dialog>
    </Contenedor>
  );
};

export default MisAnuncios;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  min-height: calc(100vh - 160px);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  background: var(--gris-fondo);

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    padding: 1rem 0rem;
  }
`;

const MenuSuperior = styled.div`
  position: relative;
  width: 740px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--negro);
  color: var(--blanco);

  /* Media Query para tablets */
  @media (max-width: 768px) {
    width: 440px;
  }
  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    width: 310px;
  }
`;

const BotonInicio = styled.button`
  position: absolute;
  left: 0.5rem;
  cursor: pointer;
  outline: none;
  border: none;
  color: var(--blanco);
  background: inherit;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: 0.2s ease-in-out;

  &:hover {
    color: var(--negro);
    background: var(--blanco);
  }
`;

const Boton = styled.button`
  cursor: pointer;
  outline: none;
  font-family: var(--texto-fuente);
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  color: var(--negro);
  background: var(--blanco);
  border: 1px solid var(--negro);
  padding: 0.5rem 1rem;
  gap: 0.2rem;
  transition: 0.2s ease-in-out;

  &:hover {
    color: var(--blanco);
    background: var(--negro);
    box-shadow: 0 14px 26px -12px rgb(53 70 92 / 42%),
      0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(53 70 92 / 20%);
  }
`;

const Titulo = styled.div`
  width: 100%;
  padding: 0 1rem;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 800;
  background: var(--negro);
  color: var(--blanco);
`;

const BotonesAccion = styled.div`
  width: 740px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* Media Query para tablets */
  @media (max-width: 768px) {
    width: 440px;
  }
  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    width: 310px;
  }
`;

const Mensaje = styled.div`
  width: 310px;
  height: 80px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 800;
  color: var(--blanco);
  background: var(--negro);
`;

const Spinner = styled.img`
  height: 4rem;
  margin: auto;
`;
