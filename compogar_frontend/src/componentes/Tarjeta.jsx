import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import TimeAgo from "react-timeago";
import spainStrings from "react-timeago/lib/language-strings/es";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";

import sinFoto from "../assets/imagen00.jpg";

// ----------------------------------------------------------
// ----------------------------------------------------------
// - Componente para mostrar la información de cada anuncio -
// ----------------------------------------------------------
// ----------------------------------------------------------
const Tarjeta = ({ elemento }) => {
  const navegar = useNavigate();

  const [indiceImagen, setIndiceImagen] = useState(0);

  const formatter = buildFormatter(spainStrings);

  useEffect(() => {
    if (elemento.imagenes.length === 0) {
      elemento.imagenes.push(sinFoto);
    }
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
    if (indiceImagen < elemento.imagenes.length - 1) {
      setIndiceImagen((prev) => prev + 1);
    }
  };

  // -------
  // - JSX -
  // -------
  return (
    <Contenedor key={elemento.id}>
      <Operacion>{elemento.operacion}</Operacion>
      <Imagen>
        {elemento.imagenes.length === 0 ? (
          <img src={sinFoto} alt="sin imagen" />
        ) : (
          <>
            <img
              src={elemento.imagenes[indiceImagen]}
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
              ocultar={indiceImagen === elemento.imagenes.length - 1}
              onClick={mostrarImagenSiguiente}
            >
              <ArrowForwardIosIcon />
            </FlechaImagen>
            <InfoEstatica>
              {indiceImagen + 1}/{elemento.imagenes.length}
            </InfoEstatica>
          </>
        )}
      </Imagen>
      <Datos
        key={elemento.id}
        onClick={() => {
          navegar(`/anuncio/${elemento.id}`);
        }}
      >
        <Ubicacion>
          <span>{elemento.tipoInmueble}</span> en{" "}
          {`${elemento.direccion}, ${elemento.localidad}`.length > 38
            ? `${elemento.direccion}, ${elemento.localidad}`.slice(0, 38) +
              "..."
            : `${elemento.direccion}, ${elemento.localidad}`}
        </Ubicacion>
        <UbicacionMovil>
          <p>
            <span>{elemento.tipoInmueble}</span> en {elemento.direccion}
          </p>
          <p>{elemento.localidad}</p>
        </UbicacionMovil>
        <Precio>
          <span>{elemento.precio}</span>{" "}
          {elemento.operacion === "alquiler" ? "€/mes" : "€"}
        </Precio>
        <Informacion>
          <p>{elemento.habitaciones} hab.</p>
          <p>{elemento.superficie} m²</p>
          <span>
            {elemento.planta.startsWith("planta")
              ? `Planta ${elemento.planta.slice(6)}ª`
              : elemento.planta}
          </span>
          <p>{elemento.exterior === "si" ? "Exterior" : "Interior"}</p>
          <p>{elemento.ascensor === "si" ? "con" : "sin"} ascensor</p>
        </Informacion>
        <Descripcion>
          {elemento.descripcion.length > 90
            ? elemento.descripcion.slice(0, 90) + "..."
            : elemento.descripcion}
        </Descripcion>
        <Contacto>
          <CallIcon />
          {elemento.usuario.telefono}
        </Contacto>
        <Contacto>
          <EmailIcon />
          {elemento.usuario.email}
        </Contacto>
        <InfoEstatica>
          <TimeAgo date={elemento.updatedAt} formatter={formatter} />
        </InfoEstatica>
      </Datos>
    </Contenedor>
  );
};

export default Tarjeta;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  position: relative;
  width: 740px;
  height: 250px;
  margin: 2rem auto 1rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--blanco);
  box-shadow: 0 14px 26px -12px rgb(51 51 51 / 42%),
    0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(51 51 51 / 20%);

  /* Media Query para tablets */
  @media (max-width: 768px) {
    width: 440px;
    height: 460px;
    flex-direction: column;
  }
  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    width: 310px;
    height: 490px;
    flex-direction: column;
  }
`;

const Operacion = styled.div`
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  background: var(--negro);
  color: var(--blanco);
  font-size: 1rem;
  padding: 0.3rem 0.5rem;
  text-transform: capitalize;
`;

const Imagen = styled.div`
  position: relative;
  width: 300px;
  height: 250px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Media Query para tablets */
  @media (max-width: 768px) {
    width: 440px;
    height: 200px;
  }
  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    width: 310px;
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

const Datos = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  padding: 1rem;

  &:hover {
    cursor: pointer;
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const Ubicacion = styled.div`
  font-size: 1rem;
  display: block;

  span {
    text-transform: capitalize;
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    display: none;
  }
`;

const UbicacionMovil = styled.div`
  font-size: 1rem;
  display: none;

  span {
    text-transform: capitalize;
  }

  p:last-child {
    font-size: 0.8rem;
    font-weight: 600;
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    display: block;
  }
`;

const Precio = styled.p`
  font-size: 1rem;
  padding: 0.5rem 0rem;

  span {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--negro);
  }
`;

const Informacion = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1rem;
  gap: 0.8rem;

  span {
    text-transform: capitalize;
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    font-size: 0.75rem;
    gap: 0.2rem;
  }
`;

const Descripcion = styled.div`
  font-size: 1rem;
  color: var(--gray);
  margin: 0.5rem 0;
`;

const Contacto = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.9rem;
  color: var(--azul);

  svg {
    margin-right: 1rem;
  }
`;
