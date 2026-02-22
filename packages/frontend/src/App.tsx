//import dependencies 
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css'
//import other components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
 
  const location = useLocation();
  const navigate = useNavigate();
  const clickHandler = () => {
    console.log(location.pathname);
  }  

  return (
    <>
    <Navbar />
    <h1>Willkommen!</h1>
    <h2>Wie möchten Sie fortfahren?</h2>
    <div className="main-container">
      <div className="left-container">
        <div className="content" onClick={() => navigate("/setup")}>
          <h3>Möchten Sie eine neue Simulation starten?</h3>
          <img src="/src/assets/newSim.svg" alt="start new simulation" />
        </div>
      </div>
      <div className="center-container">
        <div className="content" onClick={() => navigate("/result")}>
          <h3>Möchten Sie eine vorherige Simulation laden?</h3>
          <img src="/src/assets/loadSim.svg" alt="load previous simulation" />
        </div>
      </div>
      <div className="right-container">
        <div className="content" onClick={() => navigate("/compare")}>
          <h3>Möchten Sie zwei Simulationen vergleichen?</h3>
          <img src="/src/assets/compareSim.svg" alt="compare two simulations" />
        </div>
      </div>
    </div>
    <button onClick={clickHandler}>Gib aktuelle url aus</button>
    <Footer />
    </>
  )
}

export default App
