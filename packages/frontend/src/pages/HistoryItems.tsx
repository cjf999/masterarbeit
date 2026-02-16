//import Components

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";


/** 
interface SimulationItems{
    id: string;
    title: string;
    completed: boolean;
}
*/

const HistoryItems = () => {

    const {id} = useParams();

    // const [todos, setTodos] = useState<SimulationItems[]>([]);
    /** 
    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/users/${id}/todos`) //template literal anscheinend immer wenn params genutzt werden sollen
        .then((response) => response.json())
        .then((data) => setTodos(data))
        // .catch((error) => console.error("Error beim fetchen der Todos der testuser"));
    }, [id])
    */

    return(
        <>
            <Navbar />
            <div>
                <h1>Sim {id} wird angezeigt</h1>

                {/** 
                <ul>
                    {todos.map((id) => (
                        <li key={todo.id}>
                            <h4>Der gefundene ToDo-Titel ist: {todo.title}</h4>
                            <p>Status des ToDos: {todo.completed ? "Erledigt" : "💩"}</p>
                        </li>
                    )
                )}
                </ul>
                */}

                <h3>
                    <Link to={"/history"}>Zurück</Link>
                </h3>
                
            </div>
            
            <Footer />
        </>
    )
}

export default HistoryItems
