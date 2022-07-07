import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPersistente from "./componentes/LoginPersistente";
import ContenidoProtegido from "./componentes/ContenidoProtegido";

import Layout from "./componentes/Layout";

import Registro from "./paginas/Registro";
import Login from "./paginas/Login";

import Inicio from "./paginas/Inicio";

import AnuncioAlta from "./paginas/AnuncioAlta";
import AnuncioModificar from "./paginas/AnuncioModificar";
import MisAnuncios from "./paginas/MisAnuncios";
import AnunciosLocalidad from "./paginas/AnunciosLocalidad";
import AnuncioMostrar from "./paginas/AnuncioMostrar";

import PaginaNoEncontrada from "./paginas/PaginaNoEncontrada";

// -----------------------------------------
// -----------------------------------------
// - Componente principal de la aplicación -
// -----------------------------------------
// -----------------------------------------
function App() {
  // -------
  // - JSX -
  // -------
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Rutas públicas */}
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          {/* Quiero que estas rutas sean persistentes, es decir,
          que al hacer F5 vuelva a la ruta en la que estaba */}
          <Route element={<LoginPersistente />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/anunciosLocalidad" element={<AnunciosLocalidad />} />
            <Route path="/anuncio/:anuncioId" element={<AnuncioMostrar />} />

            {/* Rutas privadas*/}
            <Route element={<ContenidoProtegido />}>
              <Route path="/anuncioAlta" element={<AnuncioAlta />} />
              <Route
                path="/anuncioModificar/:anuncioId"
                element={<AnuncioModificar />}
              />
              <Route path="/misAnuncios" element={<MisAnuncios />} />
            </Route>
          </Route>
          {/* Ruta en caso de error */}
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
