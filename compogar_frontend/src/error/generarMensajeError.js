// --------------------------------------------------------------
// - Función que gestiona los errores devueltos por el servidor -
// --------------------------------------------------------------
const generarMensajeError = (error) => {
  let mensajeError = "";
  if (!error?.response || !error?.response?.data) {
    mensajeError = "No hay respuesta del servidor";
  } else {
    mensajeError = error.response.data.mensaje;
  }
  return mensajeError;
};

export default generarMensajeError;
