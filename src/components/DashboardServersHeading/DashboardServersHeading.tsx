import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Stack } from '@mui/material';
import { blue, green } from '@mui/material/colors';

import { reduxData } from '../../interfaces/IReduxData';
import { Server } from '../../interfaces/IServer';

import './DashboardServersHeading.scss';

type DashboardServersHeadingProps = {
    setDashboardContent: React.Dispatch<React.SetStateAction<string>>,
}

export default function DashboardServersHeading(props:DashboardServersHeadingProps) {
    const addNewServer = () => props.setDashboardContent('addServer');
    const searchServers = () => props.setDashboardContent('searchServer');
    const servers = useSelector((state:reduxData) => {
        const serversState = {...state.servers};
        serversState.data = serversState.data.filter((server:Server) => server.isCurrentUserMember);
        return serversState;
    });
    return (
        <div className="DashboardServersHeading">
            <h3>Vos serveurs :</h3>
            { servers.status === "idle" && <span>Veuillez patienter</span> }
            { servers.error && <span>{servers.error}</span>}
            { servers.status === "succeed" &&
                <div className='DashboardServersHeading__server-stack'>
                <Stack direction="row" spacing={2}>
                     {servers.data.map((server:Server) => (
                        <Link to={`/server/${server.id}`} key={`linkto-${server.id}`} title={server.name}>
                            {server.picture ?
                                (<Avatar alt="avatar server" src={server.picture} />)
                                :
                                (<Avatar>{server.name.substring(0, 1).toUpperCase()}</Avatar>)
                            }
                        </Link>
                    ))}
                    <Avatar sx={{ bgcolor: green[500] }} onClick={addNewServer} >
                        <AddCircleIcon />
                    </Avatar>
                    <Avatar sx={{bgcolor: blue[500]}} onClick={searchServers} >
                        <SearchIcon />
                    </Avatar>
                </Stack>
                </div>
            }
        </div>
    )
}