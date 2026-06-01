import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { Tooltip, Zoom, Alert } from "@mui/material";

const popsizeTooltip = "Die Populationsgröße gibt an, wie viele Individuen in einer Simulation berücksichtigt werden." 
"Eine größere Population bedeutet zum einen mehr Rechenzeit, bietet zum anderen aber vollwertigerere Ergebnisse.";

const transmissionrateTooltip = "Die Übertragungsrate gibt an, wie wahrscheinlich es ist, dass ein Virus von einer infizierten Person auf eine gesunde Person übertragen wird."
    "Eine höhere Übertragungsrate repräsentiert ein ansteckenderes Virus.";

const interventionTooltip = "Interventionen beschreiben Gegenmaßnahmen, die ergriffen werden können, um die Ausbreitung eines Virus innerhalb der Bevölkerung zu reduzieren.";

const householdsizeTooltip = "Beschreibt, wie viele Individuen im Durchschnitt in einem Haushalt zusammenleben. Mehr Personen in einem Haushalt kann die Ausbreitung von Viren begünstigen.";

const officesizeTooltip = "Beschreibt, wie viele Individuen im Durchschnitt an einem Arbeitsplatz zusammenarbeiten. Mehr Personen an einem Arbeitsort kann die Ausbreitung von Viren begünstigen.";

const schoolsizeTooltip = "Beschreibt, wie viele Individuen im Durchschnitt eine einzelne Schule besuchen. Mehr Personen in einer Schule kann die Ausbreitung von Viren begünstigen.";

const startdateTooltip = "Das Startdatum gibt an, wann die Simulation beginnen soll. Aus Startdatum und Enddatum wird die Gesamtdauer der Simulation berechnet."; //maybe auswirkung von Zeitraum ergänzen

const enddateTooltip = "Das Enddatum gibt an, wann die Simulation enden soll. Aus Startdatum und Enddatum wird die Gesamtdauer der Simulation berechnet.";

const seedTooltip = "Der Seed ist eine Zahl, die als Referenzwert für Zufallsereignisse in der Simulation dient. Gleiche Seeds führen zum gleichen Auftreten von Zufallsereignissen.";

