import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import SimLoader from "../components/SimLoader";

function Compare(){
    return(
        <>
        <Navbar />
        <h1>Compare View</h1>
        <div className="" style={{textAlign: "center"}}>
            <p>Zwei Simulationen vergleichen</p>
        </div>
        {/*first simloader*/}
        <div>
            <SimLoader />
            Geben sie hier die ID der <b>ersten</b> Simulation ein:
        </div>
        {/*second simloader*/}
        <div>
            <SimLoader />
            Geben sie hier die ID der <b>zweiten</b> Simulation ein:
        </div>
        <br/>
        <div style={{textAlign: "center"}}>
            <Link to={"/"}>Zurück zur Startseite</Link>
        </div>        
        <Footer />
        </>
    )
}

export default Compare;