import { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

import styled from "styled-components";

import { ToastContainer } from "react-toastify";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import {
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CloseIcon from "@mui/icons-material/Close";

import exitoToast from "../error/exitoToast";
import errorToast from "../error/errorToast";

import { setDispatchMensajeAMostrar } from "../redux/usuarioSlice";

import generarMensajeError from "../error/generarMensajeError";

import useAxiosPrivado from "../hooks/useAxiosPrivado";

import municipios from "../data/municipios.json";
import provincias from "../data/provincias.json";

import spinner from "../assets/spinner.gif";

// -----------------------------------------------------------
// -----------------------------------------------------------
// - Componente para gestionar la modificación de un anuncio -
// -----------------------------------------------------------
// -----------------------------------------------------------
const AnuncioModificar = () => {
  const navegar = useNavigate();
  const dispatch = useDispatch();

  const axiosPrivado = useAxiosPrivado();

  const { mensajeAMostrar } = useSelector((state) => state.usuario);

  const { anuncioId } = useParams();

  const steps = ["Datos", "Descripción", "Imágenes"];

  const [activeStep, setActiveStep] = useState(0);

  // Referencias a cada uno de los inputs para añadir una imagen del anuncio (máximo 6)
  const inputRef = useRef([]);

  // Estado para que no se pueda pulsar el boton modificar si aún está modificando el anuncio
  const [loading, setLoading] = useState(false);

  const [operacion, setOperacion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoInmueble, setTipoInmueble] = useState("");
  const [planta, setPlanta] = useState("");
  const [superficie, setSuperficie] = useState(0);
  const [exterior, setExterior] = useState("");
  const [habitaciones, setHabitaciones] = useState(0);
  const [aseos, setAseos] = useState(0);
  const [garaje, setGaraje] = useState("");
  const [ascensor, setAscensor] = useState("");
  const [imagenes, setImagenes] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  // Estado para comprobar que se ha elegido una localidad
  const [pulsado, setPulsado] = useState(false);
  const [ciudadBuscar, setCiudadBuscar] = useState("");
  const [municipiosCoinciden, setMunicipiosCoinciden] = useState([]);
  const [municipiosMostrar, setMunicipiosMostrar] = useState([]);

  // Estados para almacenar los mensajes de error
  const [errorOperacion, setErrorOperacion] = useState({
    error: false,
    mensaje: "",
  });
  const [errorPrecio, setErrorPrecio] = useState({
    error: false,
    mensaje: "",
  });
  const [errorDireccion, setErrorDireccion] = useState({
    error: false,
    mensaje: "",
  });
  const [errorLocalidad, setErrorLocalidad] = useState({
    error: false,
    mensaje: "",
  });
  const [errorDescripcion, setErrorDescripcion] = useState({
    error: false,
    mensaje: "",
  });
  const [errorTipoInmueble, setErrorTipoInmueble] = useState({
    error: false,
    mensaje: "",
  });
  const [errorPlanta, setErrorPlanta] = useState({
    error: false,
    mensaje: "",
  });
  const [errorSuperficie, setErrorSuperficie] = useState({
    error: false,
    mensaje: "",
  });
  const [errorExterior, setErrorExterior] = useState({
    error: false,
    mensaje: "",
  });
  const [errorHabitaciones, setErrorHabitaciones] = useState({
    error: false,
    mensaje: "",
  });
  const [errorAseos, setErrorAseos] = useState({
    error: false,
    mensaje: "",
  });
  const [errorGaraje, setErrorGaraje] = useState({
    error: false,
    mensaje: "",
  });
  const [errorAscensor, setErrorAscensor] = useState({
    error: false,
    mensaje: "",
  });
  const [errorImagenes, setErrorImagenes] = useState({
    error: false,
    mensaje: "",
  });

  // -------------------------------------------------
  // - UseEffect para obtener el anuncio a modificar -
  // -------------------------------------------------
  useEffect(() => {
    const conseguirAnuncioModificar = async () => {
      try {
        const anuncioModificar = await axiosPrivado.get(
          `/api/anuncios/anuncio/${anuncioId}`,
          { withCredentials: true }
        );
        setOperacion(anuncioModificar.data.operacion);
        setPrecio(anuncioModificar.data.precio);
        setDireccion(anuncioModificar.data.direccion);
        setPulsado(true);
        setLocalidad(anuncioModificar.data.localidad);
        setCiudadBuscar(anuncioModificar.data.localidad);
        setDescripcion(anuncioModificar.data.descripcion);
        setTipoInmueble(anuncioModificar.data.tipoInmueble);
        setPlanta(anuncioModificar.data.planta);
        setSuperficie(anuncioModificar.data.superficie);
        setExterior(anuncioModificar.data.exterior);
        setHabitaciones(anuncioModificar.data.habitaciones);
        setAseos(anuncioModificar.data.aseos);
        setGaraje(anuncioModificar.data.garaje);
        setAscensor(anuncioModificar.data.ascensor);
        let imagenesAuxiliar = [null, null, null, null, null, null];
        for (let indice in anuncioModificar.data.imagenes) {
          imagenesAuxiliar[indice] = anuncioModificar.data.imagenes[indice];
        }
        // Permito un máximo de 6 imágenes
        setImagenes(imagenesAuxiliar);
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
    conseguirAnuncioModificar();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------
  // - UseEffect para seleccionar todos los municipios que -
  // - coinciden con el texto que estoy introduciendo      -
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

  // ---------------------------------------------------------------------
  // - Método que se ejecuta cada vez que pulso sobre el botón siguiente -
  // ---------------------------------------------------------------------
  const handleNext = () => {
    if (activeStep === 0 && comprobarErroresNavegadorPaso1()) return;
    if (activeStep === 1 && comprobarErroresNavegadorPaso2()) return;
    if (activeStep === 2) gestionarAnuncioModificar();
    activeStep < steps.length - 1 &&
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // -----------------------------------------------------------------
  // - Método que se ejecuta cada vez que pulso sobre el botón atrás -
  // -----------------------------------------------------------------
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // -------------------------------------------------------------------------------
  // - Método que se ejecuta cada vez que pulso sobre la ventana para subir imagen -
  // -------------------------------------------------------------------------------
  const handleClick = (event, indice) => {
    inputRef.current[indice].click();
  };

  // ------------------------------------------------------------------------
  // - Método que se ejecuta cada vez que selecciono una imagen desde el HD -
  // ------------------------------------------------------------------------
  const handleFileChange = (event, indice) => {
    const fichero = event.target.files && event.target.files[0];
    if (!fichero) {
      return;
    }

    if (!fichero.type.startsWith("image")) {
      setErrorImagenes({
        error: true,
        mensaje: "Elija una imagen",
      });
      return;
    } else {
      setErrorImagenes({
        error: false,
        mensaje: "",
      });
    }

    // Convierto el fichero (imagen) para ser enviado
    const reader = new FileReader();
    reader.readAsDataURL(fichero);
    reader.onloadend = () => {
      imagenes[indice] = reader.result;
      setImagenes([...imagenes]);
    };
  };

  // -----------------------------------------------------
  // - Método que gestiona la modificación de un anuncio -
  // -----------------------------------------------------
  const gestionarAnuncioModificar = async () => {
    setLoading(true);
    vaciarYSanear();
    // Buscar el código de la localidad
    const codigoLocalidad = municipios
      .find((elemento) => elemento.nm === localidad)
      .id.slice(0, 2);
    // Buscar la provincia
    const provincia = provincias.find(
      (elemento) => elemento.id === codigoLocalidad
    ).nm;
    try {
      await axiosPrivado.patch(
        `/api/anuncios/${anuncioId}`,
        {
          operacion,
          precio,
          direccion,
          localidad,
          provincia,
          tipoInmueble,
          planta: planta ? planta : "bajo",
          superficie,
          exterior,
          habitaciones,
          aseos,
          garaje,
          ascensor,
          descripcion,
          imagenes,
        },
        { withCredentials: true }
      );

      setOperacion("");
      setPrecio(0);
      setDireccion("");
      setLocalidad("");
      setTipoInmueble("");
      setPlanta("");
      setSuperficie(0);
      setExterior("");
      setHabitaciones(0);
      setAseos(0);
      setGaraje("");
      setAscensor("");
      setDescripcion("");
      setImagenes([null, null, null, null, null, null]);
      dispatch(
        setDispatchMensajeAMostrar({
          tipo: "success",
          texto: "Anuncio modificado correctamente",
        })
      );
      navegar("/misAnuncios");
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

          if (campoError === "Operacion") {
            setErrorOperacion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Precio") {
            setErrorPrecio({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Direccion") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Localidad") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "TipoInmueble") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Planta") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Superficie") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Exterior") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Habitaciones") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Aseos") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Garaje") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Ascensor") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Descripcion") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
          }
          if (campoError === "Imagenes") {
            setErrorDireccion({ error: true, mensaje: mensaje.split(":")[1] });
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
      // Para volver a la primera pantalla del stepper porque existe o bien un error
      // de validación de los datos generado en el servidor o un error del propio servidor
      setActiveStep(0);
    }
  };

  // --------------------------------------------------------------
  // - Método para comprobar los errores en el navegador en paso1 -
  // --------------------------------------------------------------
  const comprobarErroresNavegadorPaso1 = () => {
    vaciarYSanear();
    let existeErrores = false;

    if (operacion === "") {
      setErrorOperacion({
        error: true,
        mensaje: "Elija una opción",
      });
      existeErrores = true;
    }

    if (precio <= 0) {
      setErrorPrecio({
        error: true,
        mensaje: "Valor no válido",
      });
      existeErrores = true;
    }

    if (direccion.length < 3) {
      setErrorDireccion({
        error: true,
        mensaje: "Mínimo 3 caracteres",
      });
      existeErrores = true;
    }

    if (localidad.length < 3) {
      setErrorLocalidad({
        error: true,
        mensaje: "Mínimo 3 caracteres",
      });
      existeErrores = true;
    }

    if (tipoInmueble === "") {
      setErrorTipoInmueble({
        error: true,
        mensaje: "Elija una opción",
      });
      existeErrores = true;
    }

    if (tipoInmueble === "piso" && planta === "") {
      setErrorPlanta({
        error: true,
        mensaje: "Elija una opción",
      });
      existeErrores = true;
    }

    if (garaje === "") {
      setErrorGaraje({
        error: true,
        mensaje: "Elija una opción",
      });
      existeErrores = true;
    }

    if (ascensor === "") {
      setErrorAscensor({
        error: true,
        mensaje: "Elija una opción",
      });
      existeErrores = true;
    }

    return existeErrores;
  };

  // --------------------------------------------------------------
  // - Método para comprobar los errores en el navegador en paso2 -
  // --------------------------------------------------------------
  const comprobarErroresNavegadorPaso2 = () => {
    setErrorGaraje({ error: false, mensaje: "" });
    setErrorAscensor({ error: false, mensaje: "" });
    setErrorDescripcion({ error: false, mensaje: "" });

    setDescripcion((prev) => prev.trim());

    let existeErrores = false;

    if (superficie <= 0) {
      setErrorSuperficie({
        error: true,
        mensaje: "Valor no válido",
      });
      existeErrores = true;
    }

    if (exterior === "") {
      setErrorExterior({
        error: true,
        mensaje: "Elija una opción",
      });
      existeErrores = true;
    }

    if (habitaciones <= 0) {
      setErrorHabitaciones({
        error: true,
        mensaje: "Valor no válido",
      });
      existeErrores = true;
    }

    if (aseos <= 0) {
      setErrorAseos({
        error: true,
        mensaje: "Valor no válido",
      });
      existeErrores = true;
    }

    if (descripcion.length < 3) {
      setErrorDescripcion({
        error: true,
        mensaje: "Mínimo 3 caracteres",
      });
      existeErrores = true;
    }

    return existeErrores;
  };

  // ----------------------------------------------------
  // - Método para vaciar y sanear los campos a emplear -
  // ----------------------------------------------------
  const vaciarYSanear = () => {
    setErrorOperacion({ error: false, mensaje: "" });
    setErrorPrecio({ error: false, mensaje: "" });
    setErrorDireccion({ error: false, mensaje: "" });
    setErrorLocalidad({ error: false, mensaje: "" });
    setErrorTipoInmueble({ error: false, mensaje: "" });
    setErrorPlanta({ error: false, mensaje: "" });
    setErrorSuperficie({ error: false, mensaje: "" });
    setErrorExterior({ error: false, mensaje: "" });
    setErrorHabitaciones({ error: false, mensaje: "" });
    setErrorAseos({ error: false, mensaje: "" });
    setErrorGaraje({ error: false, mensaje: "" });
    setErrorAscensor({ error: false, mensaje: "" });
    setErrorDescripcion({ error: false, mensaje: "" });
    setErrorImagenes({ error: false, mensaje: "" });

    setDireccion((prev) => prev.trim());
    setDescripcion((prev) => prev.trim());
  };

  // -----------------------------------------------------
  // - Método para establecer el municipio seleccionado -
  // -----------------------------------------------------
  const manejarMunicipioPulsado = (elemento) => {
    setPulsado(true);
    setCiudadBuscar(elemento.nm);
    setLocalidad(elemento.nm);
  };

  // ------------------------------------------------------------------------
  // - Método para establecer el municipio seleccionado con la tecla enter -
  // ------------------------------------------------------------------------
  const manejarPulsarEnter = async (event) => {
    if (
      event.key === "Enter" &&
      ciudadBuscar.length > 1 &&
      municipiosMostrar.length > 0
    ) {
      setPulsado(true);
      setCiudadBuscar(municipiosMostrar[0].nm);
      setLocalidad(municipiosMostrar[0].nm);
    }
  };

  // ----------------------------------------------
  // - Método para volver a la pantalla de inicio -
  // ----------------------------------------------
  const manejarClick = () => {
    navegar("/");
  };

  // -------------------------------------------------------------
  // - Método para gestionar el cambio en el estado tipoInmueble -
  // -------------------------------------------------------------
  const manejarChangeTipoInmueble = (e) => {
    setPlanta("");
    setTipoInmueble(e.target.value);
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
        <TituloMenuSuperior>Modificar</TituloMenuSuperior>
      </MenuSuperior>
      <BoxPersonal>
        <ContenedorStepper>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </ContenedorStepper>
        {activeStep === 0 && (
          <Form>
            <Titulo>{steps[activeStep]}</Titulo>
            <Entradas>
              <Linea>
                <FormControl
                  style={{ position: "relative", flex: "1" }}
                  error={errorOperacion.error}
                  variant="standard"
                  size="small"
                  required
                >
                  <InputLabel id="operacion__label">Operación</InputLabel>
                  <Select
                    labelId="operacion__label"
                    id="operacion"
                    value={operacion}
                    onChange={(e) => setOperacion(e.target.value)}
                    label="Operación"
                  >
                    <MenuItem value="alquiler">Alquiler</MenuItem>
                    <MenuItem value="venta">Venta</MenuItem>
                  </Select>
                  {errorOperacion.error && (
                    <MensajeError>{errorOperacion.mensaje}</MensajeError>
                  )}
                </FormControl>
                {operacion && (
                  <FormControl
                    style={{ position: "relative", flex: "1" }}
                    error={errorPrecio.error}
                    variant="standard"
                    size="small"
                    required
                  >
                    <InputLabel htmlFor="anuncio__precio">Precio</InputLabel>
                    <InputNumerico
                      paddingderecho={operacion === "alquiler" ? 3.7 : 1}
                      id="anuncio__precio"
                      type="number"
                      min="1"
                      value={precio}
                      onChange={(e) =>
                        e.target.value >= 0 ? setPrecio(e.target.value) : null
                      }
                      label="Precio"
                      autoComplete="off"
                    />
                    <div
                      style={{
                        position: "absolute",
                        right: "0",
                        bottom: "6px",
                      }}
                    >
                      {operacion === "alquiler" ? "€/mes" : "€"}
                    </div>

                    {errorPrecio.error && (
                      <MensajeError>{errorPrecio.mensaje}</MensajeError>
                    )}
                  </FormControl>
                )}
              </Linea>
              <FormControl
                style={{ position: "relative" }}
                error={errorDireccion.error}
                variant="standard"
                size="small"
                required
              >
                <InputLabel htmlFor="anuncio__direccion">Dirección</InputLabel>
                <Input
                  id="anuncio__direccion"
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  label="Dirección"
                  autoComplete="off"
                />
                {errorDireccion.error && (
                  <MensajeError>{errorDireccion.mensaje}</MensajeError>
                )}
              </FormControl>
              <FormControl
                style={{ position: "relative" }}
                error={errorLocalidad.error}
                variant="standard"
                size="small"
                required
              >
                <InputLabel htmlFor="anuncio__localidad">Localidad</InputLabel>
                <Input
                  id="anuncio__localidad"
                  type="text"
                  label="Localidad"
                  autoComplete="off"
                  value={ciudadBuscar}
                  onChange={(e) => {
                    setPulsado(false);
                    setLocalidad("");
                    setCiudadBuscar(e.target.value);
                  }}
                  onKeyDown={(e) => manejarPulsarEnter(e)}
                />
                {municipiosMostrar.length > 0 && !pulsado && (
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
                {errorLocalidad.error && (
                  <MensajeError>{errorLocalidad.mensaje}</MensajeError>
                )}
              </FormControl>
              <Linea>
                <FormControl
                  style={{ position: "relative", flex: "1" }}
                  error={errorTipoInmueble.error}
                  variant="standard"
                  size="small"
                  required
                >
                  <InputLabel id="tipoInmueble__label">Inmueble</InputLabel>
                  <Select
                    labelId="tipoInmueble__label"
                    id="tipoInmueble"
                    value={tipoInmueble}
                    onChange={(e) => manejarChangeTipoInmueble(e)}
                    label="Inmueble"
                  >
                    <MenuItem value="piso">Piso</MenuItem>
                    <MenuItem value="casa">Casa/Chalet</MenuItem>
                  </Select>
                  {errorTipoInmueble.error && (
                    <MensajeError>{errorTipoInmueble.mensaje}</MensajeError>
                  )}
                </FormControl>
                {tipoInmueble === "piso" && (
                  <FormControl
                    style={{ position: "relative", flex: "1" }}
                    error={errorPlanta.error}
                    variant="standard"
                    size="small"
                    required
                  >
                    <InputLabel id="planta__label">Planta</InputLabel>
                    <Select
                      labelId="planta__label"
                      id="planta"
                      value={planta}
                      onChange={(e) => setPlanta(e.target.value)}
                      label="Planta"
                    >
                      <MenuItem value="bajo">Bajo</MenuItem>
                      <MenuItem value="entreplanta">Entreplanta</MenuItem>
                      <MenuItem value="planta1">Planta 1ª</MenuItem>
                      <MenuItem value="planta2">Planta 2ª</MenuItem>
                      <MenuItem value="planta3">Planta 3ª</MenuItem>
                      <MenuItem value="planta4">Planta 4ª</MenuItem>
                      <MenuItem value="planta5">Planta 5ª</MenuItem>
                      <MenuItem value="planta6">Planta 6ª</MenuItem>
                      <MenuItem value="planta7">Planta 7ª</MenuItem>
                      <MenuItem value="planta8">Planta 8ª</MenuItem>
                      <MenuItem value="planta9">Planta 9ª</MenuItem>
                      <MenuItem value="planta10">Planta 10ª</MenuItem>
                      <MenuItem value="planta11">Planta 11ª</MenuItem>
                      <MenuItem value="planta12">Planta 12ª</MenuItem>
                      <MenuItem value="planta13">Planta 13ª</MenuItem>
                      <MenuItem value="planta14">Planta 14ª</MenuItem>
                      <MenuItem value="planta15">Planta 15ª</MenuItem>
                    </Select>
                    {errorPlanta.error && (
                      <MensajeError>{errorPlanta.mensaje}</MensajeError>
                    )}
                  </FormControl>
                )}
              </Linea>
              <Linea>
                <FormControl
                  style={{ position: "relative", flex: "1" }}
                  error={errorGaraje.error}
                  variant="standard"
                  size="small"
                  required
                >
                  <InputLabel id="garaje__label">Garaje</InputLabel>
                  <Select
                    labelId="garaje__label"
                    id="garaje"
                    value={garaje}
                    onChange={(e) => setGaraje(e.target.value)}
                    label="Garaje"
                  >
                    <MenuItem value="si">Sí</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                  {errorGaraje.error && (
                    <MensajeError>{errorGaraje.mensaje}</MensajeError>
                  )}
                </FormControl>
                <FormControl
                  style={{ position: "relative", flex: "1" }}
                  error={errorAscensor.error}
                  variant="standard"
                  size="small"
                  required
                >
                  <InputLabel id="ascensor__label">Ascensor</InputLabel>
                  <Select
                    labelId="ascensor__label"
                    id="ascensor"
                    value={ascensor}
                    onChange={(e) => setAscensor(e.target.value)}
                    label="Ascensor"
                  >
                    <MenuItem value="si">Sí</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                  {errorAscensor.error && (
                    <MensajeError>{errorAscensor.mensaje}</MensajeError>
                  )}
                </FormControl>
              </Linea>
            </Entradas>
          </Form>
        )}
        {activeStep === 1 && (
          <Form>
            <Titulo>{steps[activeStep]}</Titulo>
            <Entradas style={{ position: "relative" }}>
              <Linea>
                <FormControl
                  style={{ position: "relative", flex: "1" }}
                  error={errorSuperficie.error}
                  variant="standard"
                  size="small"
                  required
                >
                  <InputLabel htmlFor="anuncio__superficie">
                    Superficie
                  </InputLabel>
                  <InputNumerico
                    paddingderecho={1.7}
                    id="anuncio__superficie"
                    type="number"
                    min="1"
                    value={superficie}
                    onChange={(e) =>
                      e.target.value >= 0 ? setSuperficie(e.target.value) : null
                    }
                    label="Superficie"
                    autoComplete="off"
                  />
                  <div
                    style={{ position: "absolute", right: "0", bottom: "6px" }}
                  >
                    m<sup>2</sup>
                  </div>

                  {errorSuperficie.error && (
                    <MensajeError>{errorSuperficie.mensaje}</MensajeError>
                  )}
                </FormControl>
                <FormControl
                  style={{ position: "relative", flex: "1" }}
                  error={errorExterior.error}
                  variant="standard"
                  size="small"
                  required
                >
                  <InputLabel id="exterior__label">Exterior</InputLabel>
                  <Select
                    labelId="exterior__label"
                    id="exterior"
                    value={exterior}
                    onChange={(e) => setExterior(e.target.value)}
                    label="Exterior"
                  >
                    <MenuItem value="si">Sí</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                  {errorExterior.error && (
                    <MensajeError>{errorExterior.mensaje}</MensajeError>
                  )}
                </FormControl>
              </Linea>
              <Linea>
                <FormControl
                  style={{ position: "relative", flex: "1" }}
                  error={errorHabitaciones.error}
                  variant="standard"
                  size="small"
                  required
                >
                  <InputLabel htmlFor="anuncio__habitaciones">
                    Habitaciones
                  </InputLabel>
                  <InputNumerico
                    id="anuncio__habitaciones"
                    type="number"
                    min="1"
                    value={habitaciones}
                    onChange={(e) =>
                      e.target.value >= 0
                        ? setHabitaciones(e.target.value)
                        : null
                    }
                    label="Habitaciones"
                    autoComplete="off"
                  />
                  {errorHabitaciones.error && (
                    <MensajeError>{errorHabitaciones.mensaje}</MensajeError>
                  )}
                </FormControl>
                <FormControl
                  style={{ position: "relative", flex: "1" }}
                  error={errorAseos.error}
                  variant="standard"
                  size="small"
                  required
                >
                  <InputLabel htmlFor="anuncio__aseos">Baños</InputLabel>
                  <InputNumerico
                    id="anuncio__aseos"
                    type="number"
                    min="1"
                    value={aseos}
                    onChange={(e) =>
                      e.target.value >= 0 ? setAseos(e.target.value) : null
                    }
                    label="Baños"
                    autoComplete="off"
                  />
                  {errorAseos.error && (
                    <MensajeError>{errorAseos.mensaje}</MensajeError>
                  )}
                </FormControl>
              </Linea>
              <TextField
                error={errorDescripcion.error}
                id="anuncio__descripcion"
                label="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                multiline
                rows={7}
              />
              {errorDescripcion.error && (
                <MensajeError>{errorDescripcion.mensaje}</MensajeError>
              )}
            </Entradas>
          </Form>
        )}
        {activeStep === 2 && (
          <Form>
            <Titulo>{steps[activeStep]}</Titulo>
            <Entradas>
              <FormControl
                style={{ position: "relative" }}
                error={errorImagenes.error}
                variant="standard"
                size="small"
              >
                <ListaBotonesImagenes>
                  {imagenes.map((elemento, indice) => {
                    if (elemento) {
                      return (
                        <ImagenPreview key={indice}>
                          <CloseIcon
                            onClick={() => {
                              imagenes[indice] = null;
                              return setImagenes([...imagenes]);
                            }}
                          />
                          <img src={elemento} alt="imagen" />
                        </ImagenPreview>
                      );
                    } else
                      return (
                        <BotonImagen
                          key={indice}
                          onClick={(event) => handleClick(event, indice)}
                        >
                          <input
                            ref={(ref) => (inputRef.current[indice] = ref)}
                            type="file"
                            name="anuncio__imagenes"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, indice)}
                          />
                          <AddAPhotoIcon />
                          <p>Subir Imagen</p>
                        </BotonImagen>
                      );
                  })}
                </ListaBotonesImagenes>
                {errorImagenes.error && (
                  <MensajeError>{errorImagenes.mensaje}</MensajeError>
                )}
              </FormControl>
            </Entradas>
          </Form>
        )}
        <BoxBotones>
          <Boton
            disabled={loading || activeStep === 0}
            color="inherit"
            onClick={handleBack}
          >
            Atrás
          </Boton>
          <Box sx={{ flex: "1 1 auto" }} />
          <Boton onClick={handleNext} disabled={loading}>
            {activeStep !== steps.length - 1 ? (
              "Siguiente"
            ) : loading ? (
              <Spinner src={spinner} alt="alta anuncio..." />
            ) : (
              "Modificar"
            )}
          </Boton>
        </BoxBotones>
      </BoxPersonal>
    </Contenedor>
  );
};

export default AnuncioModificar;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  height: calc(100vh - 160px);
  min-height: 650px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
  gap: 2rem;
  background: var(--gris-fondo);

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    min-height: 580px;
    padding: 1rem 0rem;
  }
`;

const MenuSuperior = styled.div`
  position: relative;
  width: 600px;
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

const TituloMenuSuperior = styled.div`
  width: 100%;
  padding: 0 1rem;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 800;
`;

const BoxPersonal = styled(Box)`
  width: 600px;

  /* Media Query para tablets */
  @media (max-width: 768px) {
    width: 440px;
  }
  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    width: 310px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;

const ContenedorStepper = styled.div`
  padding: 1rem;
  background: var(--blanco);
  box-shadow: 0 14px 26px -12px rgb(51 51 51 / 42%),
    0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(51 51 51 / 20%);

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    display: none;
  }
`;

const Form = styled.form`
  position: relative;
  width: 600px;
  height: 400px;
  padding: 40px 20px;
  margin: 2rem auto 1rem auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  background: var(--blanco);
  box-shadow: 0 14px 26px -12px rgb(51 51 51 / 42%),
    0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(51 51 51 / 20%);

  /* Media Query para tablets */
  @media (max-width: 768px) {
    width: 440px;
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    width: 310px;
    margin: 1rem 0rem;
  }
`;

const Titulo = styled.div`
  z-index: 10;
  position: absolute;
  margin: 0 auto;
  top: -15px;
  left: 0;
  bottom: 0;
  right: 0;
  width: 90%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 800;
  background: var(--negro);
  color: var(--blanco);
`;

const Entradas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputNumerico = styled(Input)`
  padding-right: ${(props) => props.paddingderecho}rem;
  /* Coloca el valor a la derecha */
  input[type="number"] {
    text-align: right;
  }

  /* Elimina las flechas del input */
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const MensajeError = styled.div`
  color: #f44336;
  font-size: 12px;
  position: absolute;
  bottom: -1.2rem;
`;

const BoxBotones = styled(Box)`
  display: flex;
  gap: 2rem;
  width: 100%;
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

const Spinner = styled.img`
  height: 24px;
`;

const Linea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
`;

const ListaBotonesImagenes = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const BotonImagen = styled.div`
  width: 142px;
  height: 94px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.2rem;
  border: 1px solid var(--negro);
  padding: 0.5rem 1rem;
  color: var(--negro);
  background: var(--blanco);
  transition: 0.2s ease-in-out;

  svg {
    font-size: 3rem;
  }

  &:hover {
    cursor: pointer;
    color: var(--blanco);
    background: var(--negro);
    box-shadow: 0 14px 26px -12px rgb(51 51 51 / 42%),
      0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(51 51 51 / 20%);
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    width: 122px;
    height: 80px;
    font-size: 0.8rem;
  }
`;

const ImagenPreview = styled.div`
  position: relative;
  width: 142px;
  height: 94px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    position: absolute;
    top: 0;
    right: 0;
    color: var(--blanco);
    background: var(--negro);

    &:hover {
      cursor: pointer;
    }
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    width: 122px;
    height: 80px;
  }
`;

const ListaCiudadBuscar = styled.div`
  z-index: 10;
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
