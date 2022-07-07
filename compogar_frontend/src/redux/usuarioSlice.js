// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// import axios from "../axiosAPI/axios";

// // Creación del thunk
// export const conseguirUsuario = createAsyncThunk(
//   "usuario/conseguirUsuario",
//   async (credenciales, thunkAPI) => {
//     // const usuario = await axios.post("/api/auth/login", credenciales);
//     // console.log("El valor de usuario en conseguirUsuario es...", usuario);
//     // return usuario.data;
//     try {
//       const usuario = await axios.post(
//         "/api/auth/login",
//         credenciales
//       );
//       return usuario.data;
//     } catch (error) {
//       // console.log("El valor de error en usuarioSlice es...", error);
//       // console.log(
//       //   "El valor de error.response.data.mensaje en usuarioSlice es...",
//       //   error.response.data.mensaje
//       // );
//       // Use `error.response.data` as `action.payload` for a `rejected` action,
//       // by explicitly returning it using the `rejectWithValue()` utility
//       // Dentro de error.response.data hay un objeto {mensaje:"descripción del error"}
//       return thunkAPI.rejectWithValue(error.response.data.mensaje);
//     }
//   }
// );

// // Login user
// export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
//   try {
//     return await authService.login(user)
//   } catch (error) {
//     const message =
//       (error.response && error.response.data && error.response.data.message) ||
//       error.message ||
//       error.toString()
//     return thunkAPI.rejectWithValue(message)
//   }
// })

const usuarioSlice = createSlice({
  name: "usuario",
  initialState: {
    usuario: null,
    loading: false,
    error: null,
    mensajeAMostrar: null,
  },
  reducers: {
    setDispatchUsuario: (state, action) => {
      state.usuario = action.payload;
    },
    setDispatchMensajeAMostrar: (state, action) => {
      // El mensaje es {tipo:"success/error",texto:"texto del mensaje..."}
      state.mensajeAMostrar = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   // Add reducers for additional action types here, and handle loading state as needed
  //   builder.addCase(conseguirUsuario.pending, (state) => {
  //     state.loading = true;
  //     state.error = null;
  //   });
  //   builder.addCase(conseguirUsuario.fulfilled, (state, action) => {
  //     // Añade el usuario al estado
  //     console.log(
  //       "El valor de action.payload en conseguirUsuario.fulfilled es...",
  //       action.payload
  //     );
  //     state.usuario = action.payload;
  //     state.loading = false;
  //   });
  //   builder.addCase(conseguirUsuario.rejected, (state, action) => {
  //     console.log(
  //       "El valor de action.payload en conseguirUsuario.rejected es...",
  //       action.payload
  //     );
  //     // console.log(
  //     //   "El valor de action.error.message es...",
  //     //   action.error.message
  //     // );
  //     // console.log("El valor de action.error es...", action.error);
  //     state.usuario = null;
  //     state.error = action.payload;
  //     //state.error = action.error.message;
  //     state.loading = false;
  //   });
  // },
});

// Los llamo así para no olvidar el dispatch...
export const { setDispatchUsuario, setDispatchMensajeAMostrar } =
  usuarioSlice.actions;

export default usuarioSlice.reducer;
