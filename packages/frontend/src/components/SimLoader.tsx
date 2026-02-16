import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
//import other components
import Footer from "./footer";
import Navbar from "./Navbar";

export default function SimLoader(){
    
    //holt state prop aus location um {id} anhängen zu können
    const { state } = useLocation(); 

    //simulationId auf leeren string setzen
    const [simulationId, setSimulationId] = useState(""); 
    const [data, setData] = useState(null);

    //wenn sich sim id ändert, dann neue daten mit neuer sim id fetchen
    useEffect(() => {
        fetchData(simulationId);
    }, [simulationId])

    //wenn sich state ändert, dann setze simulationId auf state.simId (sofern da)
    useEffect(() => {
        setSimulationId(state?.simId || "");
    }, [state])

    //api call
    const fetchData = (simId: string | null) => {
        if (!simId) return;
        console.log("fetching", "https://gems.hciuse.sh/simulations/" + simId)
        fetch("https://gems.hciuse.sh/simulations/" + simId).then(async res => {
            setData(await res.json())
        });
    }

    //debugging
    useEffect(() => {
        console.log('data:', data);
    }, [data])

    //submithandler 
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const simId = data.get("id") as string;
        console.log('looking for simid', simId);
        setSimulationId(simId);
    }     

    return(
        <>
            <Navbar /> 
            <h2>SimLoader-Component</h2>
            <form onSubmit={handleSubmit} className="result-form">
                <div>
                    {
                        simulationId ? <input name="id" type="text" value={simulationId} /> : <input name="id" type="text" />
                    }
                </div>
            </form>
            <Footer />
        </>
        )
}