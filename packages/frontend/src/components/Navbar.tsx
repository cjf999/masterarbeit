import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar(){

    const navigate = useNavigate();
    const routeChange = () =>{
        const path = "/";
        navigate(path)
    }

    return(
        <nav className="navbar">
            <div className="navbar-content">
                { /*
                <Link className="setup-link" to="/setup" >
                    Setup
                </Link>
                */}
                <h2 onClick={routeChange} style={{cursor: "pointer"}}>GEMS Interface</h2>
                <ul>
                    <NavLink className="nav-link" to="/setup">Setup</NavLink>
                    <NavLink className="nav-link" to="/result">Result</NavLink>
                    <NavLink className="nav-link" to="/compare">Compare</NavLink>    
                    <NavLink className="nav-link" to="/history">History</NavLink>
                </ul>
            </div>
        </nav>
    )
}