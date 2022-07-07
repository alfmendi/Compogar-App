import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

import styled from "styled-components";

import { ToastContainer } from "react-toastify";

import axios from "../axiosAPI/axios";

import { setDispatchMensajeAMostrar } from "../redux/usuarioSlice";

import generarMensajeError from "../error/generarMensajeError";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";

import sinFoto from "../assets/imagen00.jpg";

// ---------------------------------------------------
// ---------------------------------------------------
// - Componente para mostrar el anuncio seleccionado -
// ---------------------------------------------------
// ---------------------------------------------------
const AnuncioMostrar = () => {
  const dispatch = useDispatch();

  const navegar = useNavigate();

  const { mensajeAMostrar } = useSelector((state) => state.usuario);

  const { anuncioId } = useParams();

  const [anuncio, setAnuncio] = useState(null);

  const [indiceImagen, setIndiceImagen] = useState(0);

  // ----------------------------------------------------
  // - UseEffect para conseguir el anuncio seleccionado -
  // ----------------------------------------------------
  useEffect(() => {
    const conseguirAnuncio = async () => {
      try {
        const resultado = await axios.get(`/api/anuncios/anuncio/${anuncioId}`);
        setAnuncio(resultado.data);
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
      }
    };

    conseguirAnuncio();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --------------------------------------------------------
  // - Método para mostrar la imagen anterior de la tarjeta -
  // --------------------------------------------------------
  const mostrarImagenAnterior = () => {
    if (indiceImagen > 0) {
      setIndiceImagen((prev) => prev - 1);
    }
  };

  // ---------------------------------------------------------
  // - Método para mostrar la imagen siguiente de la tarjeta -
  // ---------------------------------------------------------
  const mostrarImagenSiguiente = () => {
    if (indiceImagen < anuncio?.imagenes.length - 1) {
      setIndiceImagen((prev) => prev + 1);
    }
  };

  // -------
  // - JSX -
  // -------
  return (
    <Contenedor>
      {mensajeAMostrar && <ToastContainer limit={1} />}
      <Boton onClick={() => navegar(-1)}>Atrás</Boton>
      <Tarjeta>
        <Linea>
          <span>{anuncio?.operacion}</span>
          <h4>
            {anuncio?.precio}
            {anuncio?.operacion === "alquiler" ? "€/mes" : "€"}
          </h4>
        </Linea>
        <Linea>
          <h3>{anuncio?.direccion}</h3>
        </Linea>
        <Linea>
          <p>{anuncio?.localidad}</p>
        </Linea>
        <LineaInfo>
          <span>Superficie</span>
          <p>{anuncio?.superficie}m²</p>
        </LineaInfo>
        <LineaInfo>
          <span>Habitaciones</span>
          <p>{anuncio?.habitaciones}</p>
        </LineaInfo>
        <LineaInfo>
          <span>Baños</span>
          <p>{anuncio?.aseos}</p>
        </LineaInfo>
        <LineaInfo>
          <span>Exterior</span>
          <p>{anuncio?.exterior}</p>
        </LineaInfo>
        <LineaInfo>
          <span>Garaje</span>
          <p>{anuncio?.garaje}</p>
        </LineaInfo>
        <LineaInfo>
          <span>Ascensor</span>
          <p>{anuncio?.ascensor}</p>
        </LineaInfo>
        <Imagen>
          {anuncio?.imagenes.length === 0 ? (
            <img src={sinFoto} alt="sin imagen" />
          ) : (
            <>
              <img
                src={anuncio?.imagenes[indiceImagen]}
                alt="imagen de un anuncio"
              />
              <FlechaImagen
                atras={true}
                ocultar={indiceImagen === 0}
                onClick={mostrarImagenAnterior}
              >
                <ArrowBackIosNewIcon />
              </FlechaImagen>
              <FlechaImagen
                adelante={true}
                ocultar={indiceImagen === anuncio?.imagenes.length - 1}
                onClick={mostrarImagenSiguiente}
              >
                <ArrowForwardIosIcon />
              </FlechaImagen>
              <InfoEstatica>
                {indiceImagen + 1}/{anuncio?.imagenes.length}
              </InfoEstatica>
            </>
          )}
        </Imagen>
        <Linea>
          <p>{anuncio?.descripcion}</p>
        </Linea>
        <Contacto>
          <span>
            <CallIcon />
          </span>
          <p>{anuncio?.usuario.telefono}</p>
        </Contacto>
        <Contacto>
          <span>
            <EmailIcon />
          </span>
          <p>{anuncio?.usuario.email}</p>
        </Contacto>
      </Tarjeta>
    </Contenedor>
  );
};

export default AnuncioMostrar;

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
  gap: 1rem;
  background: var(--gris-fondo);
`;

const Tarjeta = styled.div`
  max-width: 1400px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
`;

const Linea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  p {
    font-size: 0.9rem;
  }

  span {
    text-transform: capitalize;
    background: var(--negro);
    color: var(--blanco);
    padding: 0.2rem 1rem;
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    h3 {
      font-size: 1rem;
    }
  }
`;

const LineaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  p {
    font-size: 0.8rem;
  }

  span {
    width: 100px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    text-transform: capitalize;
    background: var(--negro);
    color: var(--blanco);
  }
`;

const Imagen = styled.div`
  position: relative;
  width: 100%;
  height: 500px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    width: 100%;
    height: 200px;
  }
`;

const FlechaImagen = styled.div`
  position: absolute;
  top: 50%;
  left: ${(props) => (props.atras ? "0.5rem" : "null")};
  right: ${(props) => (props.adelante ? "0.5rem" : "null")};
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: var(--negro);
  color: var(--blanco);
  opacity: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  display: ${(props) => (props.ocultar ? "none" : "")};

  svg {
    font-size: 1.8rem;
  }

  &:hover {
    cursor: pointer;
  }
`;

const InfoEstatica = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0px;
  background: var(--negro);
  color: var(--blanco);
  padding: 0.2rem 0.5rem;
`;

const Contacto = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  width: 100%;

  p {
    font-size: 1rem;
  }

  span {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    text-transform: capitalize;
    background: var(--negro);
    color: var(--blanco);
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