function Setup(){

    //direkt on submit zur result view navigieren
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    //placeholder-params
    /*
    const params = [
        {
        popSize: 100000, 
        transmissionRate: 0.5,
        avgHouseholdSize: 2,
        avgOfficeSize: 5,
        avgSchoolSize: 100,
        intervention: "self_isolation",
        startDate: "01.01.2025",
        endDate: "31.01.2025",
        seed: 1337
        }
    ] 
    */

    //submithandler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(null);

        const data = new FormData(e.currentTarget);
        const values = Object.fromEntries(data.entries());

        //übergebe params im erwarteten format (batchruns fix)
        const parameter = {
            "populationSize": Number(values.popSize),
            "transmissionRate": Number(values.transmissionRate),
            "avgHouseholdSize": Number(values.avgHouseholdSize),
            "avgOfficeSize": Number(values.avgOfficeSize),
            "avgSchoolSize": Number(values.avgSchoolSize),
            "batchRuns": 1,
            "interventions": [
                {
                    "type": values.intervention,
                    "trigger": "symptom",
                    "duration": 14
                }
            ],
            "startDate": String(values.startDate).replaceAll("-", "."), //umwandeln von dd.mm.yyyy zu dd-mm-yyyy, damit api call funktioniert
            "endDate": String(values.endDate).replaceAll("-", "."),
            "seed": Number(values.seed)
        }
        
        if (!values.startDate || !values.endDate) {
            setError("Bitte Start- und Enddatum angeben.");
            return;
        }

        //api call
        try {
            const res = await fetch("https://gems.hciuse.sh/simulations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(parameter)
            });

            if (!res.ok) { //error in abhängigkeit von serverantwort schmeißen
                if (res.status === 400) {
                    setError("Ungültiger Parameter. Überprüfen Sie ihre Eingaben!");
                } else if (res.status >= 500) {
                    setError("Serverfehler. Bitte später erneut versuchen.");
                } else {
                    setError("Fehler beim Starten der Simulation.");
                }
                return;
            }

            if (res.ok) {
                const result = await res.json();
                console.log("Created:", result);
                navigate("/result", { state: { simId: result.simulationId } }); //gehe direkt zur result view und übergib simId als simulationId
            }
        } catch (error) {
            setError("Unbekannter Error.")
            console.error("Unbekannter Error:", error);
        }        
    }

    //TODO: default-werte in inputfelder geben 
    //TODO: errorhandling als html (z.B. wenn api call fehlschlägt, oder ungültige parameter eingegeben wurden)
    //TODO: negative/ungültige eingaben abfangen
    return(
        <>
        <Navbar />
        <div className="setup-container">
            <h2>Nachfolgend die Parameter eingeben:</h2>
            <form className="setup-form" onSubmit={handleSubmit}>
                <div className="input-rows"> {/** ich bin dumm, das sind columns, nicht rows */}
                    <div className="setup-row">
                        <Tooltip title={popsizeTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p><b>Populationsgröße</b></p>
                            <input name="popSize" type="number" min="0" step="1000" defaultValue={1000000} />
                            <div>
                                <p><i>Standard-Value: 1,000,000</i></p>
                            </div>
                        </div>
                        </Tooltip>
                        <Tooltip title={transmissionrateTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p><b>Übertragungsrate</b></p>
                            <input name="transmissionRate" type="number" step="0.01" min="0" defaultValue={0.5}/>
                            <div>
                                <p><i>Standard-Value: 0,5</i></p>
                            </div>
                        </div>
                        </Tooltip>
                        <Tooltip title={interventionTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param" id="intervention-param">
                            <p><b>Intervention</b></p>
                            <input name="intervention" type="text" defaultValue={"self_isolation"}/>
                            <div>
                                <p><i>Standard-Value: "self_isolation"</i></p>
                            </div>                        
                        </div>
                        </Tooltip>
                    </div>
                    {/** second row */}
                    <div className="setup-row">
                        <Tooltip title={householdsizeTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p><b>Household Size</b></p>
                            <input name="avgHouseholdSize" type="number" min={1} defaultValue={2}/>
                            <div>
                                <p><i>Standard-Value: 2</i></p>
                            </div>
                        </div>
                        </Tooltip>
                        <Tooltip title={schoolsizeTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p><b>School Size</b></p>
                            <input name="avgSchoolSize" type="number" min={1} defaultValue={100}/>
                            <div>
                                <p><i>Standard-Value: 100</i></p>
                            </div>
                        </div>
                        </Tooltip>
                        <Tooltip title={officesizeTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p><b>Office Size</b></p>
                            <input name="avgOfficeSize" type="number" min={1} defaultValue={5}/>
                            <div>
                                <p><i>Standard-Value: 5</i></p>
                            </div>                        
                        </div>
                        </Tooltip>
                    </div>
                    {/** third row */}
                    <div className="setup-row">
                        <Tooltip title={startdateTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p><b>Startdatum</b></p>
                            <input name="startDate" type="date" />
                            <div>
                                <p><i>Standard-Value: 01.01.2025</i></p>
                            </div>                        
                        </div>
                        </Tooltip>
                        <Tooltip title={enddateTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p><b>Enddatum</b></p>
                            <input name="endDate" type="date" />
                            <div>
                                <p><i>Standard-Value: 31.01.2025</i></p>
                            </div>                        
                        </div>
                        </Tooltip>
                        <Tooltip title={seedTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p><b>Seed</b></p>
                            <input name="seed" type="number" min={0} defaultValue={1337}/>
                            <div>
                                <p><i>Standard-Value: 1337</i></p>
                            </div>                        
                        </div>
                        </Tooltip>
                    </div>
                    <div className="button-container">
                    <button type="submit" className="start-button">
                        Simulation starten
                    </button>  
                    <div className="error-container">
                        
                        {error && (
                            <Alert severity="error">
                                Fehler: {error}
                            </Alert>
                        )}
                    </div>  
                    </div>                                 
                </div>      
            </form>           
            </div>
            <Footer />        
        </>
    )
}

export default Setup;