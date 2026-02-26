import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link, useLocation, useParams } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";

export default function Result() {

    //errorhandling
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [simulationId, setSimulationId] = useState(""); 
    const [inputValue, setInputValue] = useState(""); //damit nicht bei jeder zeicheineingabe simId geaändert und dadurch fetchData gecalled wird
    
    //checken, ob mit "sim_" beginnt
    const isValidInput = (simId: string) => {
        const pattern = /^sim_\d+$/;
        return pattern.test(simId);
    }

    type SimulationData = {
        simulationId: string;
        status: string;
        startTime: string;
        endTime: string;
        configFile: string;
        resultFiles: string[];
        plotFiles: string[];
        errorMessage: string;
    }

    type Artifact = {
        type: "plot" | "csv";
        mime: string;
        filename: string;
        size: number;
        createdAt: string;
    }

    const [data, setData] = useState<SimulationData | null>(null);

    //holt state prop aus aktueller location um später {id} an URL anzuhängen
    const { state } = useLocation(); 

    //dynamic route param (z.B. /result/1337420) wird in id gespeichert
    const { id } = useParams();

    //wenn sich state ändert, dann setze simulationId auf state.simId (sofern da)
    useEffect(() => {
        setSimulationId(state?.simId || "");
    }, [state])

    //wenn sich simulationId ändert, dann neue daten mit neuer simulationId fetchen
    useEffect(() => {
        fetchData(simulationId);
    }, [simulationId])

    //api call
    const fetchData = async (simId: string | null) => {
        if (!simId) return;

        if (!isValidInput(simId)) {
        setError("Die ID muss das Format sim_123456789 haben! Überprüfen Sie Ihre Eingabe.");
        return;
        }    

        setLoading(true);
        setError(null);
        setData(null);

        try {
            console.log("fetching", "https://gems.hciuse.sh/simulations/" + simId)
            const res = await fetch("https://gems.hciuse.sh/simulations/" + simId);
            
            if (!res.ok){
                throw new Error("Fehler beim Abrufen der Ergebnisse. Fehlercode: " + res.status);
            }

            setData(await res.json());
        }
        catch (err: any){
            setError(err.message || "Unbekannter Fehler beim Abrufen der Ergebnisse");
        }
        finally{
            setLoading(false);
        }
    }

    //wenn data sich ändert, dann loggen (debug)
    useEffect(() => {
        console.log('data:', data);
    }, [data])

    //submit handler 
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSimulationId(inputValue); 
        const data = new FormData(event.currentTarget);
        const simId = data.get("id") as string;
        console.log('looking for simId', simId);
        setSimulationId(simId); // !!Wichtig!! hier wird state geändert und fetchData erneut aufgerufen
    }

    return(
        <>
        <Navbar />
        <div className="result-container">
        <h1>Result View</h1>
        <h2>Hier können durchgeführte Simulationen über ihre ID geladen werden.</h2>

        <form onSubmit={handleSubmit} className="result-form" > 
            Gib hier die id der simulation ein, um die ergebnisse zu laden:
            <div className="fetch-container">
                    {simulationId ? 
                    <input 
                    className="fetch-input"
                    name="id" 
                    type="text" 
                    value={simulationId} // hier muss maybe noch onChange rein, sonst wird input unbrauchbar
                    /> 
                    :
                    <input 
                    className="fetch-input"
                    name="id" 
                    type="text" 
                    placeholder="SimID eingeben..."
                    value={inputValue} 
                    onChange={e => setInputValue(e.target.value)} 
                    />                     
                    }

            <button 
            type="submit" 
            className="button-container fetch-button" 
            >
                Ergebnisse laden
            </button>

            </div>

        </form>
        {/** <p>ID der zuletzt geholten Simulation: {data?.simulationId}</p> 
        <br /> */}
        
        {loading && <CircularProgress />}
        {error && 
            <div className="status-error">
                <Alert severity="error">{error}</Alert>
            </div>
        }
        {data && data.status === "completed" && (
            <div className="status-success">
                <Alert severity="success">Status der Simulation: {data.status}. yay!</Alert>
            </div>
        )}
        {data && data.status !== "completed" && (
            <div className="status-failed">
                <Alert severity="warning">Status der Simulation: {data.status}. yuck..</Alert>
            </div>
        )}
        <br />
        <Link className="return-link" to={"/"}>Zurück zur Startseite</Link>
        </div>
     
        <Footer />
        </>
    )
}