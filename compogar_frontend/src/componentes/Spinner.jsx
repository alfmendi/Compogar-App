import styled from "styled-components";

import spinner from "../assets/spinner.gif";

// ------------------------------------------------------------
// ------------------------------------------------------------
// - Componente para mostrar un spinner cuando la información -
// - se está cargando                                         -
// ------------------------------------------------------------
// ------------------------------------------------------------
const Spinner = () => {
  // -------
  // - JSX -
  // -------
  return (
    <Contenedor>
      <img src={spinner} alt="cargando datos"></img>
    </Contenedor>
  );
};

export default Spinner;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 60px;
  }
`;
