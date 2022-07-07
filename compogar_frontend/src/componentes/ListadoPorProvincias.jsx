import { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import styled from "styled-components";

import axios from "../axiosAPI/axios";

import provincias from "../data/provincias.json";

// ------------------------------------------------------------
// ------------------------------------------------------------
// - Componente que muestra los anuncios totales por provincia-
// ------------------------------------------------------------
// ------------------------------------------------------------
const ListadoPorProvincias = () => {
  const navegar = useNavigate();
  const location = useLocation();

  const [anunciosProvincia, setAnunciosProvincia] = useState(
    provincias.map((elemento) => {
      return { provincia: elemento.nm, alquiler: 0, venta: 0 };
    })
  );

  // ----------------------------------------------------------------
  // - UseEffect para obtener los totales de anuncios por provincia -
  // ----------------------------------------------------------------
  useEffect(() => {
    const conseguirAnunciosProvincia = async () => {
      try {
        // Axios pública que no necesita withCredentials:true
        const anuncios = await axios.get("/api/anuncios/grupo");
        const anunciosProvinciaAux = provincias.map((elemento) => {
          const numeroAlquileres = anuncios.data.find(
            (na) =>
              na._id.provincia === elemento.nm &&
              na._id.operacion === "alquiler"
          );
          const numeroVentas = anuncios.data.find(
            (na) =>
              na._id.provincia === elemento.nm && na._id.operacion === "venta"
          );
          return {
            provincia: elemento.nm,
            alquiler: numeroAlquileres?.total || 0,
            venta: numeroVentas?.total || 0,
          };
        });
        setAnunciosProvincia(anunciosProvinciaAux);
      } catch (error) {
        // Comprobar esta forma de gestionar un error cuando se ha producido un error por refreshToken expirado
        navegar("/login", { state: { from: location }, replace: true });
      }
    };

    conseguirAnunciosProvincia();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // -------
  // - JSX -
  // -------
  return (
    <Contenedor>
      <Titulo>Inmuebles por provincia</Titulo>
      <Tarjetas>
        {anunciosProvincia?.map((provincia) => (
          <TarjetaProvincia key={provincia.provincia}>
            <h5>{provincia.provincia}</h5>
            <Datos>
              <Linea>
                <p>Alquiler</p>
                <span>{provincia.alquiler}</span>
              </Linea>
              <Linea>
                <p>Venta</p>
                <span>{provincia.venta}</span>
              </Linea>
            </Datos>
          </TarjetaProvincia>
        ))}
      </Tarjetas>
    </Contenedor>
  );
};

export default ListadoPorProvincias;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  max-width: 1400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 2rem auto;
`;

const Titulo = styled.h2`
  padding-top: 1rem;

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const Tarjetas = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem 0rem 2rem 0rem;
`;

const TarjetaProvincia = styled.div`
  position: relative;
  width: 200px;
  height: 60px;
  margin: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  color: var(--blanco);
  background: var(--negro);

  h5 {
    width: 100%;
    padding: 0 1rem;
  }
`;

const Datos = styled.div`
  width: 150px;
`;

const Linea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;

  span {
    font-weight: 700;
  }
`;
