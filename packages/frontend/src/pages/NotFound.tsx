import { Link } from "react-router-dom";
import Footer from "../components/footer";

export default function NotFound(){
    return(
        <>
        <div style={{textAlign: "center"}}>
        <h1>Diese Seite existiert nicht</h1>
        <Link to="/">Zurück zur Startseite</Link>
        </div>
        <Footer></Footer>
        </>
    )
}