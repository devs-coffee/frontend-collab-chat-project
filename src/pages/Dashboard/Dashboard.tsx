import { useEffect, useState } from "react";
import { DashboardPanel, DashboardServersHeading, ServerCreationForm, ServerSearching } from "../../components";
import "./Dashboard.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchServers } from "../../redux/serversSlice";

export function Dashboard() {
    const [dashboardContent, setDashboardContent] = useState<string>('');

    const dispatch = useDispatch<AppDispatch>();
    const serversStatus = useSelector((state: any) => state.servers.status)

    useEffect(() => {
        if (serversStatus === "idle") {
            dispatch(fetchServers());
          }
    })
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