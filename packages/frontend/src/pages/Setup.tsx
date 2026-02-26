import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Tooltip, Zoom } from "@mui/material";


function Setup(){


    const popsizeTooltip = "Die Populationsgröße gibt an, wie viele Individuen in einer Simulation berücksichtigt werden." 
    "Eine größere Population bedeutet zum einen mehr Rechenzeit, bietet zum anderen aber vollwertigerere Ergebnisse.";

    const transmissionrateTooltip = "Die Übertragungsrate gibt an, wie wahrscheinlich es ist, dass ein Virus von einer infizierten Person auf eine gesunde Person übertragen wird."
     "Eine höhere Übertragungsrate repräsentiert ein ansteckenderes Virus.";

    const interventionTooltip = "Interventionen beschreiben Gegenmaßnahmen, die ergriffen werden können, um die Ausbreitung eines Virus innerhalb der Bevölkerung zu reduzieren.";

    const householdsizeTooltip = "Beschreibt, wie viele Individuen im Durchschnitt in einem Haushalt zusammenleben. Mehr Personen in einem Haushalt kann die Ausbreitung von Viren begünstigen.";

    const officesizeTooltip = "Beschreibt, wie viele Individuen im Durchschnitt in einem Büro zusammenarbeiten. Mehr Personen in einem Büro kann die Ausbreitung von Viren begünstigen.";
    
    const schoolsizeTooltip = "Beschreibt, wie viele Individuen im Durchschnitt eine einzelne Schule besuchen. Mehr Personen in einer Schule kann die Ausbreitung von Viren begünstigen.";

    const startdateTooltip = "Das Startdatum gibt an, wann die Simulation beginnen soll."; //maybe auswirkung von Zeitraum ergänzen

    const enddateTooltip = "Das Enddatum gibt an, wann die Simulation enden soll.";

    const seedTooltip = "Der Seed ist eine Zahl, die als Referenzwert für Zufallsereignisse in der Simulation dient. Gleiche Seeds führen zum gleichen Auftreten von Zufallsereignissen."; //ist das korrekt?

    //direkt on submit zur result view navigieren
    const navigate = useNavigate();

    //placeholder-params
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

    //submithandler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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

        //api call
        try {
            const res = await fetch("https://gems.hciuse.sh/simulations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(parameter)
            });

            if (res.ok) {
                const result = await res.json();
                console.log("Created:", result);
                navigate("/success", { state: { simId: result.simulationId } }); //gehe direkt zur success View
            }
        } catch (error) {
            console.error("Error:", error);
        }        
    }

    //TODO: default-werte in inputfelder geben 
    //TODO: tooltip für alle parameter, interventionen disabled + aus payload entfernen
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
                            <p>Hier wird die  <i>Populationsgröße</i> eingegeben</p>
                            <input name="popSize" type="number" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.popSize}</p>
                            )
                            )}</div>
                        </div>
                        </Tooltip>
                        <Tooltip title={transmissionrateTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p>Hier wird die <i>Übertragungsrate</i> angegeben</p>
                            <input name="transmissionRate" type="number" step="0.01" min="0" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.transmissionRate}</p>
                            )
                            )}</div>
                        </div>
                        </Tooltip>
                        <Tooltip title={interventionTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param" id="intervention-param">
                            <p>Hier wird die <i>Intervention</i> angegeben</p>
                            <input name="intervention" type="text"/>
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.intervention}</p>
                            )
                            )}</div>                        
                        </div>
                        </Tooltip>
                    </div>
                    {/** second row */}
                    <div className="setup-row">
                        <Tooltip title={householdsizeTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p>Hier wird die <i>Household Size</i> angegeben</p>
                            <input name="avgHouseholdSize" type="number" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.avgHouseholdSize}</p>
                            )
                            )}</div>
                        </div>
                        </Tooltip>
                        <Tooltip title={schoolsizeTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p>Hier wird die <i>School Size</i> angegeben</p>
                            <input name="avgSchoolSize" type="number" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.avgSchoolSize}</p>
                            )
                            )}</div>
                        </div>
                        </Tooltip>
                        <Tooltip title={officesizeTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p>Hier wird die <i>Office Size</i> angegeben</p>
                            <input name="avgOfficeSize" type="number" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.avgOfficeSize}</p>
                            )
                            )}</div>                        
                        </div>
                        </Tooltip>
                    </div>
                    {/** third row */}
                    <div className="setup-row">
                        <Tooltip title={startdateTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p>Hier wird das <i>Startdatum</i> angegeben</p>
                            <input name="startDate" type="date" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.startDate}</p>
                            )
                            )}</div>                        
                        </div>
                        </Tooltip>
                        <Tooltip title={enddateTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p>Hier wird das <i>Enddatum</i> angegeben</p>
                            <input name="endDate" type="date" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.endDate}</p>
                            )
                            )}</div>                        
                        </div>
                        </Tooltip>
                        <Tooltip title={seedTooltip} placement="right" arrow slots={{transition: Zoom}} slotProps={{tooltip:{sx:{fontSize: "0.9rem", maxWidth: "180px"}}}}>
                        <div className="param">
                            <p>Hier wird der <i>Seed</i> angegeben</p>
                            <input name="seed" type="number" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.seed}</p>
                            )
                            )}</div>                        
                        </div>
                        </Tooltip>
                    </div>
                    <button type="submit" className="button-container start-button">
                        Simulation starten
                    </button>      
                    <div className="error-container">
                        {/**hier errornachricht */}
                    </div>           
                </div>       
            </form>
            </div>
            <Footer />        
        </>
    )
}

export default Setup;