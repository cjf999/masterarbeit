import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";
//import other components
import Footer from "./Footer";
import Navbar from "./Navbar";


export default function SimLoader(){
    
    //holt state prop aus location um {id} anhängen zu können
    const { state } = useLocation(); 

    //errorhandling
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    //simulationId auf leeren string setzen
    const [simulationId, setSimulationId] = useState(""); 
    const [inputValue, setInputValue] = useState(""); //damit nicht bei jeder zeicheineingabe simId geaändert und dadurch fetchData gecalled wird

    //checken, ob eingabe mit "sim_" beginnt
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
    const [data, setData] = useState<SimulationData | null>(null);

    //wenn sich sim id ändert, dann neue daten mit neuer sim id fetchen
    useEffect(() => {
        fetchData(simulationId);
    }, [simulationId])

    //wenn sich state ändert, dann setze simulationId auf state.simId (sofern da)
    useEffect(() => {
        setSimulationId(state?.simId || "");
    }, [state])

    //api call
    const fetchData = async (simId: string | null) => {
        if (!simId) return;

        if (!isValidInput(simId)) {
        setError("Simulation ID muss dem Format sim_123456789 entsprechen.");
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

    //debugging
    useEffect(() => {
        console.log('data:', data);
    }, [data])

    //submithandler 
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
            <h2>SimLoader-Component</h2>
            <form onSubmit={handleSubmit} className="result-form">
            <div>
                
                    <input 
                    name="id" 
                    type="text" 
                    value={inputValue} 
                    onChange={e => setInputValue(e.target.value)} 
                    />
                
            </div>
            </form>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {data && data.status !== "completed" && (
                <div className="status-failed">
                    <Alert severity="warning">Status: {data.status}</Alert>
                </div>
            )}    
            {/** wenn daten da, dann hier ausgeben */}        
        </>
        )
}