import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link, useLocation } from "react-router-dom";

export default function Result() {

    //dummy params
    /** 
    const inputParams = [{
        id: "1337420"
    }]
    */

    //dummy resultParams
    /**
    const resultParams = [{
        simulationId: "1337420",
        status: "done!",
        startTime: "31.01.2026",
        endTime: "31.12.2026",
        configFile: "someFile",
        resultFile: "array aus Files",
        plotFiles: "array aus PlotFiles",
        errorMessage: "kein fehler aufgetreten"
    }]
    */

    const [simulationId, setSimulationId] = useState(""); 
    const [inputValue, setInputValue] = useState(""); //
    const [data, setData] = useState(null);

    //holt state prop aus aktueller location um später {id} an URL anzuhängen
    const { state } = useLocation(); 

    //wenn sich state ändert, dann setze simulationId auf state.simId (sofern da)
    useEffect(() => {
        setSimulationId(state?.simId || "");
    }, [state])

    //wenn sich simulationId ändert, dann neue daten mit neuer simulationId fetchen
    useEffect(() => {
        fetchData(simulationId);
    }, [simulationId])

    //api call
    const fetchData = (simId: string | null) => {
        if (!simId) return;
        console.log("fetching", "https://gems.hciuse.sh/simulations/" + simId)
        fetch("https://gems.hciuse.sh/simulations/" + simId).then(async res => {
            setData(await res.json())
        });
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

    const fetchHandler = () => {
        fetchData(simulationId);
        console.log("gefundene daten:", data);
    }

    return(
        <>
        <Navbar />
        <h1>Result View</h1>
        <h2>Hier können durchgeführte Simulationen über ihre ID geladen werden.</h2>
        
        <form onSubmit={handleSubmit} className="result-form" > 
            Gib hier die id der simulation ein, um die ergebnisse zu laden:
            <div>
                
                    <input 
                    name="id" 
                    type="text" 
                    value={inputValue} 
                    onChange={e => setInputValue(e.target.value)} 
                    />
                
            </div>
            <button 
            type="submit" 
            className="button-container start-button" 
            style={{marginTop: "20px"}}
            >
                Simulation holen
            </button>
        </form>
        <p>ID der zuletzt geholten Simulation: {inputValue}</p> 
        <br />
        {/**
        <div>
            <p>hier die daten:
                
            </p>
        </div>
         */}
        <p>debugging-button:</p>
        <div>
            <button onClick={fetchHandler}>Daten neu laden und in konsole printen</button>
        </div>
        <br />
        <Link to={"/"}>Zurück zur Startseite</Link>
        <Footer />
        </>
    )
}