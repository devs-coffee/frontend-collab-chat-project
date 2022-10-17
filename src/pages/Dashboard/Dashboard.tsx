import { useState } from "react";
import { useSelector } from "react-redux";

import DashboardServersHeading from "../../components/DashboardServersHeading/DashboardServersHeading";
import DashboardPanel from "../../components/DashboardPanel/DashboardPanel";
import ServerCreationForm from "../../components/ServerCreationForm/ServerCreationForm";

import "./Dashboard.scss";

export default function Dashboard() {
    const [isAddingServer, setAddingServer] = useState<boolean>(false);
    

    return (
        <div className="Dashboard">
            <h2>Dashboard works !</h2>
            <DashboardServersHeading addingServer={setAddingServer} />
            {!isAddingServer && <DashboardPanel />}
            {isAddingServer && (
                <div>
                    <span onClick={() => setAddingServer(false)}>demande d'ajout de serveur</span>
                    <ServerCreationForm setAddingServer={setAddingServer}/>
                </div>
            )}
        </div>
    )
}