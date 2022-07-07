import { toast } from "react-toastify";
// import { Slide, Zoom, Flip, Bounce } from "react-toastify";
import { Zoom } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// ---------------------------------------------------------
// - Función que devuelve un toast con un mensaje de éxito -
// ---------------------------------------------------------
const exitoToast = (mensajeExito, posicion = "top-center", cerrar = null) => {
  toast.clearWaitingQueue();
  return toast.success(mensajeExito, {
    position: posicion,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    transition: Zoom,
    theme: "colored",
    bodyClassName: "texto__toastify",
    onClose: cerrar,
  });
};

export default exitoToast;
