import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function Setup(){

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

    /** 
    interface simData {
        populationSize: number; // zwischen 0 und 1,000,000
        transmissionRate: number; // zwischen 0.1 und 0.9
        avgHouseholdSize: number;
        avgOfficeSize: number;
        avgSchoolSize: number;
        batchRuns: 1; //idk ob das geht
        interventions: string;
        startDate: string;
        endDate: string;
        seed: number;
    }
    */

    //submithandler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const values = Object.fromEntries(data.entries());

        //übergebe params im erwarteten format
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
            "startDate": values.startDate,
            "endDate": values.endDate,
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
                navigate("/result", { state: { simId: result.simulationId } }); //gehe direkt zur Result View
            }
        } catch (error) {
            console.error("Error:", error);
        }        
    }

    //TODO: default-werte in inputfelder geben 
    return(
        <>
        <Navbar />
            <h2 style={{paddingLeft: "50px", marginTop: "35px"}}>Nachfolgend die Parameter eingeben:</h2>
            <form className="setup-form" onSubmit={handleSubmit}>
                <div className="input-rows"> {/** ich bin dumm, das sind columns, nicht rows */}
                    <div className="setup-row">
                        <div className="param">
                            <p>Hier wird die  <i>Populationsgröße</i> eingegeben</p>
                            <input name="popSize" type="number" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.popSize}</p>
                            )
                            )}</div>
                        </div>
                        <div className="param">
                            <p>Hier wird die <i>Übertragungsrate</i> angegeben</p>
                            <input name="transmissionRate" type="number" step="0.01" min="0" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.transmissionRate}</p>
                            )
                            )}</div>
                        </div>
                        <div className="param">
                            <p>Hier wird die <i>Intervention</i> angegeben</p>
                            <input name="intervention" type="text" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.intervention}</p>
                            )
                            )}</div>                        
                        </div>
                    </div>
                    {/** second row */}
                    <div className="setup-row">
                        <div className="param">
                            <p>Hier wird die <i>Household Size</i> angegeben</p>
                            <input name="avgHouseholdSize" type="number" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.avgHouseholdSize}</p>
                            )
                            )}</div>
                        </div>
                        <div className="param">
                            <p>Hier wird die <i>School Size</i> angegeben</p>
                            <input name="avgSchoolSize" type="number" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.avgSchoolSize}</p>
                            )
                            )}</div>                        
                        </div>
                        <div className="param">
                            <p>Hier wird die <i>Office Size</i> angegeben</p>
                            <input name="avgOfficeSize" type="number" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.avgOfficeSize}</p>
                            )
                            )}</div>                        
                        </div>
                    </div>
                    {/** third row */}
                    <div className="setup-row">
                        <div className="param">
                            <p>Hier wird das <i>Startdatum</i> angegeben</p>
                            <input name="startDate" type="date" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.startDate}</p>
                            )
                            )}</div>                        
                        </div>
                        <div className="param">
                            <p>Hier wird das <i>Enddatum</i> angegeben</p>
                            <input name="endDate" type="date" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.endDate}</p>
                            )
                            )}</div>                        
                        </div>
                        <div className="param">
                            <p>Hier wird der <i>Seed</i> angegeben</p>
                            <input name="seed" type="number" />
                            <div>{params.map((item) => (
                                <p style={{fontWeight: "800"}}>Der Placeholder-Wert ist: {item.seed}</p>
                            )
                            )}</div>                        
                        </div>
                    </div>
                    <button type="submit" className="button-container start-button" >
                        Simulation starten
                    </button>                 
                </div>       
            </form>
            <Footer />        
        </>
    )
}

export default Setup;