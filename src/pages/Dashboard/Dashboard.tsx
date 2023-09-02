import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { DashboardPanel, DashboardServersHeading, ServerCreationForm, ServerSearching } from "../../components";
import { reduxData } from "../../interfaces/IReduxData";
import { fetchPrivateChannels, setPrivateChannels } from "../../redux/privateChansSlice";
import { fetchServers } from "../../redux/serversSlice";
import { addUsers } from "../../redux/usersSlice";
import { AppDispatch } from "../../redux/store";
import { ChannelService } from "../../services/channelService";
import { UserService } from "../../services/userService";

import "./Dashboard.scss";

const getPrivateChans = async () => {
    const response = await new ChannelService().getPrivateChannels();
    const channels = response.result;
    let userIds: string[] = [];
    for(let chan of response.result) {
        userIds = userIds.concat(chan.users)
    }
    return {channels, userIds};
}

export function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const serversStatus = useSelector((state: reduxData) => state.servers.status);
    const privateChannelsStatus = useSelector((state: reduxData) => state.privateChans.status);
    const users = useSelector((state: reduxData) => state.users.data);
    const [dashboardContent, setDashboardContent] = useState<string>('');

    useEffect(() => {
        if (serversStatus === "idle") {
            dispatch(fetchServers());
        }
        if(privateChannelsStatus === "idle") {
            getPrivateChans()
            .then(data => {
                dispatch(setPrivateChannels(data.channels))
                let usersToAdd = [];
                for(let userId of data.userIds) {
                    if(!users.find(user => user.id === userId)) {
                        usersToAdd.push(userId);
                    }
                }
                new UserService().getUsers(usersToAdd.join(",")).then(fetchedUsers => {
                    dispatch(addUsers(fetchedUsers.result));
                });
            })
            .catch(error => {
                console.log(error);
            }) 
            //dispatch(fetchPrivateChannels())
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