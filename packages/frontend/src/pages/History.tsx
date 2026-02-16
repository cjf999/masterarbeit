//import Components

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
//import { useEffect, useState } from "react";

//import Routes
import { Link } from "react-router-dom";

/** 
interface Simulation{
    id: string;
    name: string;
}
*/

const History = () => {

    /** 
    const [testusers, setTestusers] = useState<Simulation[]>([]);

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((data) => setTestusers(data))
    
    })
    */

    //array aus simulationen mit id
    const simulationen = [
        { id: 1, title: "Simulation 1"},
        { id: 2, title: "Simulation 2"},
        { id: 3, title: "Simulation 3"}
    ]


    return(
    <>
        <Navbar />
        <h1>Vergangene Simulationen</h1>
        
        {/* 
            <h2>(dummy content f. test von api)</h2>
        <ul className="api-test">
            {testusers.map((testusers) => (
                <li key={testusers.id} >
                    <Link to={`/history/${testusers.id}`}>
                        <h2>{testusers.name}</h2>
                    </Link>
                    <p>Testuser-ID ist {testusers.id}</p>
                    
                </li>
            ))}
        </ul>
        */}
        

        
        <ul className="ul-history" style={{listStyle: "none", display: "flex", justifyContent: "space-around"}}>
            {simulationen.map((item) => ( //gehe über das array, gib pro id die entsprechende sim aus
                <li key={item.id} className="li-history">
                    <Link to={`/history/${item.id}`}>
                        <h2>{item.title}</h2>
                    </Link>
                </li>
            ))}
        </ul>
        <Footer />
    </>
    )
}

export default History;