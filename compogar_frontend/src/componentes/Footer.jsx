import styled from "styled-components";

// ------------------------------------------------
// ------------------------------------------------
// - Componente que muestra el footer de la página-
// ------------------------------------------------
// ------------------------------------------------
const Footer = () => {
  // -------
  // - JSX -
  // -------
  return (
    <Contenedor>
      <h3>alfonsoauzmendia@gmail.com</h3>
    </Contenedor>
  );
};

export default Footer;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  background: var(--dark);
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  h3 {
    text-align: center;
    color: var(--blanco);
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    h3 {
      font-size: 1rem;
    }
  }
`;
