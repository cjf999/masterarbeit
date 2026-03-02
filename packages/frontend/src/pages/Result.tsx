import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";

export default function Result() {

    //errorhandling
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    //data für fetch
    const [data, setData] = useState<SimulationData | null>(null);

    const [simulationId, setSimulationId] = useState(""); 
    const [inputValue, setInputValue] = useState(""); //damit nicht bei jeder zeicheineingabe simId geaändert und dadurch fetchData gecalled wird
    
    //checken, ob input mit "sim_" beginnt
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

    //konkrete ergebnisse 
    const [artifactLoading, setArtifactLoading] = useState(false);
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [artifactError, setArtifactError] = useState<string | null>(null);

    //config (hier einfach als referenzen zum vergleich eingabe/ausgabe)
    const [config, setConfig] = useState<any>(null);
    const [configLoading, setConfigLoading] = useState(false);
    const [configError, setConfigError] = useState<string | null>(null);


    //quellen für simulationId
    const { state } = useLocation(); 
    const { simId } = useParams<{simId: string}>();    

    //navigieren
    const navigate = useNavigate();

    //setze simulationId auf simId (egal ob von eingabe oder durch übergabe!) und update bei änderung
    useEffect(() => {
        if(simId){
            setSimulationId(simId);
            setInputValue(simId);
        }
        else if(state?.simId){
            setSimulationId(state.simId)
            setInputValue(state.simId)
        }
    }, [simId, state]);

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

        if(!isValidInput(inputValue)){
            setError("Ungültige SimulationID! Das Format muss sim_123456789 sein.")
            return;
        }

        navigate(`/result/${inputValue}`);

        // setSimulationId(inputValue); 
        // const data = new FormData(event.currentTarget);
        // const simId = data.get("id") as string;
        console.log('looking for simId', simId);
        // setSimulationId(simId); 
    }

    const fetchArtifacts = async (simId: string) => {
        
        setArtifactLoading(true);
        setArtifactError(null);
        setArtifacts([]);

        try{
            const res = await fetch(`https://gems.hciuse.sh/simulations/${simId}/artifacts`);

            if (!res.ok){
                throw new Error("Abbildungen und Daten konnten nicht geladen werden.");
            }
            setArtifacts(await res.json());
        }
        catch (err: any){
            setArtifactError(err.message);
            console.log(artifactError)
        }
        finally{
            setArtifactLoading(false);
        }
    }

    useEffect(() => {

        if(data && data.status === "completed"){
            fetchArtifacts(data.simulationId) //gucken auf data und nicht auf eingabe?
            //fetchConfig(data.simulationId)
        }
    }, [data])

    useEffect(() => {
        console.log('artifactData:', artifacts);
        console.log("artifactLink", `https://gems.hciuse.sh/simulations/${simulationId}/artifacts/`)
    }, [data])

    return(
        <>
        <Navbar />
        <div className="result-container">
        <h1>Result View</h1>
        <h2>Hier können durchgeführte Simulationen über ihre ID geladen werden.</h2>

        <form onSubmit={handleSubmit} className="result-form" > 
            Gib hier die id der simulation ein, um die ergebnisse zu laden:
            <div className="fetch-container">

                    <input 
                    className="fetch-input"
                    name="id" 
                    type="text" 
                    placeholder="SimID eingeben..."
                    value={inputValue} 
                    onChange={e => setInputValue(e.target.value)} 
                    />                     
                    
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

        {artifactLoading && <CircularProgress />}
        {artifacts.length > 0 && ( //überhaupt was da? wenn ja (> 0), dann gib aus
            <div className="artifact-container">
                <h2>Plots:</h2>
                {artifacts.map((artifact) => (
                    <div key={artifact.filename} className="artifact-item-plot">
                        {artifact.type === "plot" &&(
                            <img 
                            crossOrigin="anonymous" //muss anscheinend
                            src={`https://gems.hciuse.sh/simulations/${simulationId}/artifacts/${artifact.filename}`} 
                            alt={artifact.filename}
                            className="artifact-img"
                            />
                        )}
                    </div> 
                ))}
            </div>
        )}
        {artifacts.length > 0 && (
            <div className="artifact-container">
                <h2>Rohdaten:</h2>
            </div>
        )}
        
        </div>
        <Link className="return-link" to={"/"}>Zurück zur Startseite</Link>
        <Footer />
        </>
    )
}