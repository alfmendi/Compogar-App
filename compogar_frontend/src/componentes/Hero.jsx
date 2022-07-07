import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import styled from "styled-components";

import { setDispatchLocalidad } from "../redux/localidadSlice";

import municipios from "../data/municipios.json";

import imagen01 from "../assets/imagen01.jpg";

import SearchIcon from "@mui/icons-material/Search";

// -----------------------------------------------------
// -----------------------------------------------------
// - Componente para mostrar la zona hero de la página -
// -----------------------------------------------------
// -----------------------------------------------------
const Hero = () => {
  const navegar = useNavigate();

  const dispatch = useDispatch();

  const [activo, setActivo] = useState("alquilar");
  const [ciudadBuscar, setCiudadBuscar] = useState("");
  const [municipiosCoinciden, setMunicipiosCoinciden] = useState([]);
  const [municipiosMostrar, setMunicipiosMostrar] = useState([]);

  // -------------------------------------------------------
  // - UseEffect para seleccionar todos los municipios que -
  // - con el texto que estoy introduciendo                -
  // -------------------------------------------------------
  useEffect(() => {
    if (ciudadBuscar.length > 1) {
      setMunicipiosCoinciden(
        municipios.filter((municipio) => {
          let nuevoMunicipio = municipio.nm.toLowerCase();
          let nuevaCiudadBuscar = ciudadBuscar.toLowerCase();
          if (nuevoMunicipio.includes("-")) {
            nuevoMunicipio = nuevoMunicipio.replace("-", " ");
          }
          if (nuevaCiudadBuscar.includes("-")) {
            nuevaCiudadBuscar = nuevaCiudadBuscar.replace("-", " ");
          }
          return nuevoMunicipio.includes(nuevaCiudadBuscar);
        })
      );
    } else {
      setMunicipiosCoinciden([]);
    }
  }, [ciudadBuscar]);

  // ---------------------------------------------------
  // - UseEffect para mostrar como máximo 8 municipios -
  // ---------------------------------------------------
  useEffect(() => {
    if (municipiosCoinciden.length > 8) {
      setMunicipiosMostrar(municipiosCoinciden.slice(0, 8));
    } else {
      setMunicipiosMostrar(municipiosCoinciden);
    }
  }, [municipiosCoinciden]);

  // -----------------------------------------------------
  // - Función para establecer el municipio seleccionado -
  // -----------------------------------------------------
  const manejarMunicipioPulsado = (elemento) => {
    dispatch(
      setDispatchLocalidad({
        localidad: elemento,
        alquilar: activo === "alquilar",
      })
    );
    navegar("/anunciosLocalidad");
  };

  // ------------------------------------------------------------------------
  // - Función para establecer el municipio seleccionado con la tecla enter -
  // ------------------------------------------------------------------------
  const manejarPulsarEnter = async (event) => {
    if (
      event.key === "Enter" &&
      ciudadBuscar.length > 1 &&
      municipiosMostrar.length > 0
    ) {
      dispatch(
        setDispatchLocalidad({
          localidad: municipiosMostrar[0],
          alquilar: activo === "alquilar",
        })
      );
      navegar("/anunciosLocalidad");
    }
  };

  // -------
  // - JSX -
  // -------
  return (
    <Contenedor>
      <ZonaIzquierda>
        Encuentra la <span>casa</span> de tus sueños
      </ZonaIzquierda>
      <ZonaDerecha>
        <DivImagen>
          <Imagen src={imagen01} alt="imagen casa" />
        </DivImagen>
        <Buscar>
          <GrupoBotones>
            <Boton
              activo={activo === "alquilar"}
              onClick={() => setActivo("alquilar")}
            >
              Alquilar
            </Boton>
            <Boton
              activo={activo === "comprar"}
              onClick={() => setActivo("comprar")}
            >
              Comprar
            </Boton>
          </GrupoBotones>
          <GrupoBuscar>
            <SearchIcon />
            <Input
              type="text"
              placeholder="Localidad..."
              value={ciudadBuscar}
              onChange={(e) => setCiudadBuscar(e.target.value)}
              onKeyDown={(e) => manejarPulsarEnter(e)}
            />
            {municipiosMostrar.length > 0 && (
              <ListaCiudadBuscar>
                {municipiosMostrar.map((elemento, indice) => (
                  <ElementoLista
                    seleccion={indice}
                    onClick={() => manejarMunicipioPulsado(elemento)}
                    key={elemento.id}
                  >
                    {elemento.nm}
                  </ElementoLista>
                ))}
              </ListaCiudadBuscar>
            )}
          </GrupoBuscar>
        </Buscar>
      </ZonaDerecha>
    </Contenedor>
  );
};

export default Hero;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  max-width: 1400px;
  height: 500px;
  margin: 2rem auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1024px) {
    flex-direction: column;
    margin: 0rem auto;
  }
`;

const ZonaIzquierda = styled.div`
  font-size: 3rem;
  font-weight: 900;
  padding: 0rem 1rem;

  span {
    background: linear-gradient(to right, #51b8db 0%, #1867aa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 1024px) {
    margin-bottom: 1rem;
    text-align: center;
    font-size: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const ZonaDerecha = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const DivImagen = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Imagen = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Buscar = styled.div`
  position: absolute;
  width: 560px;
  height: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1rem;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background: var(--blanco);
  box-shadow: 0 14px 26px -12px rgb(53 70 92 / 42%),
    0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(53 70 92 / 20%);

  @media (max-width: 768px) {
    width: 460px;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    width: 96%;
  }
`;

const GrupoBotones = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Boton = styled.button`
  font-family: var(--texto-fuente);
  background: var(--negro);
  color: ${(props) => (props.activo ? "var(--blanco)" : "var(--gris)")};
  text-shadow: ${(props) =>
    props.activo
      ? " 0 0 5px #fff700, 0 0 10px #fff700, 0 0 20px #fff700,0 0 40px #fff700"
      : ""};
  border: none;
  outline: none;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  transition: 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    box-shadow: 0 14px 26px -12px rgb(53 70 92 / 42%),
      0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(53 70 92 / 20%);
  }
`;

const GrupoBuscar = styled.div`
  flex: 1;
  position: relative;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 35px;
    width: 35px;
    padding: 0.2rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Input = styled.input`
  font-family: var(--texto-fuente);
  border: 1px solid var(--negro);
  outline: none;
  border-radius: 20px;
  width: 100%;
  height: 40px;
  padding: 0.45rem 1rem 0.45rem 2rem;
  font-size: 1rem;
`;

const ListaCiudadBuscar = styled.div`
  position: absolute;
  top: 42px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid var(--negro);
  background: var(--blanco);
`;

const ElementoLista = styled.div`
  color: ${(props) => (props.seleccion === 0 ? "var(--azul)" : "var(--negro)")};
  width: 100%;
  padding: 0.5rem;

  &:hover {
    cursor: pointer;
    background: var(--gris-fondo);
  }
`;
