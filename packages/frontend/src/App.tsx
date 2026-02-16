//import dependencies 
import { useLocation } from 'react-router-dom';
import './App.css'
//import other components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
 
  const location = useLocation();

  const clickHandler = () => {
    console.log(location.pathname);
  }  

  return (
    <>
    <Navbar />
      <h1>Vite + React</h1>
    <div className='default-content'>
      <button onClick={clickHandler}>Gib aktuelle url aus</button>
    </div>
    <Footer />
    </>
  )
}

export default App
