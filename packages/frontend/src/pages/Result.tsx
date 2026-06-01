/**
 * Future Work: Auslagern von Artifacts & Config-Daten
 * -> seperation of concerns + wartbarkeit
 */

//dependencies 
import toml from "toml";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";

//components
import Footer from "../components/footer";
import Navbar from "../components/Navbar";

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

//helperfunction: checken, ob input mit "sim_" beginnt
const isValidInput = (simId: string) => {
    const pattern = /^sim_\d+$/;
    return pattern.test(simId);
}

export default function Result() {

    /* states */
    //errorhandling
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    //polling
    const [polling, setPolling] = useState(false);

    //data für fetch von sim Daten
    const [data, setData] = useState<SimulationData | null>(null);
    const [simulationId, setSimulationId] = useState(""); 
    const [inputValue, setInputValue] = useState(""); //damit nicht bei jeder zeicheineingabe simId geaändert und dadurch fetchData gecalled wird
    
    //konkrete ergebnisse (Plots  & CSV-Dateien)
    const [artifactLoading, setArtifactLoading] = useState(false);
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [artifactError, setArtifactError] = useState<string | null>(null);

    //config (hier einfach als sim-parameter-referenzen zum vergleich eingabe/ausgabe)
    const [config, setConfig] = useState<any>(null);
    const [configLoading, setConfigLoading] = useState(false);
    const [configError, setConfigError] = useState<string | null>(null);

    /* routing hooks */
    //quellen für simulationId
    const { state } = useLocation(); 
    const { simId } = useParams<{simId: string}>();    

    //navigieren
    const navigate = useNavigate();

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
    //api call für simdaten
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

    //api call für config (input params)
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
             * ggfs. TOML-config anpassen, sodass ein array/interval/übergabewert wie zb "[1, 0.0]" als [1.0, 0.0]
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
        }
    }    

    /* useEffects */

    //polling für regelmäßige requests bis ergebnisse fertig
    useEffect(() => {
        if (!polling || !simulationId) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`https://gems.hciuse.sh/simulations/${simulationId}`);
                if (!res.ok) throw new Error("Fehler beim Abrufen der Daten");

                const result = await res.json();
                setData(result);

                // wenn Simulation fertig dann polling stoppen
                if (result.status !== "running") {
                    clearInterval(interval);
                    setPolling(false);
                }

            } catch (err) {
                console.error(err);
            }

        }, 3000); // alle 3 Sekunden

        return () => clearInterval(interval);

    }, [polling, simulationId]);    

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

   //wenn data da und sim erfolgreich, dann hole restliche daten 
   useEffect(() => {
        if(data && data.status === "completed"){
            fetchArtifacts(data.simulationId) //gucken auf data und nicht auf eingabe?
            fetchConfig(data.simulationId)
        }
    }, [data])

    /* submit handler */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!isValidInput(inputValue)){
            setError("Ungültige SimulationID! Das Format muss sim_123456789 sein.")
            return;
        }

        navigate(`/result/${inputValue}`);

        setSimulationId(inputValue);

        
        setPolling(true); // Polling starten
        // const data = new FormData(event.currentTarget);
        // const simId = data.get("id") as string;
        console.log('looking for simId', simId);
        // setSimulationId(simId); 
    }

    /* debug */
    //wenn data sich ändert, dann loggen (debug)
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
        <Navbar />
        <div className="result-container">
        <h1>Result View</h1>

        <form onSubmit={handleSubmit} className="result-form" > 
            <p style={{textAlign: "center"}}>Geben Sie hier die ID der Simulation ein, um die Ergebnisse einzusehen:</p>
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
            {polling && <CircularProgress />}
            {error && 
                <div className="status-error">
                    <Alert severity="error">{error}</Alert>
                </div>
            }
            {data && data.status === "completed" && (
                <div className="status-success">
                    <Alert severity="success">Status der Simulation: {data.status}</Alert>
                </div>
            )}
            {data && data.status !== "completed" && (
                <div className="status-failed">
                    <Alert severity="warning">Status der Simulation: {data.status}</Alert>
                </div>
            )}
            </div>
        </form>

        {/** status/errorhandling fetching sim artifacts */}
        {artifactLoading && <CircularProgress />}

        {artifactError && 
            <div className="status-error">
                <Alert severity="error">{artifactError}</Alert>
            </div>
        }

        {artifacts.length > 0 && ( //überhaupt was da? wenn ja (> 0), dann gib aus
        <div className="artifacts">
            <h2>Plots:</h2>
            <div className="artifact-container">
                {artifacts
                .filter(a => a.type === "plot") //sonst mappen wir über 4 elemente und kriegen leere divs zurück
                .map((artifact) => (
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
        </div>
        )}

        {/** status/errorhandling fetching sim config (referenzwerte aus input params) */}
        {configLoading && <CircularProgress />}

        {configError && 
            <div className="status-error">
                <Alert severity="error">{configError}</Alert>
            </div>
        }

        {config && (
            <div className="config">
                <h2>Parameter:</h2>
                <div className="config-container">
                    <div className="config-general">
                        <h3>Allgemein</h3>
                        <p><strong>ID:</strong> {simInfo?.id}</p>
                        <p><strong>Seed:</strong> {simInfo?.seed}</p>
                        <p><strong>Startdatum:</strong> {simInfo?.startdate}</p>
                        <p><strong>Enddatum:</strong> {simInfo?.enddate}</p>
                    </div>
                    <div className="config-population">
                        <h3>Population</h3>
                        <p><strong>Bevölkerungszahl:</strong> {popInfo?.n}</p>
                        <p><i>durchschn. Haushaltsgröße: {popInfo?.avg_household_size}</i></p>
                        <p><i>durchschn. Bürogröße: {popInfo?.avg_office_size}</i></p>
                        <p><i>durchschn. Schulgröße: {popInfo?.avg_school_size}</i> </p>
                    </div>
                    <div className="config-pathogen">
                        <h3>Infektion</h3>
                        <p><strong>Pathogen: </strong>{pathogenTypeInfo?.pathogen}</p>
                        <p><strong>Übertragungsrate: </strong>{pathogenInfo?.transmission_function?.parameters?.transmission_rate}</p>
                        {pathogenInfo?.transmission_function?.parameters?.transmission_rate > 0.5 && (
                            <Alert severity="error">Hohe Ansteckungsgefahr!</Alert>
                            
                        )}
                    </div>
                    <div className="config-interventions">
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

        {artifacts.length > 0 && (   
        <div className="csv">
            <h2>Downloads:</h2>
            <p><i>Hier können Sie die Rohdaten der Plots herunterladen</i></p>
            <div className="csv-container">
            {artifacts
            .filter(a => a.type === "csv") //sonst mappen wir über 4 elemente und kriegen leere divs zurück
            .map ((artifact) => (
                <div key={artifact.filename} className="csv-download-container">
                    {artifact.type === "csv" && (
                        <div className="csv-download">
                            <p>{artifact.filename}</p>

                            {" | "}

                            <a
                                href={`https://gems.hciuse.sh/simulations/${simulationId}/artifacts/${artifact.filename}`}
                                download
                            >
                                Daten herunterladen
                            </a>
                        </div>
                    )}
                </div>
            ))}
            </div>
        </div>
        )} 
        </div>         
        <Link className="return-link" to={"/"}>Zurück zur Startseite</Link>
        <Footer />
        </>
    )
}