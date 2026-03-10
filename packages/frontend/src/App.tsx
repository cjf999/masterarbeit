//import dependencies
import { useNavigate } from "react-router-dom";
import "./App.css";
//import other components
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
// Svgs
import compareSimSrc from "./assets/compareSim.svg";
import loadSimSrc from "./assets/loadSim.svg";
import newSimSrc from "./assets/newSim.svg";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1>Willkommen!</h1>
        <h2>Wie möchten Sie fortfahren?</h2>
        <div className="main-container">
          <div className="left-container">
            <div className="content" onClick={() => navigate("/setup")}>
              <h3>Möchten Sie eine neue Simulation starten?</h3>
              <img src={newSimSrc} alt="start new simulation" />
            </div>
          </div>
          <div className="center-container">
            <div className="content" onClick={() => navigate("/result")}>
              <h3>Möchten Sie eine vorherige Simulation laden?</h3>
              <img src={loadSimSrc} alt="load previous simulation" />
            </div>
          </div>
          <div className="right-container">
            <div className="content" onClick={() => navigate("/compare")}>
              <h3>Möchten Sie zwei Simulationen vergleichen?</h3>
              <img src={compareSimSrc} alt="compare two simulations" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
