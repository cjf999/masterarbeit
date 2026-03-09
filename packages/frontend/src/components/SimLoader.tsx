//import dependencies
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";
import toml from "toml"

//types
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

//checken, ob eingabe mit "sim_" beginnt
const isValidInput = (simId: string) => {
    const pattern = /^sim_\d+$/;
    return pattern.test(simId);
} 

export default function SimLoader(){
    
    /* states */
    //errorhandling
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    //data für fetch von sim Daten
    const [data, setData] = useState<SimulationData | null>(null);
    const [simulationId, setSimulationId] = useState(""); 
    const [inputValue, setInputValue] = useState(""); //damit nicht bei jeder zeicheineingabe simId geändert und dadurch fetchData gecalled wird

    //konkrete ergebnisse (Plots)
    const [artifactLoading, setArtifactLoading] = useState(false);
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [artifactError, setArtifactError] = useState<string | null>(null);

    //config (hier einfach als sim-parameter-referenzen zum vergleich eingabe/ausgabe)
    const [config, setConfig] = useState<any>(null);
    const [configLoading, setConfigLoading] = useState(false);
    const [configError, setConfigError] = useState<string | null>(null);

    /* routing hooks */
    //holt state prop aus location um {id} anhängen zu können
    const { state } = useLocation(); 

    //output vars für config referenzen
    const simInfo = config?.Simulation;
    const popInfo = config?.Population;
    const pathogenTypeInfo = config?.Simulation?.StartCondition;
    const pathogenInfo = config?.Pathogens?.Covid19;
    const interventionInfo = config?.interventions;
    /*
    future work: man könnte 
    const batchInfo = config?.batch;
    ergänzen, um batch runs anzuzeigen
    */ 

    /* api calls */
   


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

    //api call für plots etc
    const fetchArtifacts = async (simId: string) => {
        
        setArtifactLoading(true);
        setArtifactError(null);
        setArtifacts([]);

        try{
            const res = await fetch(`https://gems.hciuse.sh/simulations/${simId}/artifacts`);

            if (!res.ok){
                throw new Error("Abbildungen und Daten konnten nicht geladen werden. Fehlercode: "+ res.status);
            }
            setArtifacts(await res.json());
        }
        catch (err: any){
            setArtifactError(err.message);
            console.log(artifactError)
        }
        finally{
            setArtifactLoading(false);
            console.log("fetchArtifacts called ALARM ALARM");
        }
    }

    //api call für config (input params etc)
    const fetchConfig = async (simId: string) => {

        setConfigLoading(true);
        setConfigError(null);
        setConfig(null);

        try{
            const res = await fetch(`https://gems.hciuse.sh/simulations/${simId}/config`);

            if(!res.ok){
                throw new Error("Config-Daten konnten nicht geladen werden. Fehlercode: "+ res.status);
            }

            /**
             * dieses mumbo jumbo replace() muss leider sein, weil sonst versucht wird, einen float-value auf ein integer-array zu parsen. 
             * ggfs. TOML-config anpassen, sodass ein array wie zb "[1, 0.0]" als [1.0, 0.0]
             * der parser liest das erste element im array und macht daran fest, von welchem typ das array ist.
             * im obigen fall 1 wäre ein int, aber 0.x ein float. alle elemente müssen den selben typ haben
             * */
            const text = await res.text();
            const fixedText = text.replace(/\[1,\s*(0\.\d+)\]/g, "[1.0, $1]");
            const parsedText = toml.parse(fixedText);
            setConfig(parsedText);
        }
        catch (err: any){
            setConfigError(err.message);
            console.log(configError);
        }
        finally{
            setConfigLoading(false);
            console.log("fetchConfig called ALARM ALARM");
        }
    }
    
    /* submit handler */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSimulationId(inputValue); 
        const data = new FormData(event.currentTarget);
        const simId = data.get("id") as string;
        console.log('looking for simId', simId);
        setSimulationId(simId); // !!Wichtig!! hier wird state geändert und fetchData erneut aufgerufen
    } 

    /* useEffects */
    //wenn sich sim id ändert, dann neue daten mit neuer sim id fetchen
    useEffect(() => {
        fetchData(simulationId);
    }, [simulationId])

    //wenn sich state ändert, dann setze simulationId auf state.simId (sofern da)
    useEffect(() => {
        setSimulationId(state?.simId || "");
    }, [state])

    useEffect(() => {
        if(data && data.status === "completed"){
            fetchArtifacts(data.simulationId) //gucken auf data und nicht auf eingabe?
            fetchConfig(data.simulationId)
        }
    }, [data])

    /* debug */
    useEffect(() => {
        console.log('data:', data);
    }, [data])

    //debug artifacts
    useEffect(() => {
        console.log('artifactData:', artifacts);
        console.log("artifactLink", `https://gems.hciuse.sh/simulations/${simulationId}/artifacts/`)
    }, [artifacts])

    //debug config
    useEffect(() => {
        console.log('configData:', config);
        console.log("configLink", `https://gems.hciuse.sh/simulations/${simulationId}/config/`)
    }, [config])    

  
    return(
        <>
        <div className="simloader-container">
            <form onSubmit={handleSubmit} className="result-form" > 
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

            {/** status/errorhandling fetching sim info */}

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
                    <Alert severity="warning">Status der Simulation: {data.status}</Alert>
                </div>
            )}
            </div>
        </form>    
        
        <div className="compare-wrapper">

        <div className="artifacts-compare-container">
        {artifactLoading && <CircularProgress />}

        {artifactError && 
            <div className="status-error">
                <Alert severity="error">{artifactError}</Alert>
            </div>
        }

        {artifacts.length > 0 && ( //überhaupt was da? wenn ja (> 0), dann gib aus
        <div className="artifacts">
            <h2>Plots:</h2>
            <div className="artifact-container-compare">
                {artifacts
                .filter(a => a.type === "plot") //sonst mappen wir über 4 elemente und kriegen leere divs zurück
                .map((artifact) => (
                    <div key={artifact.filename} className="artifact-item-plot">
                        {artifact.type === "plot" &&(
                            <img 
                            crossOrigin="anonymous" //muss anscheinend
                            src={`https://gems.hciuse.sh/simulations/${simulationId}/artifacts/${artifact.filename}`} 
                            alt={artifact.filename}
                            className="artifact-img-compare"
                            />
                        )}
                    </div> 
                ))}
            </div>
        </div>
        )}
        </div>

        <div className="config-container-compare">  
            {configLoading && <CircularProgress />}

            {configError && 
                <div className="status-error">
                    <Alert severity="error">{configError}</Alert>
                </div>
            }        

            {config && (
                <div className="config">
                    <h2>Parameter:</h2>
                    <div className="config-container-compare">
                        <div className="config-general-compare">
                            <h3>Allgemein</h3>
                            <p><strong>ID:</strong> {simInfo?.id}</p>
                            <p><strong>Seed:</strong> {simInfo?.seed}</p>
                            <p><strong>Startdatum:</strong> {simInfo?.startdate}</p>
                            <p><strong>Enddatum:</strong> {simInfo?.enddate}</p>
                        </div>
                        <div className="config-population-compare">
                            <h3>Population</h3>
                            <p><strong>Bevölkerungszahl:</strong> {popInfo?.n}</p>
                            <p><i>durchschn. Haushaltsgröße: {popInfo?.avg_household_size}</i></p>
                            <p><i>durchschn. Bürogröße: {popInfo?.avg_office_size}</i></p>
                            <p><i>durchschn. Schulgröße: {popInfo?.avg_school_size}</i> </p>
                        </div>
                        <div className="config-pathogen-compare">
                            <h3>Infektion</h3>
                            <p><strong>Pathogen: </strong>{pathogenTypeInfo?.pathogen}</p>
                            <p><strong>Übertragungsrate: </strong>{pathogenInfo?.transmission_function?.parameters?.transmission_rate}</p>
                            <p></p>
                        </div>
                        <div className="config-interventions-compare">
                            <h3>Interventionen</h3>
                            {interventionInfo.map((i: any, index: number) => (
                            <div key={index}>
                                <p><strong>Typ: </strong>{i.type}</p>
                                <p><strong>Ausgelöst bei: </strong>{i.trigger}</p>
                                <p><strong>Dauer: </strong>{i.duration} Tage</p>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                )} 
            </div>  
            </div>
        </div>
        </>
        )
}