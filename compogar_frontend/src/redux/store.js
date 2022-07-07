import { configureStore } from "@reduxjs/toolkit";

import usuarioReducer from "./usuarioSlice";
import localidadReducer from "./localidadSlice";

const store = configureStore({
  reducer: {
    usuario: usuarioReducer,
    localidad: localidadReducer,
  },
});

export default store;
