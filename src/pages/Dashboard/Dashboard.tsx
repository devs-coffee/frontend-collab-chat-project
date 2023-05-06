import { useState } from "react";

import DashboardPanel from "../../components/DashboardPanel/DashboardPanel";
import DashboardServersHeading from "../../components/DashboardServersHeading/DashboardServersHeading";
import ServerCreationForm from "../../components/ServerCreationForm/ServerCreationForm";
import ServerSearching from '../../components/ServerSearching/ServerSearching';

import "./Dashboard.scss";

export default function Dashboard() {
    const [dashboardContent, setDashboardContent] = useState<string>('');

    return (
        <div className="Dashboard">
            <DashboardServersHeading setDashboardContent={setDashboardContent} />
            <h2>Dashboard</h2>
            {dashboardContent === '' && <DashboardPanel />}
            {dashboardContent === 'addServer' && (
                <ServerCreationForm setDashboardContent={setDashboardContent}/>
            )}
            {dashboardContent === 'searchServer' && (
                <ServerSearching />
            )}
        </div>
    )
}