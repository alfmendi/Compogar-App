import { createSlice } from "@reduxjs/toolkit";

const localidadSlice = createSlice({
  name: "localidad",
  initialState: {
    localidad: null,
    alquilar: true,
  },
  reducers: {
    setDispatchLocalidad: (state, action) => {
      state.localidad = action.payload.localidad;
      state.alquilar = action.payload.alquilar;
    },
  },
});

// Los llamo así para no olvidar el dispatch...
export const { setDispatchLocalidad } = localidadSlice.actions;

export default localidadSlice.reducer;
