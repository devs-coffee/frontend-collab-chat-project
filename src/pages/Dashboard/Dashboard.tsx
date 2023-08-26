import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardPanel, DashboardServersHeading, ServerCreationForm, ServerSearching } from "../../components";
import { reduxData } from "../../interfaces/IReduxData";
import { fetchPrivateChannels } from "../../redux/privateChansSlice";
import { fetchServers } from "../../redux/serversSlice";
import { AppDispatch } from "../../redux/store";

import "./Dashboard.scss";

export function Dashboard() {
    const [dashboardContent, setDashboardContent] = useState<string>('');

    const dispatch = useDispatch<AppDispatch>();
    const serversStatus = useSelector((state: reduxData) => state.servers.status);
    const privateChannelsStatus = useSelector((state: reduxData) => state.privateChans.status);

    useEffect(() => {
        if (serversStatus === "idle") {
            dispatch(fetchServers());
        }
        if(privateChannelsStatus === "idle") {
            dispatch(fetchPrivateChannels())
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