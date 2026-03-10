import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SimLoader from "../components/SimLoader";

function Compare(){
    return(
        <>
        <Navbar />
        <div className="compare-container">
            <h1>Compare View</h1>
            <div className="" style={{textAlign: "center"}}>
                <p>Hier können Sie die Ergebnisse zweier Simulationen vergleichen</p>
            </div>        
            <div className="compare-content">
                <div className="view-left">
                    <div> {/*first simloader*/}
                        <p style={{textAlign: "center"}}>Geben sie hier die ID der <b>ersten</b> Simulation ein:</p>
                        <SimLoader />
                    </div>            
                </div>
                <div className="view-right">
                    <div> {/*second simloader*/}
                        <p style={{textAlign: "center"}}>Geben sie hier die ID der <b>zweiten</b> Simulation ein:</p>
                        <SimLoader />
                    
                    </div>                   
                </div>
            </div>
            <br/>
        </div>     
        <Footer />
        </>
    )
}

export default Compare;