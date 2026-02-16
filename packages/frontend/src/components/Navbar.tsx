import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar(){
    return(
        <nav className="navbar">
            <div className="navbar-content">
                <Link className="setup-link" to="/setup" >
                    Setup
                </Link>
                <h2>GEMS Interface</h2>
                <ul>
                    <CustomLink to="/result">Result</CustomLink>
                    <CustomLink to="/compare">Compare</CustomLink>    
                    <CustomLink to="/history">History</CustomLink>
                </ul>
            </div>
        </nav>
    )
}

//TODO: reparieren, funktioniert so nicht
function CustomLink({ to, children, ...props}: {to: any, children: any}){

    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({path: resolvedPath.pathname, end: true});

    return(
        <>
            <li className={isActive ? "active": ""}>
                <Link to={to} {...props}>
                    {children}
                </Link>
            </li>
        </>
    )
}