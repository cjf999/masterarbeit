//import components
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
//import hooks etc
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Success(){

    const [simulationId, setSimulationId] = useState("");
    const { state } = useLocation();

    useEffect(() => {
    setSimulationId(state?.simId || "");
    }, [state])

    return(
        <>
        <Navbar />
        <div style={{textAlign: "center"}}>
            <h2>Die Simulation wurde erfolgreich gestartet!</h2>
            <p>ID der Simulation:</p>
            <p style={{fontSize: "20px"}}>{simulationId}</p> 
            <p><em>Die ID wird benötigt um die Ergebnisse abzurufen. Kopieren Sie sie in die Zwischenablage!</em></p>
            <Link className="result-link" to="/result">Hier können Sie die Ergebnisse abrufen</Link> ➡️
        </div>
        <Footer />
        </>
    )
}