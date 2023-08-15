import { useState } from "react";
import { DashboardPanel, DashboardServersHeading, ServerCreationForm, ServerSearching } from "../../components";
import "./Dashboard.scss";

export function Dashboard() {
    const [dashboardContent, setDashboardContent] = useState<string>('');

    return (
        <div className="Dashboard">
            <DashboardServersHeading setDashboardContent={setDashboardContent} />
            <h2>Dashboard</h2>
            {dashboardContent === '' && <DashboardPanel />}
            {dashboardContent === 'addServer' && (
                <ServerCreationForm setDashboardContent={setDashboardContent} />
            )}
            {dashboardContent === 'searchServer' && (
                <ServerSearching />
            )}
        </div>
    )
}