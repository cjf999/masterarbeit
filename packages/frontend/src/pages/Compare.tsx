import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import SimLoader from "../components/SimLoader";

function Compare(){
    return(
        <>
        <Navbar />
        <div className="compare-container">
        <h1>Compare View</h1>
        <div className="" style={{textAlign: "center"}}>
            <p>Zwei Simulationen vergleichen</p>
        </div>        
        <div className="compare-content">
            <div className="view-left">
                <div> {/*first simloader*/}
                    <SimLoader />
                    Geben sie hier die ID der <b>ersten</b> Simulation ein:
                </div>            
            </div>
            <div className="view-right">
                <div> {/*second simloader*/}
                    <SimLoader />
                    Geben sie hier die ID der <b>zweiten</b> Simulation ein:
                </div>                   
            </div>
        </div>

        <br/>

        <div style={{textAlign: "center", marginTop: "50px"}}>
            <Link to={"/"}>Zurück zur Startseite</Link>
        </div>   
        </div>     
        <Footer />
        </>
    )
}

export default Compare;