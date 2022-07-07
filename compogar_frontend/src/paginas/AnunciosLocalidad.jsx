import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import Slider from "@mui/material/Slider";

import { ToastContainer } from "react-toastify";

import Tarjeta from "../componentes/Tarjeta";

import { FormControlLabel, Switch, Typography } from "@mui/material";

import { setDispatchLocalidad } from "../redux/localidadSlice";
import { setDispatchMensajeAMostrar } from "../redux/usuarioSlice";

import axios from "../axiosAPI/axios";

import generarMensajeError from "../error/generarMensajeError";

import HomeIcon from "@mui/icons-material/Home";

import spinner from "../assets/spinner.gif";

// ---------------------------------------------------------------
// ---------------------------------------------------------------
// - Componente para mostrar todos los anuncios de una localidad -
// ---------------------------------------------------------------
// ---------------------------------------------------------------
const AnunciosLocalidad = () => {
  const dispatch = useDispatch();

  const { mensajeAMostrar } = useSelector((state) => state.usuario);
  const { localidad, alquilar } = useSelector((state) => state.localidad);

  const navegar = useNavigate();

  const [anunciosLocalidad, setAnunciosLocalidad] = useState([]);
  const [anunciosLocalidadFiltrar, setAnunciosLocalidadFiltrar] = useState([]);

  const [loading, setLoading] = useState(false);

  const [rangoPrecio, setRangoPrecio] = useState(
    alquilar ? [100, 2000] : [0, 1000000]
  );
  const [rangoSuperficie, setRangoSuperficie] = useState([20, 300]);
  const [rangoHabitaciones, setRangoHabitaciones] = useState([0, 10]);
  const [exterior, setExterior] = useState(false);
  const [ascensor, setAscensor] = useState(false);
  const [garaje, setGaraje] = useState(false);

  const [mostrarVentanaFiltros, setMostrarVentanaFiltros] = useState(false);

  // ------------------------------------------------------------------
  // - UseEffect para conseguir almacenar la localidad y la operación -
  // - en el localStorage. Se hace para que en caso de realizar un F5 -
  // - se pueda restaurar el estado de la página                      -
  // ------------------------------------------------------------------
  useEffect(() => {
    if (localidad) {
      localStorage.setItem(
        "localidad",
        JSON.stringify({ localidad, alquilar })
      );
    } else {
      const localidadLocalStorage = JSON.parse(
        localStorage.getItem("localidad")
      );
      dispatch(setDispatchLocalidad(localidadLocalStorage));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --------------------------------------------------------------------------------------
  // - UseEffect para conseguir todos los anuncios de una localidad al cargar esta página -
  // --------------------------------------------------------------------------------------
  useEffect(() => {
    const conseguirAnunciosLocalidad = async () => {
      let paramsEnviar = {};
      if (!localidad) {
        const localidadLocalStorage = JSON.parse(
          localStorage.getItem("localidad")
        );
        paramsEnviar = {
          localidad: localidadLocalStorage.localidad.nm,
          alquilar: localidadLocalStorage.alquilar,
        };
      } else {
        paramsEnviar = { localidad: localidad.nm, alquilar };
      }
      try {
        setLoading(true);
        const resultado = await axios.get(`/api/anuncios`, {
          params: paramsEnviar,
        });
        setAnunciosLocalidad(resultado.data);
        setAnunciosLocalidadFiltrar(resultado.data);
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

    conseguirAnunciosLocalidad();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ----------------------------------------------
  // - Método para volver a la pantalla de inicio -
  // ----------------------------------------------
  const manejarClick = () => {
    navegar("/");
  };

  // -----------------------------------------------
  // - Método para aplicar los filtros de búsqueda -
  // -----------------------------------------------
  const manejarAplicarFiltro = () => {
    let anunciosLocalidadFiltrarAuxiliar = anunciosLocalidad;
    let exteriorSiNo = exterior ? "si" : "no";
    let ascensorSiNo = ascensor ? "si" : "no";
    let garajeSiNo = garaje ? "si" : "no";

    anunciosLocalidadFiltrarAuxiliar = anunciosLocalidadFiltrarAuxiliar.filter(
      (elemento) =>
        elemento.precio >= rangoPrecio[0] &&
        elemento.precio <= rangoPrecio[1] &&
        elemento.superficie >= rangoSuperficie[0] &&
        elemento.superficie <= rangoSuperficie[1] &&
        elemento.habitaciones >= rangoHabitaciones[0] &&
        elemento.habitaciones <= rangoHabitaciones[1]
    );

    if (exteriorSiNo === "si") {
      anunciosLocalidadFiltrarAuxiliar =
        anunciosLocalidadFiltrarAuxiliar.filter(
          (elemento) => elemento.exterior === "si"
        );
    }
    if (ascensorSiNo === "si") {
      anunciosLocalidadFiltrarAuxiliar =
        anunciosLocalidadFiltrarAuxiliar.filter(
          (elemento) => elemento.ascensor === "si"
        );
    }
    if (garajeSiNo === "si") {
      anunciosLocalidadFiltrarAuxiliar =
        anunciosLocalidadFiltrarAuxiliar.filter(
          (elemento) => elemento.garaje === "si"
        );
    }

    setAnunciosLocalidadFiltrar(anunciosLocalidadFiltrarAuxiliar);
    //
    setMostrarVentanaFiltros(false);
  };

  const manejarOcultarFiltros = () => {
    setMostrarVentanaFiltros((prev) => !prev);
  };
  const manejarMostrarTodos = () => {
    setAnunciosLocalidadFiltrar(anunciosLocalidad);
    setRangoPrecio(alquilar ? [100, 2000] : [0, 1000000]);
    setRangoSuperficie([20, 300]);
    setRangoHabitaciones([0, 10]);
    setExterior(false);
    setAscensor(false);
    setGaraje(false);
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
        <Titulo>{localidad?.nm}</Titulo>
      </MenuSuperior>
      {loading && <Spinner src={spinner} alt="cargando anuncio..." />}
      {!loading &&
        (anunciosLocalidadFiltrar.length > 0 ||
          anunciosLocalidad.length > 0) && (
          <BotonesAccion>
            <Boton
              style={{ width: "150px" }}
              onClick={manejarOcultarFiltros}
              disabled={anunciosLocalidadFiltrar.length === 0}
            >
              {mostrarVentanaFiltros ? "Ocultar filtros" : "Mostrar filtros"}
            </Boton>
            <Boton
              style={{ width: "150px" }}
              onClick={manejarMostrarTodos}
              disabled={
                anunciosLocalidad.length === anunciosLocalidadFiltrar.length
              }
            >
              Mostrar todos
            </Boton>
          </BotonesAccion>
        )}
      {!loading && anunciosLocalidadFiltrar.length === 0 && (
        <Mensaje>No hay anuncios</Mensaje>
      )}
      {!loading &&
        anunciosLocalidadFiltrar.length > 0 &&
        mostrarVentanaFiltros && (
          <ContenedorFiltro>
            <Titulo>Filtros</Titulo>
            <InfoParametro>
              <p>Precio (€)</p>
              <span>
                {rangoPrecio[0] === (alquilar ? 100 : 0) &&
                rangoPrecio[1] === (alquilar ? 2000 : 1000000)
                  ? "Indiferente"
                  : `${rangoPrecio[0]}€ - ${rangoPrecio[1]}€`}
              </span>
            </InfoParametro>
            <div style={{ padding: "0rem 1.5rem" }}>
              <Slider
                value={rangoPrecio}
                onChange={(e) => setRangoPrecio(e.target.value)}
                valueLabelDisplay="auto"
                step={alquilar ? 100 : 50000}
                marks
                min={alquilar ? 100 : 0}
                max={alquilar ? 2000 : 1000000}
                size="small"
              />
            </div>
            <InfoParametro>
              <p>Superficie (m²)</p>
              <span>
                {rangoSuperficie[0] === 20 && rangoSuperficie[1] === 300
                  ? "Indiferente"
                  : `${rangoSuperficie[0]}m² - ${rangoSuperficie[1]}m²`}
              </span>
            </InfoParametro>
            <div style={{ padding: "0rem 1.5rem" }}>
              <Slider
                value={rangoSuperficie}
                onChange={(e) => setRangoSuperficie(e.target.value)}
                valueLabelDisplay="auto"
                step={20}
                marks
                min={20}
                max={300}
                size="small"
              />
            </div>
            <InfoParametro>
              <p>Habitaciones</p>
              <span>
                {rangoHabitaciones[0] === 0 && rangoHabitaciones[1] === 10
                  ? "Indiferente"
                  : `${rangoHabitaciones[0]} - ${rangoHabitaciones[1]}`}
              </span>
            </InfoParametro>
            <div style={{ padding: "0rem 1.5rem" }}>
              <Slider
                value={rangoHabitaciones}
                onChange={(e) => setRangoHabitaciones(e.target.value)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={10}
                size="small"
              />
            </div>
            <div>
              <FormControlLabelPropio
                sx={{ margin: "0" }}
                value={exterior}
                control={
                  <Switch
                    color="primary"
                    checked={exterior}
                    onChange={(e) => setExterior((prev) => !prev)}
                  />
                }
                label={
                  <Typography
                    sx={{ fontSize: 16, fontFamily: "var(--texto-fuente)" }}
                  >
                    Exterior
                  </Typography>
                }
                labelPlacement="start"
              />
            </div>
            <div>
              <FormControlLabelPropio
                sx={{ margin: "0" }}
                value={ascensor}
                control={
                  <Switch
                    color="primary"
                    checked={ascensor}
                    onChange={(e) => setAscensor((prev) => !prev)}
                  />
                }
                label={
                  <Typography
                    sx={{ fontSize: 16, fontFamily: "var(--texto-fuente)" }}
                  >
                    Ascensor
                  </Typography>
                }
                labelPlacement="start"
              />
            </div>
            <div>
              <FormControlLabelPropio
                sx={{ margin: "0" }}
                value={garaje}
                control={
                  <Switch
                    color="primary"
                    checked={garaje}
                    onChange={(e) => setGaraje((prev) => !prev)}
                  />
                }
                label={
                  <Typography
                    sx={{ fontSize: 16, fontFamily: "var(--texto-fuente)" }}
                  >
                    Garaje
                  </Typography>
                }
                labelPlacement="start"
              />
            </div>
            <Boton onClick={manejarAplicarFiltro} disable={loading}>
              {loading ? (
                <Spinner src={spinner} alt="filtrar anuncios..." />
              ) : (
                "Aplicar"
              )}
            </Boton>
          </ContenedorFiltro>
        )}
      {!loading &&
        anunciosLocalidadFiltrar?.length > 0 &&
        anunciosLocalidadFiltrar?.map((elemento) => (
          <Tarjeta key={elemento.id} elemento={elemento} />
        ))}
    </Contenedor>
  );
};

export default AnunciosLocalidad;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  position: relative;
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

const ContenedorFiltro = styled.div`
  position: absolute;
  top: 138px;
  left: 20px;
  width: 310px;
  height: 450px;
  background: var(--blanco);
  box-shadow: 0 14px 26px -12px rgb(51 51 51 / 42%),
    0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(51 51 51 / 20%);

  /* Media Query para desktop */
  @media (max-width: 1440px) {
    position: relative;
    top: 0;
    left: 0;
    margin-top: 2rem;
  }
`;

const FormControlLabelPropio = styled(FormControlLabel)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 1.5rem;
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
  margin: 1rem auto;
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
  transition: 0.2s ease-in-out;

  &[disabled] {
    cursor: default;
    color: var(--gris);
  }

  &:hover {
    color: var(--blanco);
    background: var(--negro);
    box-shadow: 0 14px 26px -12px rgb(51 51 51 / 42%),
      0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(51 51 51 / 20%);

    &[disabled] {
      color: var(--gris);
      background: var(--blanco);
      box-shadow: none;
    }
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

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const BotonesAccion = styled.div`
  width: 740px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: -1rem;

  /* Media Query para tablets */
  @media (max-width: 768px) {
    width: 440px;
  }
  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    width: 310px;
  }
`;

const InfoParametro = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem 0rem 1.5rem;

  span {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--azul);
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
