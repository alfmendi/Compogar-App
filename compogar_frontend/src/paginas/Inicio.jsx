import Hero from "../componentes/Hero";
import Anunciar from "../componentes/Anunciar";
import ListadoPorProvincias from "../componentes/ListadoPorProvincias";

// -----------------------------------------------
// -----------------------------------------------
// - Componente para mostrar la página de inicio -
// -----------------------------------------------
// -----------------------------------------------
const Inicio = () => {
  // -------
  // - JSX -
  // -------
  return (
    <>
      <Hero />
      <Anunciar />
      <ListadoPorProvincias />
    </>
  );
};

export default Inicio;
