import { useState } from "react";

import DashboardServersHeading from "../../components/DashboardServersHeading/DashboardServersHeading";
import DashboardPanel from "../../components/DashboardPanel/DashboardPanel";

import "./Dashboard.scss";



export default function Dashboard() {
    const [isAddingServer, setAddingServer] = useState<boolean>(false)
    
    return (
        <div className="Dashboard">
            <h2>Dashboard works !</h2>
            <DashboardServersHeading addingServer={setAddingServer}/>
            <DashboardPanel />
            {isAddingServer && (<span onClick={() => setAddingServer(false)}>demande d'ajout de serveur</span>)}
        </div>
    )
}