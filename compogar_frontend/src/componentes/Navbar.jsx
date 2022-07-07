import { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";

import styled from "styled-components";

import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";

import logo from "../assets/logo.png";

// ------------------------------------------------------
// ------------------------------------------------------
// - Componente para mostrar la navbar de la aplicación -
// ------------------------------------------------------
// ------------------------------------------------------
const Navbar = () => {
  const { usuario } = useSelector((state) => state.usuario);

  const [mostrarMenu, setMostrarMenu] = useState(false);

  const navegar = useNavigate();
  const location = useLocation();

  // --------------------------------------------
  // - Método para volver a la página principal -
  // --------------------------------------------
  const volverPaginaPrincipal = () => {
    navegar("/");
  };

  // -------------------------------------------
  // - Método para enviar a la página de login -
  // -------------------------------------------
  const hacerLogin = () => {
    navegar("/login");
  };

  // ---------------------------------
  // - Método que gestiona el logout -
  // ---------------------------------
  const manejarSalir = async () => {
    try {
      setMostrarMenu(false);
    } catch (error) {
    } finally {
      navegar("/login");
    }
  };

  // -------
  // - JSX -
  // -------
  return (
    <Contenedor oscuro={location.pathname === "/" ? false : true}>
      <Logo onClick={() => navegar("/")}>
        <img style={{ height: "40px" }} src={logo} alt="" />
        <h2>ompogar</h2>
      </Logo>
      {location.pathname === "/login" || location.pathname === "/registro" ? (
        <Boton onClick={volverPaginaPrincipal}>
          {" "}
          <HomeIcon />
          Inicio
        </Boton>
      ) : !usuario?.nombre ? (
        <Boton onClick={hacerLogin}>
          <PersonIcon />
          <span className="texto__largo">Iniciar Sesión</span>
          <span className="texto__corto">Acceso</span>
        </Boton>
      ) : (
        <Registrado>
          <p>Hola {usuario?.nombre.split(" ")[0]}</p>
          {!mostrarMenu ? (
            <Menu>
              <MenuIcon onClick={() => setMostrarMenu(true)} />
            </Menu>
          ) : (
            <Menu>
              <CloseIcon onClick={() => setMostrarMenu(false)} />
              <Opciones className="slide-bottom">
                <Boton
                  onClick={() => {
                    setMostrarMenu(false);
                    navegar("/anuncioAlta");
                  }}
                >
                  Poner anuncio
                </Boton>
                <Boton
                  onClick={() => {
                    setMostrarMenu(false);
                    navegar("/misAnuncios");
                  }}
                >
                  Mis anuncios
                </Boton>
                <Boton onClick={manejarSalir}>Salir</Boton>
              </Opciones>
            </Menu>
          )}
        </Registrado>
      )}
    </Contenedor>
  );
};

export default Navbar;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  position: relative;
  z-index: 15;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: ${(props) =>
    props.oscuro ? "var(--gris-fondo)" : "var(--blanco)"};

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    margin-right: -8px;
  }

  h2 {
    background: linear-gradient(to right, #51b8db 0%, #1867aa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    /* Media Query para dispositivos móviles */
    @media (max-width: 480px) {
      display: none;
    }
  }

  &:hover {
    cursor: pointer;
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    h2 {
      font-size: 1.2rem;
    }
  }
`;

const Boton = styled.button`
  outline: none;
  font-family: var(--texto-fuente);
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  color: var(--negro);
  background: var(--blanco);
  border: 1px solid var(--negro);
  padding: 0.5rem 1rem;
  transition: 0.2s ease-in-out;

  .texto__largo {
    display: inline;
  }

  .texto__corto {
    display: none;
  }

  &:hover {
    cursor: pointer;
    color: var(--blanco);
    background: var(--negro);
    box-shadow: 0 14px 26px -12px rgb(53 70 92 / 42%),
      0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(53 70 92 / 20%);
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    .texto__largo {
      display: none;
    }

    .texto__corto {
      display: inline;
    }
  }
`;

const Menu = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 35px;
    height: 35px;
    padding: 5px;
    border-radius: 50%;
    transition: 0.2s ease-in-out;
  }

  svg:hover {
    cursor: pointer;
    border-radius: 50%;
    background: var(--negro);
    color: var(--blanco);
  }
`;
const Opciones = styled.div`
  z-index: 1000;
  position: absolute;
  width: 200px;
  top: 40px;
  right: 0px;
  border: 1px solid var(--negro);
  padding: 1rem;
  background: var(--gris-fondo);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 1rem;

  button {
    width: 100%;
  }
`;

const Registrado = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;
