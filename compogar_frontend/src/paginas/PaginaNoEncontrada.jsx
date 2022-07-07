import { useNavigate } from "react-router-dom";

import styled from "styled-components";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// - Componente que se muestra en caso de que la página no exista -
// ----------------------------------------------------------------
// ----------------------------------------------------------------
const PaginaNoEncontrada = () => {
  const navigate = useNavigate();

  // -------
  // - JSX -
  // -------
  return (
    <Contenedor>
      <h2>Página no encontrada</h2>
      <Boton onClick={() => navigate("/")}>Volver</Boton>
    </Contenedor>
  );
};

export default PaginaNoEncontrada;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: calc(100vh - 160px);
  background: var(--gris-fondo);
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
`;
