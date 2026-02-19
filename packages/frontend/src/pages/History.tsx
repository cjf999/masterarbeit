//import Components
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
//import { useEffect, useState } from "react";
import { Table, TableHead, TableBody, TableContainer, TableRow, TableCell } from "@mui/material";

//import Routes

const History = () => {

    //creating dummy simulationsdaten
    function createData(
        id: string,
        seed: number,
        individuals: number,
        infections: number,
        householdSize: number,
        transmissionRate: number,
        reproductionNumber: number,
        attackRate: number,
        startDate: string,
        endDate: string,
    ){
        return{id, seed, individuals, infections, householdSize, transmissionRate, reproductionNumber, attackRate, startDate, endDate};
    }

    const rows = [
        createData("sim_1771331080051", 420, 10000, 4562, 1, 0.3, 0.8, 0.45, "01.01.2025", "01.07.2025"),
        createData("sim_0000000000000", 201, 10000, 2000, 1, 0.2, 0.7, 0.46, "01.01.2025", "01.07.2025"),
        createData("sim_0000000000001", 202, 11000, 2000, 1, 0.2, 0.6, 0.47, "01.01.2025", "01.07.2025")
    ]

    //dummy content: array aus simulationen mit id
    {/** 
    const simulationen = [
        { id: 1, title: "Simulation 1"},
        { id: 2, title: "Simulation 2"},
        { id: 3, title: "Simulation 3"}
    ]
    */}

    return(
    <>
        <Navbar />
        <h2>Vergangene Simulationen</h2>
        {/** 
        <ul className="ul-history" style={{listStyle: "none", display: "flex", justifyContent: "space-around"}}>
            {simulationen.map((item) => ( //gehe über das array, gib pro id die entsprechende sim aus
                <li key={item.id} className="li-history">
                    <Link to={`/history/${item.id}`}>
                        <h2>{item.title}</h2>
                    </Link>
                </li>
            ))}
        </ul>
        */}

        <div className="table-history" style={{textAlign: "center", display: "flex",alignItems: "center", justifyContent: "center"}}>
            <TableContainer style={{maxWidth: "1200px", fontSize: "1rem"}}> 
            <Table aria-label="simple table" align="center" stickyHeader>
            <TableHead>
                <TableRow sx={{backgroundColor: "#E1E4E8"}}>
                    <TableCell >ID</TableCell>
                    <TableCell>Seed</TableCell>
                    <TableCell>Individuals</TableCell>
                    <TableCell>Infections</TableCell>
                    <TableCell>Household Size</TableCell>
                    <TableCell>Transmission Rate</TableCell>
                    <TableCell>Reproduction Number</TableCell>
                    <TableCell>Attack Rate</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">{row.id}</TableCell>
                        <TableCell align="right">{row.seed}</TableCell>
                        <TableCell align="right">{row.individuals}</TableCell>
                        <TableCell align="right">{row.infections}</TableCell>
                        <TableCell align="right">{row.householdSize}</TableCell>
                        <TableCell align="right">{row.transmissionRate}</TableCell>
                        <TableCell align="right">{row.reproductionNumber}</TableCell>
                        <TableCell align="right">{row.attackRate}</TableCell>
                        <TableCell align="right">{row.startDate}</TableCell>
                        <TableCell align="right">{row.endDate}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
            </TableContainer>
        </div>
        <Footer />
    </>
    )
}

export default History;