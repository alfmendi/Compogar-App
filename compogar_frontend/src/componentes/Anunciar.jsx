import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import styled from "styled-components";

import imagen02 from "../assets/imagen02.jpg";

// -----------------------------------------------------
// -----------------------------------------------------
// - Componente que muestra tarjeta para poner anuncio -
// -----------------------------------------------------
// -----------------------------------------------------
const Anunciar = () => {
  const { usuario } = useSelector((state) => state.usuario);

  // -------
  // - JSX -
  // -------
  return (
    <Contenedor>
      <Contenido>
        <Card>
          <Texto>
            <h2>Publica tu inmueble</h2>
            <p>
              Todos tus anuncios son <span>GRATIS</span>
            </p>
            <Boton
              to={usuario ? "/anuncioAlta" : "/login"}
              state={{ from: "/anuncioAlta" }}
            >
              Poner anuncio
            </Boton>
          </Texto>
          <Imagen src={imagen02} alt="" />
        </Card>
      </Contenido>
    </Contenedor>
  );
};

export default Anunciar;

// ---------------------
// - Styled Components -
// ---------------------
const Contenedor = styled.div`
  width: 100%;
  height: 250px;
  background: var(--gris-fondo);
`;

const Contenido = styled.div`
  max-width: 1400px;
  height: 100%;
  margin: 1rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  height: 80%;
  padding: 0rem 0rem 0rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background: var(--blanco);
  box-shadow: 0 14px 26px -12px rgb(53 70 92 / 42%),
    0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(53 70 92 / 20%);

  @media (max-width: 768px) {
    padding: 0rem 1rem;
  }
`;

const Texto = styled.div`
  p {
    color: #aaa;
    padding: 1rem 0rem;
  }

  span {
    color: var(--negro);
    font-weight: 900;
  }

  /* Media Query para dispositivos móviles */
  @media (max-width: 480px) {
    h2 {
      font-size: 1.2rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
`;

const Boton = styled(Link)`
  text-decoration: none;
  font-family: var(--texto-fuente);
  font-size: 1rem;
  color: var(--negro);
  background: var(--blanco);
  border: 1px solid var(--negro);
  padding: 0.5rem 1rem;
  transition: 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    color: var(--blanco);
    background: var(--negro);
    box-shadow: 0 14px 26px -12px rgb(53 70 92 / 42%),
      0 4px 23px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(53 70 92 / 20%);
  }
`;

const Imagen = styled.img`
  height: 100%;
  width: 400px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  object-fit: cover;

  /* Media Query para tablest y ipads */
  @media (max-width: 768px) {
    display: none;
  }
`;
